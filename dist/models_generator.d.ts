import * as types from "./types";
export declare function json2Mongoose(jsonSchema: {
    [key: string]: any;
}, interfacePath: string, options?: types.compilerOptions): string;
export declare function compileFromFile(jsonSchemaPath: string, modelToInterfacePath: string, outputPath: string, options?: types.compilerOptions): void;
