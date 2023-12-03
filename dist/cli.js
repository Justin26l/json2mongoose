var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const fs_1 = __importDefault(require("fs"));
const schemaDir = process.argv[2];
const outputDir = process.argv[3];
// param check
if (!schemaDir || !outputDir) {
    console.log('\x1b[31m%s\x1b[0m', 'Param Missing:', '\nUsage: json2mongoose <schemaDir> <outputDir>');
    process.exit(1);
}
if (!fs_1.default.existsSync(schemaDir)) {
    console.log('\x1b[31m%s\x1b[0m', 'Schema Dir Not Found:', schemaDir);
    process.exit(1);
}
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir);
}
const modelDir = outputDir + '/models';
const typeDir = outputDir + '/types';
(0, index_1.default)(schemaDir, modelDir, typeDir);
