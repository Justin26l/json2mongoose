import * as util from "util";
import * as fs from "fs";
import template from "./template";
import utils from "./utils";
import { compilerOptions } from "./types";

function json2MongooseChunk (jsonSchema:{[key:string]:any}) :Object {

    const mongooseSchema : {[key:string]: {
        type: any,
        required?: boolean,
        index?: boolean,
        [key:string]: string | number | boolean | undefined | Object,
    }} = {};
    const requiredFields = jsonSchema.required || [];
    const indexFields = jsonSchema.index || [];

    for (const fields in jsonSchema.properties) {

        const prop = jsonSchema.properties[fields];
        let type: any;

        if(typeof prop.type !== "string"){
            throw new Error(`prop.type must be string, received [${typeof prop.type}]`);
        }

        switch (prop.type.toLowerCase()) {
            case "uuid":
                type = "{{Schema.Types.ObjectId}}";
                break;
            case "string":
                type = "{{String}}";
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
                type = [json2MongooseChunk({ properties: prop.items.properties })];
                break;
            case "object":
                type = json2MongooseChunk({ properties: prop.properties });
                break;
        }

        // loop trough all the properties
        mongooseSchema[fields] = {
            type: type,
            index: prop.index || indexFields.includes(fields) || false,
            required:  prop.required || requiredFields.includes(fields) || false,
        };

        if (prop.default) {
            mongooseSchema[fields].default = prop.default;
        }

        if ( prop['x-foreignKey'] ) {
            mongooseSchema[fields].ref = prop['x-foreignKey'];
        }
        
        // for(const key in prop){
        //     // ignore type, properties, items
        //     if (key === "type" || key === "properties" || key === "items") {
        //         continue;
        //     }
        //     // ignore x-*
        //     if (key.startsWith("x-")) {
        //         continue;
        //     }
        //     mongooseSchema[fields][key] = prop[key];
        // }
    }

    // console.log(mongooseSchema);
    return mongooseSchema;
};

export function json2Mongoose (
    jsonSchema:{[key:string]:any}, 
    interfacePath: string,
    schemaFileName: string,
    options?: compilerOptions
) {
    if(!jsonSchema["x-documentConfig"]){
        throw new Error("( jsonSchema.x-documentConfig : object ) is required");
    };
    const documentConfig = jsonSchema["x-documentConfig"];
    const documentName = documentConfig.documentName;
    const interfaceName = schemaFileName.at(0)?.toUpperCase() + schemaFileName?.slice(1);

    // convert json to string
    const schema = json2MongooseChunk(jsonSchema);
    const schemaString  = util.inspect(schema, { depth: null });
    
    // replace all '{{Type}}' with [Function:Type], avoid type to be a string "type".
    const mongooseSchema = schemaString.replace(/'{{/g, "").replace(/}}'/g, "");

    return template.modelsTemplate(interfacePath, interfaceName, documentName, mongooseSchema, options?.headerComment, options?.modelsTemplate);
}

export function compileFromFile(jsonSchemaPath:string, modelToInterfacePath:string, outputPath:string, options?:compilerOptions){
    try{
        const schemaFileName : string = ( jsonSchemaPath.split("/").pop() || jsonSchemaPath).replace(".json", "");
        
        const jsonSchemaBuffer = fs.readFileSync(jsonSchemaPath);
        const jsonSchema = JSON.parse(jsonSchemaBuffer.toString());
        const mongooseSchema = json2Mongoose(jsonSchema, modelToInterfacePath, schemaFileName, options || utils.defaultCompilerOptions);
        // console.log(mongooseSchema);

        fs.writeFileSync(outputPath, mongooseSchema);
    }
    catch(err :any){
        throw new Error(`Processing File [${jsonSchemaPath}] :\n ${(err.message || err)}`);
    }
}