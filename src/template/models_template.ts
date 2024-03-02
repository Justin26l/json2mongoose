import * as types from "./../types";

export function modelsTemplate(interfacePath: string, interfaceName: string, documentName: string, mongooseSchema: string, hookData:types.hookData, compilerOptions: types.compilerOptions) {

    let template = compilerOptions.modelsTemplate;

    if (!compilerOptions.headerComment) {
        compilerOptions.headerComment = "";
    }

    if (!template) {
        template = `{{headerComment}}
import { Document, Schema, Model, model, SchemaDefinition } from "mongoose";
import { {{interfaceName}} } from "{{interfacePath}}";

export const {{interfaceName}}SchemaDefinition: SchemaDefinition = {{mongooseSchema}};

export interface {{interfaceName}}Document extends Omit<{{interfaceName}}, '_id'>, Document { {{use_id}} };
export const {{interfaceName}}Schema: Schema<{{interfaceName}}Document> = new Schema({{interfaceName}}SchemaDefinition);
{{hook}}
export const {{interfaceName}}Model: Model<{{interfaceName}}Document> = model<{{interfaceName}}Document>("{{documentName}}", {{interfaceName}}Schema);
`;
    }

    const hookScript = hookTemplate(`${interfaceName}Schema`, hookData.onCreate, hookData.onUpdate);
    template = template.replace(/{{hook}}/g, hookScript);
    
    template = template.replace(/{{headerComment}}/g, compilerOptions.headerComment);
    template = template.replace(/{{interfaceName}}/g, interfaceName);
    template = template.replace(/{{interfacePath}}/g, interfacePath);
    template = template.replace(/{{mongooseSchema}}/g, mongooseSchema);
    template = template.replace(/{{use_id}}/g, compilerOptions.use_id ? "" : "_id: string;");
    template = template.replace(/{{documentName}}/g, documentName);

    return template;
}

function hookTemplate(SchemaName: string, onCreateValue: { [key: string]: string }, onUpdate: { [key: string]: string }) {
    let createHandlerTemplate = "";
    let updateHandlerTemplate = "";
     
    Object.keys(onCreateValue).forEach((key: string) => {
        createHandlerTemplate += `this.${key} = ${onCreateValue[key]};\n`;
    });

    Object.keys(onUpdate).forEach((key: string) => {
        updateHandlerTemplate += `this.${key} = ${onUpdate[key]};\n`;
    });

    return `${SchemaName}.pre('save', function(next) {
    if (this.isNew) {
        ${createHandlerTemplate}
    } else {
        ${updateHandlerTemplate}
    }
    next();
});
`;
}
