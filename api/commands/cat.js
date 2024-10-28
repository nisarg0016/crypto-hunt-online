const fs = require('fs');

function catCommand(filePath, currentPath, dirStructure, flag) {
    // Join filePath if it's an array
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

    // Check if filePath contains a wildcard
    const wildcardPattern = getWildcardPattern(filePath);
    if (wildcardPattern) {
        // If a wildcard pattern is found, retrieve all matching files
        const matchedFiles = Object.keys(currentDir)
            .filter(item => matchesWildcard(item, wildcardPattern) && currentDir[item].type === 'text') // Filter for files only
            .map(item => ({
                name: item,
                content: currentDir[item].data.replace(/\${FLAG}/g, flag)
            }));

        // Return contents of matched files
        if (matchedFiles.length > 0) {
            return matchedFiles.map(file => `${file.name}:\n${file.content}`).join('\n\n');
        } else {
            return `cat: No matching files found for pattern '${filePath}'`;
        }
    } else {
        // If no wildcard, continue with normal traversal and display a single file
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
            return currentDir.data.replace(/\${FLAG}/g, flag); // Return file content
        } else {
            return `cat: ${filePath}: Is a directory`; // It's a directory, not a file
        }
    }
}

function getWildcardPattern(filePath) {
    // Return the wildcard pattern if * is found in the filePath
    return filePath.includes('*') ? filePath : null;
}

function matchesWildcard(filename, pattern) {
    // Convert wildcard pattern to regex
    const regexPattern = pattern
        .replace(/([.+?^${}()|\[\]\\])/g, '\\$1') // Escape regex special characters
        .replace(/\*/g, '.*'); // Replace '*' with '.*' for regex matching

    const regex = new RegExp(`^${regexPattern}$`); // Match from the beginning to the end
    return regex.test(filename);
}

function traversePath(path, dirStructure) {
    let currentDir = dirStructure;
    for (let i in path) {
        let part = path[i];
        if (part === '' || part === '.') continue; // Skip root or current directory
        if (currentDir[part] && currentDir[part].type === 'dir') {
            currentDir = currentDir[part]; // Traverse down to the next directory
        } else {
            return null; // Invalid path
        }
    }
    return currentDir;
}

module.exports = {
    catCommand
};
