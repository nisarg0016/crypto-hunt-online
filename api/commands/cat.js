function catCommand(filePath, currentPath, dirStructure, flag) {
    // If filePath is an array, join it to make a string
    if (Array.isArray(filePath)) {
        filePath = filePath.join('/');
    }

    // Ensure filePath is a string
    if (typeof filePath !== 'string') {
        return `cat: Invalid file path type. Expected a string.`;
    }

    // Traverse to the current directory
    let currentDir = traversePath(currentPath, dirStructure);
    if (!currentDir) {
        return `cat: Invalid current path`; // Invalid current path
    }

    // Traverse the provided file path from the current directory
    let pathParts = filePath.split('/');
    for (let part of pathParts) {
        if (part === '' || part === '.') continue; // Skip root or current directory
        if (currentDir[part]) {
            currentDir = currentDir[part];
        } else {
            return `cat: ${filePath}: No such file or directory`; // Invalid path
        }
    }

    // Check if the final part is a file (string or any content)
    if (currentDir.type === 'text') {
        const returnedData = currentDir.data.replace(/\${FLAG}/g, flag);
        return returnedData; // Return file content
    } else {
        return `cat: ${filePath}: Is a directory`; // It's a directory, not a file
    }
}

function traversePath(path, dirStructure) {
    //const pathParts = path.split('/');
    let currentDir = dirStructure;
    for (let i in path) {
        let part = path[i];
        if (part === '' || part === '.') continue; // Skip root or current directory
        if (currentDir[part].type === 'dir') {
            currentDir = currentDir[part]; // Traverse down to the next directory
        } else {
            return null; // Invalid path
        }
    }
    return currentDir;
}
module.exports = {
    catCommand
}
