"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFromFile = exports.json2Mongoose = void 0;
const util = __importStar(require("util"));
const fs = __importStar(require("fs"));
const template_1 = __importDefault(require("./template"));
const utils_1 = __importDefault(require("./utils"));
function json2MongooseChunk(schemaProperties) {
    const mongooseSchema = {};
    const requiredFields = schemaProperties.required || [];
    const indexFields = schemaProperties.index || [];
    for (const fields in schemaProperties.properties) {
        const prop = schemaProperties.properties[fields];
        let type;
        if (typeof prop.type !== "string") {
            throw new Error(`prop.type must be string, received [${typeof prop.type}]`);
        }
        switch (prop.type.toLowerCase()) {
            case "string":
                type = (prop.format === "uuid") ? "{{Schema.Types.ObjectId}}" : "{{String}}";
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
            default:
                throw new Error(`Unsupported type [${prop.type}]`);
                break;
        }
        // loop trough all the properties
        mongooseSchema[fields] = {
            type: type,
            index: prop.index || indexFields.includes(fields) || Boolean(prop['x-foreignKey']) || false,
            required: prop.required || requiredFields.includes(fields) || false,
        };
        if (prop.default) {
            mongooseSchema[fields].default = prop.default;
        }
        if (prop['x-foreignKey']) {
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
}
;
function json2Mongoose(jsonSchema, interfacePath, options) {
    if (!jsonSchema["x-documentConfig"]) {
        throw new Error("( jsonSchema.x-documentConfig : object ) is required");
    }
    ;
    const documentConfig = jsonSchema["x-documentConfig"];
    const documentName = documentConfig.documentName;
    const interfaceName = documentConfig.interfaceName;
    // convert json to string
    const schema = json2MongooseChunk(jsonSchema);
    const schemaString = util.inspect(schema, { depth: null });
    // replace all '{{Type}}' with [Function:Type], avoid type to be a string "type".
    const mongooseSchema = schemaString.replace(/'{{/g, "").replace(/}}'/g, "");
    return template_1.default.modelsTemplate(interfacePath, interfaceName, documentName, mongooseSchema, options === null || options === void 0 ? void 0 : options.headerComment, options === null || options === void 0 ? void 0 : options.modelsTemplate);
}
exports.json2Mongoose = json2Mongoose;
function compileFromFile(jsonSchemaPath, modelToInterfacePath, outputPath, options) {
    try {
        const jsonSchemaBuffer = fs.readFileSync(jsonSchemaPath);
        const jsonSchema = JSON.parse(jsonSchemaBuffer.toString());
        const mongooseSchema = json2Mongoose(jsonSchema, modelToInterfacePath, options || utils_1.default.defaultCompilerOptions);
        // console.log(mongooseSchema);
        fs.writeFileSync(outputPath, mongooseSchema);
    }
    catch (err) {
        throw new Error(`Processing File [${jsonSchemaPath}] :\n ${(err.message || err)}`);
    }
}
exports.compileFromFile = compileFromFile;
