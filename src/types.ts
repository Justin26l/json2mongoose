export interface compilerOptions {
    headerComment?: string;
    modelsTemplate?: string;
    controllersTemplate?: string;
    use_id?: boolean;
}

export interface jsonSchema {
    type: string;
    "x-documentConfig": documentConfig;
    properties: {
        [key: string]: SchemaItem
    };
    required?: string[];
    index?: string[];
    [key: string]: any;
}

export interface SchemaItem {
    type: string;
    format?: string;
    index?: boolean;
    items?: SchemaItem;
    required?: boolean;
    description?: string;
    example?: any;
    [key: string]: any
}

export interface documentConfig {
    documentName: string;
    // documentType?: "primary" | "secondary";
    // keyPrefix?: string;
    method: method[]
}

export enum method {
    get = "get",
    post = "post",
    put = "put",
    patch = "patch",
    delete = "delete",
    options = "options",
    head = "head",
    trace = "trace"
}

export interface mongooseSchemaDefinition {
    [key: string]: mongooseSchemaDefinition | {
        type: any,
        required?: boolean,
        index?: boolean,
        [key: string]: string | number | boolean | undefined | object,
    }
}

export interface hookData {
    onCreate : { [key: string]: string },
    onUpdate: { [key: string]: string }
}