export function modelsTemplate(interfacePath:string, interfaceName:string, documentName:string, mongooseSchema:string, headerComment?:string, template?:string) {
    if(!headerComment){
        headerComment = "";
    }

    if(!template){
        template = `{{headerComment}}
import { Document, Schema, Model, model } from "mongoose";
import { {{interfaceName}} } from "{{interfacePath}}";

export const {{interfaceName}}Schema: Schema = new Schema({{mongooseSchema}});

export interface {{interfaceName}}Document extends {{interfaceName}}, Document<string> {_id: string};
export const {{interfaceName}}Model: Model<{{interfaceName}}Document> = model<{{interfaceName}}Document>("{{documentName}}", {{interfaceName}}Schema);
`;
    }

    template = template.replace(/{{headerComment}}/g, headerComment);
    template = template.replace(/{{interfaceName}}/g, interfaceName);
    template = template.replace(/{{interfacePath}}/g, interfacePath);
    template = template.replace(/{{documentName}}/g, documentName);
    template = template.replace(/{{mongooseSchema}}/g, mongooseSchema);

    return template;
}

