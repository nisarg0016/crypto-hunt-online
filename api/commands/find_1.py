function findCommand(searchTerm, currentPath, dirStructure) {
    if (!searchTerm) {
        return "Usage: find <filename>";
    }

    // Get the current directory object based on the current path
    let currentDir = traversePath(currentPath, dirStructure);

    if (!currentDir) {
        return 'Invalid current path';
    }

    // Call recursive function to search for the term
    let foundPaths = searchDirectory(currentDir, searchTerm, currentPath);

    if (foundPaths.length === 0) {
        return 'No matching files or directories found';
    }

    // Return all matching paths
    return foundPaths.join('\n');
}

// Recursive function to search directories
function searchDirectory(dir, searchTerm, currentPath) {
    let found = [];

    // Iterate over each key in the current directory (files and subdirectories)
    for (let item in dir) {
        let newPath = `${currentPath}/${item}`;

        // Check if it's a file or a directory
        if (typeof dir[item] === 'object') {
            // If it's a directory, search inside it recursively
            found = found.concat(searchDirectory(dir[item], searchTerm, newPath));
        }

        // If the item matches the search term, add it to the results
        if (item === searchTerm) {
            found.push(newPath);
        }
    }

    return found;
}

// Reusing the traversePath function from the cd command to navigate
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
    findCommand
}
