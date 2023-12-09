"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelsTemplate = void 0;
function modelsTemplate(interfacePath, interfaceName, documentName, mongooseSchema, headerComment, template) {
    if (!headerComment) {
        headerComment = "";
    }
    ;
    if (!template) {
        template = `{{headerComment}}
import { Document, Schema, Model, model } from "mongoose";
import { {{interfaceName}} } from "<<interfacePath>>";

const schemaConfig = {{mongooseSchema}};

export interface {{interfaceName}}Document extends {{interfaceName}}, Document<string> {};
export const {{interfaceName}}Schema: Schema = new Schema(schemaConfig);
export const {{interfaceName}}Model: Model<{{interfaceName}}Document> = model<{{interfaceName}}Document>("{{documentName}}", {{interfaceName}}Schema);
`;
    }
    ;
    template = template.replace(/{{headerComment}}/g, headerComment);
    template = template.replace(/{{interfaceName}}/g, interfaceName);
    template = template.replace(/<<interfacePath>>/g, interfacePath);
    template = template.replace(/{{documentName}}/g, documentName);
    template = template.replace(/{{mongooseSchema}}/g, mongooseSchema);
    return template;
}
exports.modelsTemplate = modelsTemplate;
;
