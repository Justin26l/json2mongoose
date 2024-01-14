import * as typesGen from "./types_generators";
import * as modelsGen from "./models_generator";
import { compilerOptions } from "./types";
export declare function genarate(schemaDir: string, modelDir: string, typeDir: string, options?: compilerOptions): void;
declare const _default: {
    genarate: typeof genarate;
    typesGen: typeof typesGen;
    modelsGen: typeof modelsGen;
};
export default _default;
