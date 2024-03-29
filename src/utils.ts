// read package.json and get version
import childProcess from "child_process";

export function getPackageInfo() :{
    version: string,
    author: string,
    } {
    let globalPackages: any = {};
    // get local npm package dependencies with npm -g list
    try {
        globalPackages = JSON.parse(childProcess.execSync("npm -g list --json",).toString());
        // console.log(globalPackages)
    } catch (error) {
        console.log("\x1b[41m%s\x1b[0m", "[ERROR]", "Failed to execute command: npm list -g --json", error);
    }

    return {
        version: globalPackages.dependencies["very-express"].version || "[unknown version]",
        author: globalPackages.author || "justin26l",
    };
}

export function getGenaratorHeaderComment(depedencies?:string) :string{
    if(!depedencies){
        depedencies = "";
    }
    const packageInfo = getPackageInfo();
    return`/* eslint-disable */
/**
 * Generated by json2mongoose@${packageInfo.version} ${depedencies}.
 * DO NOT MODIFY MANUALLY. Instead, modify the source JSONSchema file,
 * and run json2mongoose to regenerate this file.
 * 
 * author: ${packageInfo.author}
 * version: ${packageInfo.version}
 */
`;

}

export const defaultCompilerOptions = {
    headerComment: getGenaratorHeaderComment(),
    use_id: false,
};

export default {
    getPackageInfo,
    getGenaratorHeaderComment,
    defaultCompilerOptions,
};
