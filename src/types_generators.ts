import * as jsonToTypescript from "json-schema-to-typescript";
import * as fs from "fs";
import log from "./logger";
import { compilerOptions } from "./types";

export async function compileFromFile(jsonSchemaPath: string, outputPath: string, options?: compilerOptions) {
    log.process(`Type : ${jsonSchemaPath} > ${outputPath}`);
    return await jsonToTypescript
        .compileFromFile(jsonSchemaPath, {
            $refOptions: {},
            additionalProperties: true, // TODO: default to empty schema (as per spec) instead
            bannerComment: options?.headerComment||"",
            cwd: process.cwd(),
            declareExternallyReferenced: true,
            enableConstEnums: true,
            format: true,
            ignoreMinAndMaxItems: false,
            maxItems: 20,
            strictIndexSignatures: false,
            style: {
                bracketSpacing: false,
                printWidth: 120,
                semi: true,
                singleQuote: false,
                tabWidth: 4,
                trailingComma: "none",
                useTabs: false,
            },
            unreachableDefinitions: false,
            unknownAny: true,
        })
        .then((ts: string) => {
            // todo : add custom type condition
            // if have fk then need to be "ObjectId | SchemaType"
            fs.writeFileSync(outputPath, ts);
            return ts;
        });
}