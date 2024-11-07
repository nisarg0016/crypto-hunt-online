const getopts = require("getopts");

function base64Command(args,currentPath,dirStructure,flag) {
    args = getopts(args, {
        boolean: ["d"],
    });
    //console.log(args);
    let currentDir = traversePath(currentPath, dirStructure);
    if (!currentDir) {
        return `base64: Invalid current path`; // Invalid current path
    }

    const filePath = args._[0];
    if (!filePath) {
        return `base64: No file specified`;
    }

    let pathParts = filePath.split('/');
    for (let part of pathParts) {
        if (part === '' || part === '.') continue; // Skip root or current directory
        if (currentDir[part]) {
            currentDir = currentDir[part];
        } else {
            return `base64: ${filePath}: No such file or directory`; // Invalid path
        }
    }

    if (currentDir.type !==  'text') {
        return `base64: ${filePath}: Not a text file`;
    }

    let output;
    let input = currentDir.data;
    if (args.d){
        //decode
        output = atob(input).replace(/\${FLAG}/g, flag);
    }
    else {
        //encode
        output = btoa(input);
    }
    return output;
}

function traversePath(path, dirStructure) {
    // Traverse path parts within the directory structure
    let currentDir = dirStructure;
    for (let part of path) {
        if (part === '' || part === '.') continue; // Skip root or current directory
        if (currentDir[part]) {
            currentDir = currentDir[part]; // Traverse down to the next directory
        } else {
            return null; // Invalid path
        }
    }
    return currentDir;
}

module.exports = {
    base64Command
}