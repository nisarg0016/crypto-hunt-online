const express = require("express");
const ls = require("./commands/ls.js")
const app = express();
const port = 12000;

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
    try {
        return res.status(200).json("JSON Server is running");
    } catch (error) {
        console.log(error);
    }
});

app.post("/command", (req, res) => {
    try {
        return res.status(200).json(req.body.commandName);
    } catch (error) {
        console.log(error);
    }
});

app.post("/parse", (req, res) => {
    try {
        const parsedObject = parse(req.body.command);
        if (parsedObject.command == 'ls') {
            parsedObject.args = ls.parseCommand(parsedObject.args);
        }
        return res.status(200).send(parsedObject);
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const parse = (command) => {
    const parts = command.trim().split(" ");
    const mainCommand = parts[0];
    parts.shift();
    command = parts.join(" ");
    let tempForQuotes = command.split(" ");
    const newArgs = [];
    let index = null;
    for (let i = 0; i < tempForQuotes.length; i++) {
        if (tempForQuotes[i].includes('"') && index != null) {
            let t = true;
            while (tempForQuotes[i].includes('"')) {
                tempForQuotes[i] = tempForQuotes[i].replace('"', "");
                t = !t;
            }
            tempForQuotes[
                index
            ] = `${tempForQuotes[index]} ${tempForQuotes[i]}`;
            if (!t) {
                newArgs.push(tempForQuotes[index]);
                index = null;
            }
        } else if (index != null) {
            tempForQuotes[
                index
            ] = `${tempForQuotes[index]} ${tempForQuotes[i]}`;
        } else if (tempForQuotes[i].includes('"')) {
            let t = true;
            while (tempForQuotes[i].includes('"')) {
                tempForQuotes[i] = tempForQuotes[i].replace('"', "");
                t = !t;
            }
            if (!t) {
                index = i;
            } else {
                newArgs.push(tempForQuotes[i]);
            }
        } else {
            newArgs.push(tempForQuotes[i]);
        }
    }
    return {command: mainCommand, args: newArgs};
}