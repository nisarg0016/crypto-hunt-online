const getopts = require("getopts");

module.exports = {
    parseCommand(command) {
        return args = getopts(command, {
            boolean: ["l", "s", "a", "R", "r"],
        });
    }
}