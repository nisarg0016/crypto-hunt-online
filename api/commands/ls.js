const fs = require('fs');

function lsCommand(args, currentPath, dirStructure) {
    let currentDir = traversePath(currentPath, dirStructure);
    
    if (!currentDir) {
        return null;
    }

    if (args.includes('-a')) {
        return Object.keys(currentDir); // Include hidden files
    } else {
        return Object.keys(currentDir).filter(item => item[0] !== '.'); // Exclude hidden files
    }
}

function traversePath(path, dirStructure) {
    let currentDir = dirStructure;
    for (let i in path) {
        let part = path[i];
        if (part === '' || part === '.') continue;
        if (currentDir[part]) {
            currentDir = currentDir[part];
        } else {
            return null;
        }
    }
    return currentDir;
}

module.exports = {
    lsCommand
};