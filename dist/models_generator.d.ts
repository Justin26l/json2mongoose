import { compilerOptions } from "./types";
export declare function json2Mongoose(jsonSchema: {
    [key: string]: any;
}, interfacePath: string, schemaFileName: string, options?: compilerOptions): string;
export declare function compileFromFile(jsonSchemaPath: string, modelToInterfacePath: string, outputPath: string, options?: compilerOptions): void;
