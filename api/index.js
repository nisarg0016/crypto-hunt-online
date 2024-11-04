const express = require("express");
const mongoose = require("mongoose");
const ls = require("./commands/ls.js")
const cd = require("./commands/cd.js")
const cat = require("./commands/cat.js")
const find = require("./commands/find.js")
const dotenv = require("dotenv");
const grep = require("./commands/grep.js");
const base64 = require("./commands/base64.js");
const passport = require("passport");
const session = require("express-session");
const app = express();
const passportSetup = require("./passport-setup");
const User = require("./models/User")
const fs = require("fs");

const cors = require("cors");
dotenv.config();

mongoose.connect(process.env.mongo_link);

app.use(session({
    secret: 'my-secret-key',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false
    },
}));


app.use(
    cors(
        {
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true
    }
))

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
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


/* Ignore this, authentication stuff */
app.get("/login/success", (req, res) => {
    if (req.user) {
        res.redirect("http://localhost:3000/")
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

/* This is the route which we redirect to incase of a login failure */
app.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});

app.get("/auth/google/",
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
    (req, res) => {
        res.redirect("/login/success")
    }
)

app.get('/user', (req, res) => {
    res.status(200).send(req.user)
})


app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect("http://localhost:3000/");
    });
});

app.get('/auth/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        // If the user is authenticated, return user details
        return res.json(req.user);
    } else {
        // If the user is not authenticated, return an empty object
        return res.json({});
    }
});

// Login backend left
////////////////////////////////////////////////

const Level = require("./models/LevelStructure")
const levelDetails = require("./routes/levels.json");

app.post("/execute", async (req, res) => {
    try {
        const command = req.body.command;
        let path = req.body.path;
        const level = req.body.level;
        const flag = req.body.flag;
        const parsedObject = parseCommand(command);
        // console.log(parsedObject);
        
        let directoryStruct;
        let output = '';

        try {
            const levelExists = levelDetails.find(item => item.level === level);

            if (levelExists) {
                directoryStruct = levelExists.directory;
            } else {
                directoryStruct = {}; 
            }
            if (level === 2.1) {
                const splitPoint = Math.ceil(flag.length / 2);
                const flag1 = flag.slice(0, splitPoint);
                const flag2 = flag.slice(splitPoint);
                if (directoryStruct.home[".flag.txt"]) {
                    directoryStruct.home[".flag.txt"].data = `FLAG PART 1: ${flag1}`;
                }
                if (directoryStruct.home["-flag.txt"]) {
                    directoryStruct.home["-flag.txt"].data = `FLAG PART 2: ${flag2}`;
                }
            }

            if (level === 2.2) {
                const splitPoint = Math.ceil(flag.length / 2);
                const flag1 = flag.slice(0, splitPoint);
                const flag2 = flag.slice(splitPoint);

                if (directoryStruct.cryptic[".flag.txt"]) {
                    directoryStruct.cryptic[".flag.txt"].data = `FLAG PART 1: ${flag1}`;
                }
                if (directoryStruct.cryptic["-flag.txt"]) {
                    directoryStruct.cryptic["-flag.txt"].data = `FLAG PART 2: ${flag2}`;
                }
            }

            if (level === 2.3) {
                const splitPoint = Math.ceil(flag.length / 2);
                const flag1 = flag.slice(0, splitPoint);
                const flag2 = flag.slice(splitPoint);

                if (directoryStruct[".flag.txt"]) {
                    directoryStruct[".flag.txt"].data = `FLAG PART 1: ${flag1}`;
                }
                if (directoryStruct["-flag.txt"]) {
                    directoryStruct["-flag.txt"].data = `FLAG PART 2: ${flag2}`;
                }
            }
        } catch (error) {
            console.error("Error reading level data:", error);
            directoryStruct = {};
        }

        let input = null;
        for(let i = 0; i < parsedObject.length; i++) {
            const command = parsedObject[i];
            if (command.command === 'ls') {
                output = ls.lsCommand(command.args, path, directoryStruct);
            } else if (command.command === 'cd') {
                if (input != null){
                    command.args[0] = input;
                }
                path = cd.cdCommand(command.args, path, directoryStruct);
                if (!path) {
                    output = "Invalid action";
                } else {
                    output = null;
                }
            }
            else if (command.command === 'cat') {
                if (input != null){
                    command.args[0] = input;
                }
                output=cat.catCommand(command.args[0], path, directoryStruct,flag);
            }
            else if (command.command === 'find'){
                if (input != null){
                    command.args[0] = input;
                }
                output = find.findCommand(command.args[0],path,directoryStruct);
            } else if (command.command === 'grep') {
                // output = grep.grepCommand(command.args[0], command.args[1], path, directoryStruct);
                output = grep.grep2(command.args[0], input, path, directoryStruct);
            } else if (command.command === 'base64') {
                output = base64.base64Command(command.args, path, directoryStruct,flag);
            } else {
                output = `${command.command}: Not found`
            }
            if (output != null) {
                input = output.trimEnd();
            }
            //input = output;
            // console.log(output, typeof output, "\n-------\n");
        }

        return res.status(200).send({ output, path });
    } catch (error) {
        console.log(error);
    }
});


const levelRoute = require("./routes/levels.js");
app.use("/api/levels", levelRoute);

passportSetup();
app.listen(process.env.PORT, () => {
    console.log(`CryptoHunt backend listening on port ${process.env.PORT}`);
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
    return { command: mainCommand, args: newArgs };
}

const parseCommand = (input) => {
    const commandsArray = input.trim().split('|');
    const commands = [];
    for (let i = 0; i < commandsArray.length; i++) {
        commands.push(parse(commandsArray[i]));
    }

    return commands;
}
