#!/usr/bin/env node
import json2mongoose from './index';
import fs from 'fs';

const schemaDir = process.argv[2];
const outputDir = process.argv[3];

// param check
if (!schemaDir || !outputDir) {
    console.log('\x1b[31m%s\x1b[0m', 'Param Missing:', '\nUsage: json2mongoose <schemaDir> <outputDir>');
    process.exit(1);
}

if(!fs.existsSync(schemaDir)){
    console.log('\x1b[31m%s\x1b[0m', 'Schema Dir Not Found:', schemaDir);
    process.exit(1);
}

if(!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

const modelDir = outputDir+'/models';
const typeDir  = outputDir+'/types';
json2mongoose.genarate(schemaDir, modelDir, typeDir);


