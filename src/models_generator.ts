import * as util from "util";
import * as fs from "fs";
import template from "./template";
import utils from "./utils";
import log from "./logger";
import * as types from "./types";

function hookValue(type:string){
    switch(type.toLocaleLowerCase()){
    case "unix":
    case "unixtime":
    case "unix-time":
        return "new Date().getTime()";
        break;

    case "date":
        return "new Date().toISOString().slice(0, 10)";
        break;

    case "time":
        return "new Date().toISOString().slice(11, 19)";
        break;

    case "datetime":
    case "date-time":
        return "new Date().toISOString()";
        break;

    default:
        return type;
        break;
    }
}

function makeHook(fieldName: string|undefined, schemaItem: types.SchemaItem): types.hookData {
    const result: types.hookData = {
        onCreate: {},
        onUpdate: {}
    };

    const props = schemaItem.type === "object" ? schemaItem.properties : schemaItem.items?.type === "object" ? schemaItem.items.properties : schemaItem;
    // if SchemaItem.type array or object, then run recursively
    if (schemaItem.type === "object" || schemaItem.items?.type === "object") {
        Object.keys(props).forEach((key) => {
            const val = props[key];
            const subObj = makeHook(key, val);

            // merge subObj into result with object key prefix by "key"
            Object.keys(subObj.onCreate).forEach((subKey: string) => {
                const nestedFieldsName = [fieldName, subKey].filter((x)=>x).join(".");
                result.onCreate[nestedFieldsName] = subObj.onCreate[subKey];
            });
            Object.keys(subObj.onUpdate).forEach((subKey: string) => {
                const nestedFieldsName = [fieldName, subKey].filter((x)=>x).join(".");
                result.onUpdate[nestedFieldsName] = subObj.onUpdate[subKey];
            });

        });
    }
    else if (fieldName){
        if (schemaItem["x-onCreateValue"]) {
            result.onCreate[fieldName] = hookValue(schemaItem["x-onCreateValue"]);
        }
        if (schemaItem["x-onUpdateValue"]) {
            result.onUpdate[fieldName] = hookValue(schemaItem["x-onUpdateValue"]);
        }
    }
    
    return result;
}

function json2MongooseChunk(schemaProperties: types.jsonSchema["properties"], compilerOptions:types.compilerOptions ): types.mongooseSchemaDefinition {

    const mongooseSchema: types.mongooseSchemaDefinition = {};
    const requiredFields = schemaProperties.required || [];
    const indexFields = schemaProperties.index || [];

    for (const fields in schemaProperties.properties) {

        const prop = schemaProperties.properties[fields];

        if ( !compilerOptions.use_id && fields === "_id" ){
            continue;
        }

        if (typeof prop.type !== "string") {
            throw new Error(`prop.type must be a string, received [${typeof prop!.type}]`);
        }
        
        let type: any;

        switch (prop!.type.toLowerCase()) {
        case "string":
            if ( prop['x-foreignKey'] ){
                const collection = prop['x-foreignKey'];
                const fkType = prop['x-format'] == 'ObjectId' ? 'Schema.Types.ObjectId' : "String";
                type =  `{{[{ type: ${fkType}, ref: '${collection}' }]}}`;
            }
            else{
                type = "{{String}}";
            };
            break;
        case "integer":
        case "float":
        case "number":
            type = "{{Number}}";
            break;
        case "boolean":
            type = "{{Boolean}}";
            break;
        case "null":
            type = "{{null}}";
            break;
        case "array":
            type = [json2MongooseChunk({ properties: prop.items.properties }, compilerOptions)];
            break;
        case "object":
            break;
        default:
            throw new Error(`Unsupported type [${prop.type}]`);
            break;
        }

        if(prop.type === "object"){
            console.log();
            mongooseSchema[fields] = json2MongooseChunk({ properties: prop.properties }, compilerOptions);
            continue;
        }
        else{
            // loop trough all the properties
            mongooseSchema[fields] = {
                type: type,
                index: prop.index || indexFields.includes(fields) || Boolean(prop["x-foreignKey"]) || false,
                required: prop.required || requiredFields.includes(fields) || false,
            };

            if (prop.default) {
                mongooseSchema[fields].default = prop.default;
            }

            // if (prop["x-foreignKey"]) {
            //     mongooseSchema[fields].ref = prop["x-foreignKey"];
            // }
        }
    }

    return mongooseSchema;
}

export function json2Mongoose(
    jsonSchema: types.jsonSchema,
    interfacePath: string,
    compilerOptions?: types.compilerOptions
): string {
    if (!jsonSchema["x-documentConfig"]) {
        throw new Error("( jsonSchema.x-documentConfig : object ) is required");
    }
    const documentConfig = jsonSchema["x-documentConfig"];
    const documentName = documentConfig.documentName;

    // convert json to string
    const schema = json2MongooseChunk(jsonSchema, compilerOptions || utils.defaultCompilerOptions);
    const schemaString = util.inspect(schema, { depth: null });

    // replace all '{{Type}}' to Type, avoid it to be a string with quote "Type".
    const mongooseSchema = schemaString.replace(/'{{/g, "").replace(/}}'/g, "").replace(/"{{/g, "").replace(/}}"/g, "");

    // get hook resource
    const hookData = makeHook(undefined, jsonSchema as types.SchemaItem);

    return template.modelsTemplate(interfacePath, documentName, mongooseSchema, hookData, compilerOptions || utils.defaultCompilerOptions);
}

export async function compileFromFile(jsonSchemaPath: string, modelToInterfacePath: string, outputPath: string, compilerOptions?: types.compilerOptions) {
    try {
        
        log.process(`Model : ${jsonSchemaPath} > ${outputPath}`);
        const jsonSchemaBuffer = fs.readFileSync(jsonSchemaPath);
        const jsonSchema = JSON.parse(jsonSchemaBuffer.toString());
        const mongooseSchema = json2Mongoose(jsonSchema, modelToInterfacePath, compilerOptions || utils.defaultCompilerOptions);
        // console.log(mongooseSchema);
        
        fs.writeFileSync(outputPath, mongooseSchema);
        return mongooseSchema;
    }
    catch (err: any) {
        throw new Error(`Processing File [${jsonSchemaPath}] :\n ${(err.message || err)}`);
    }
}