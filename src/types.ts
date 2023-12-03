import * as jsonToTypescript from "json-schema-to-typescript";
import * as fs from "fs";

export function compileFromFile(jsonSchemaPath:string, outputPath:string){
    jsonToTypescript
    .compileFromFile(jsonSchemaPath)
    .then((ts:string) => {
        fs.writeFileSync(outputPath, ts);
    });
}