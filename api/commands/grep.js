function grepCommand(pattern, filePath, currentPath, dirStructure) {
    if (Array.isArray(filePath)) {
        filePath = filePath.join('/');
    }

    // Pattern and filePath should be valid strings
    if (typeof pattern !== 'string' || typeof filePath !== 'string') {
        return `grep: Invalid arguments. Expected pattern and file path as strings.`;
    }

    // Traverse to the current directory
    let currentDir = traversePath(currentPath, dirStructure);
    if (!currentDir) {
        return `grep: Invalid current path`; // Invalid current path
    }

    // Traverse the provided file path from the current directory
    let pathParts = filePath.split('/');
    for (let part of pathParts) {
        if (part === '' || part === '.') continue; // Skip root or current directory
        if (currentDir[part]) {
            currentDir = currentDir[part];
        } else {
            return `grep: ${filePath}: No such file or directory`;
        }
    }

    // Check if the final part is a file
    if (currentDir.type == "text") {
        // Split file content by lines and search for the pattern in each line
        const lines = currentDir.data.split('\n');
        const matchingLines = lines.filter(line => line.includes(pattern));

        // Return matching lines or an appropriate message if no match is found
        return matchingLines.length > 0 ? matchingLines.join('\n') : `grep: No matching lines found`;
    } else {
        return `grep: ${filePath}: Is a directory`; // It's a directory, not a file
    }
}

function grep2(pattern,text,currentPath,dirStructure){
    // Pattern and filePath should be valid strings
    if (typeof pattern !== 'string' ||  typeof text !== 'string') {
        return `grep: Invalid arguments. Expected pattern and file path and text as strings.`;
    }

    // Traverse to the current directory
    let currentDir = traversePath(currentPath, dirStructure);
    if (!currentDir) {
        return `grep: Invalid current path`; // Invalid current path
    }

    const lines = text.split('\n');
    const matchingLines = [];
    for(let line of lines){
        if (line.indexOf(pattern) !== -1) {
            matchingLines.push(line);
        }
    }
    return matchingLines.length > 0 ? matchingLines.join('\n') : `grep: No matching lines found`;
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
    grepCommand,grep2
};
