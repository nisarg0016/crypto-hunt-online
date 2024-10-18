
function cdCommand(command, currentPath, dirStructure) {
    const currentPathParts = currentPath.split('/'); // Split the command into path parts
    let commandParts = command.split('/');
    let currentDir = traversePath(currentPath, dirStructure);
    // console.log("current path = ",currentPath);
    // console.log("current path parts = ",currentPathParts);
    // console.log("current Dir = ",currentDir);

    if (!currentDir) {
        return 'Invalid current path';
    }

    for (let part of commandParts) {
        if (part === '' || part === '.') {
            // Skip if it's empty or current directory ('.')
            continue;
        } else if (part === '..') {
            // Move up a directory
            currentPathParts.pop();
            let parentPath = currentPathParts.join('/');
            currentDir = traversePath(parentPath,dirStructure);
        } else if (currentDir[part]) {
            // Move down into a directory if it exists
            currentPathParts.push(part);
            currentDir = currentDir[part];
        } else {
            // Directory doesn't exist
            return `Directory not found: ${part}`;
        }
    }
    let newPath = currentPathParts.join('/');

    return newPath;
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

module.exports = cdCommand;