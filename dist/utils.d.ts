export declare function getPackageInfo(): {
    version: string;
    author: string;
};
export declare function getGenaratorHeaderComment(depedencies?: string): string;
export declare const defaultCompilerOptions: {
    headerComment: string;
};
declare const _default: {
    getPackageInfo: typeof getPackageInfo;
    getGenaratorHeaderComment: typeof getGenaratorHeaderComment;
    defaultCompilerOptions: {
        headerComment: string;
    };
};
export default _default;
