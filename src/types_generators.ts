import * as jsonToTypescript from "json-schema-to-typescript";
import * as fs from "fs";
import { compilerOptions } from "./types";
export function compileFromFile(jsonSchemaPath: string, outputPath: string, options?: compilerOptions) {
    jsonToTypescript
        .compileFromFile(jsonSchemaPath, {
            $refOptions: {},
            additionalProperties: true, // TODO: default to empty schema (as per spec) instead
            bannerComment: options?.headerComment||'',
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
                trailingComma: 'none',
                useTabs: false,
            },
            unreachableDefinitions: false,
            unknownAny: true,
        })
        .then((ts: string) => {
            fs.writeFileSync(outputPath, ts);
        });
}