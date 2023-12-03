#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const json2Ts = __importStar(require("./types"));
const json2Mongoose = __importStar(require("./models"));
const path_1 = __importDefault(require("path"));
const relativePath = (fromPath, toPath) => {
    return path_1.default.relative(fromPath, toPath).replace(/\\/g, '/');
};
function genarate(schemaDir, modelDir, typeDir) {
    // read all files in the dir
    fs.readdir(schemaDir, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }
        // remove and create dir/models
        if (fs.existsSync(modelDir)) {
            fs.rmSync(modelDir, { recursive: true });
        }
        fs.mkdirSync(modelDir);
        // remove and create dir/types
        if (fs.existsSync(typeDir)) {
            fs.rmSync(typeDir, { recursive: true });
        }
        fs.mkdirSync(typeDir);
        // read files
        files.forEach((schemaFileName) => {
            try {
                // ignore non json files
                if (!schemaFileName.endsWith('.json')) {
                    return;
                }
                //read document config
                const jsonSchema = JSON.parse(fs.readFileSync(`${schemaDir}/${schemaFileName}`, 'utf8'));
                const docuementConfig = jsonSchema['x-documentConfig'];
                const fileName = schemaFileName.replace('.json', '');
                // docuementConfig.documentName;
                const fileTs = fileName + '.ts';
                // make interface
                json2Ts.compileFromFile(`${schemaDir}/${schemaFileName}`, `${typeDir}/${fileTs}`);
                // make model
                json2Mongoose.compileFromFile(`${schemaDir}/${schemaFileName}`, `${relativePath(modelDir, typeDir)}/${fileName}`, `${modelDir}/${fileTs}`);
            }
            catch (err) {
                // log red
                console.error('\x1b[31m%s\x1b[0m', `Processing File : ${schemaDir}/${schemaFileName}\n`, err);
            }
        });
    });
}
exports.default = genarate;
