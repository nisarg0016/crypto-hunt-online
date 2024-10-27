const fs = require('fs');
const getopts = require("getopts");

function lsCommand(args, currentPath, dirStructure) {
    args = getopts(args, {
        boolean: ["l", "s", "a", "R", "r"],
    });
    let output = "";
    if (args._.length == 1) {
        let currDir = traversePath(args._[0], currentPath, dirStructure);
        if (!currDir) {
            output += `${args._[0]} is not a file or a folder`;
        } else {
            output += outputGenerator(args, currDir);
        }
    } else if (args._.length == 0) {
        let currDir = traversePath("", currentPath, dirStructure);
        output += outputGenerator(args, currDir);
    } else {
        for (let i = 0; i < args._.length; i++) {
            let currDir = traversePath(args._[i], currentPath, dirStructure);
            if (!currDir) {
                output += `${args._[i]} is not a file or a folder`;
            } else {
                output += `${args._[i]}:\n`;
                output += outputGenerator(args, currDir);
            }
        }
    }
    return output;
}

function outputGenerator(args, home) {
    let out = "";
    if (args.a == false) {
        let struct = Object.keys(home);
        let newHome = {};
        for (i in struct) {
            if (home[struct[i]].hidden) continue;
            newHome[struct[i]] = home[struct[i]];
        }
        home = newHome;
    }
    if (args.R == true) {
        out += recursiveOutput(args, out, home, 0);
    } else {
        let struct = Object.keys(home);
        for (i in struct) {
            if (
                struct[i] == "hidden" ||
                struct[i] == "size" ||
                struct[i] == "type"
            ) continue;
            out += `${struct[i]}    `;
        }
    }
    out += '\n';
    return out;
}

function recursiveOutput(args, out, home, tabs) {
    let struct = Object.keys(home);
    for (i in struct) {
        if (home[struct[i]].type == "dir") {
            let temp = home[struct[i]];
            out += '\n';
            for (let i = 0; i < tabs + 1; i++) out += "  ";
            out += `${struct[i]}:\n`;
            for (let i = 0; i < tabs + 1; i++) out += "  ";
            out = recursiveOutput(args, out, temp, tabs + 1);
        } else{
            if (
                struct[i] == "hidden" ||
                struct[i] == "size" ||
                struct[i] == "type"
            ) continue;
            out += `${struct[i]}    `;
        }
    }
    out += '\n';
    return out;
}

function traversePath(newPath, currPath, dirStructure) {
    let currDir = dirStructure;
    for (pth in currPath) {
        if (currPath[pth] == '.') continue;
        if (currPath[pth] == '') break;
        currDir = currDir[currPath[pth]];
    }
    if (newPath == "") return currDir;
    if (currDir[newPath] == null) return null;
    if (currDir[newPath].type == "dir") {
        currDir = currDir[newPath];
    } else {
        let newD = {};
        newD[newPath] = currDir[newPath];
        currDir = newD;
    }
    return currDir;
}

module.exports = {
    lsCommand
};