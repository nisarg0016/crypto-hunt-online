function createPathString(path) {
    return path.join("/");
}

function findCommand(searchTerm, currentPath, dirStructure) {
    if (!searchTerm) {
        return "Usage: find <filename>";
    }

    // Get the current directory object based on the current path
    let currentDir = traversePath(currentPath, dirStructure);
    //console.log('Current directory:', currentDir);

    if (!currentDir) {
        return 'Invalid current path';
    }

    // Call recursive function to search for the term
    let pathUptoNow = createPathString(currentPath)
    let foundPaths = searchDirectory(currentDir, searchTerm, pathUptoNow);

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
        let newPath = `${currentPath}/${item}`;  // Ensure correct path concatenation

        // Check if it's a file or a directory
        if (dir[item].type == "dir") {
            // If it's a directory, search inside it recursively
            found = found.concat(searchDirectory(dir[item], searchTerm, newPath));
        }

        // Check for case-insensitive match
        if (item.toLowerCase() === searchTerm.toLowerCase()) {
            found.push(newPath);
        }
    }

    return found;
}

// Reusing the traversePath function from the cd command to navigate

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
    findCommand
};