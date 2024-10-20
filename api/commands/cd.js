function cdCommand(command, currentPath, dirStructure) {
    command = command[0];
    if (command === undefined) {
        return null;
    }

    if (command === '..') {
        if (currentPath[currentPath.length - 1] === '.') return null;
        currentPath.pop();
        return currentPath;
    }

    let currentDir = traversePath(currentPath, dirStructure);

    if (!currentDir) {
        return null;
    }

    if (!currentDir[command] || typeof currentDir[command] !== 'object') {
        return null;
    }

    currentDir = currentDir[command];
    currentPath.push(command);
    return currentPath;
}

function traversePath(path, dirStructure) {
    //const pathParts = path.split('/');
    let currentDir = dirStructure;
    for (let i in path) {
        let part = path[i];
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