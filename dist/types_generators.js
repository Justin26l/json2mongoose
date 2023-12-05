"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFromFile = void 0;
const jsonToTypescript = __importStar(require("json-schema-to-typescript"));
const fs = __importStar(require("fs"));
function compileFromFile(jsonSchemaPath, outputPath, options) {
    jsonToTypescript
        .compileFromFile(jsonSchemaPath, {
        $refOptions: {},
        additionalProperties: true, // TODO: default to empty schema (as per spec) instead
        bannerComment: (options === null || options === void 0 ? void 0 : options.headerComment) || '',
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
            tabWidth: 2,
            trailingComma: 'none',
            useTabs: false,
        },
        unreachableDefinitions: false,
        unknownAny: true,
    })
        .then((ts) => {
        fs.writeFileSync(outputPath, ts);
    });
}
exports.compileFromFile = compileFromFile;
