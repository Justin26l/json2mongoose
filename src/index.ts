import * as fs from 'fs';
import * as json2Ts from './types_generators';
import * as json2Mongoose from './models_generator';
import path from 'path';
import utils from './utils';
import { compilerOptions } from './types';

const relativePath = (fromPath: string, toPath: string): string => {
    return path.relative(fromPath, toPath).replace(/\\/g, '/');
}

export function genarate(schemaDir: string, modelDir: string, typeDir: string, options?: compilerOptions) {
    
    fs.readdir(schemaDir, (err: any, files: string[]) => {
        if (err) {
            console.log(err);
            return;
        }

        // recreate model dir
        if (fs.existsSync(modelDir)) {
            fs.rmSync(modelDir, { recursive: true });
        }
        fs.mkdirSync(modelDir);

        // recreate type dir
        if (fs.existsSync(typeDir)) {
            fs.rmSync(typeDir, { recursive: true });
        }
        fs.mkdirSync(typeDir);

        // iterate over files
        files.forEach((schemaFileName: string) => {
            try {
                // ignore non json files
                if (!schemaFileName.endsWith('.json')) {
                    return;
                }

                const fileName = schemaFileName.replace('.json', '');
                const fileNameUpper = fileName.charAt(0).toUpperCase() + fileName.slice(1);

                // make interface
                json2Ts.compileFromFile(
                    `${schemaDir}/${schemaFileName}`,
                    `${typeDir}/${fileNameUpper}.ts`,
                    options || utils.defaultCompilerOptions
                );

                // make model
                json2Mongoose.compileFromFile(
                    `${schemaDir}/${schemaFileName}`,
                    `${relativePath(modelDir, typeDir)}/${fileName}`,
                    `${modelDir}/${fileNameUpper}Model.ts`,
                    options || utils.defaultCompilerOptions
                );
            }
            catch (err: any) {
                console.error('\x1b[31m%s\x1b[0m', `Processing File : ${schemaDir}/${schemaFileName}\n`, err);
            }

        });
    });
}

export default {
    genarate
};