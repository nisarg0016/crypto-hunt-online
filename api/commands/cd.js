function cdCommand(command, currentPath, dirStructure) {
    //console.log(dirStructure)
    //const currentPathParts = currentPath.split('/'); // Split the command into path parts
    if (command === undefined) {
        return "Usage: cd <folder>"
    }

    let currentDir = traversePath(currentPath, dirStructure);

    if (!currentDir) {
        return 'Invalid current path';
    }

    if (!currentDir[command] || typeof currentDir[command] !== 'object') {
        return 'No such directory';
    }

    currentDir = currentDir[command];
    currentPath += `${command}/`
    return currentPath;
}

function traversePath(path, dirStructure) {
    const pathParts = path.split('/');
    let currentDir = dirStructure;
    
    for (let part of pathParts) {
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
    cdCommand
}