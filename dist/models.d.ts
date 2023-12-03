export declare function json2Mongoose(jsonSchema: {
    [key: string]: any;
}, interfacePath: string, schemaFileName: string): string;
export declare function compileFromFile(jsonSchemaPath: string, modelToInterfacePath: string, outputPath: string): void;
