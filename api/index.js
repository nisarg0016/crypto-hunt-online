const express = require("express");
const mongoose = require("mongoose");
const ls = require("./commands/ls.js")
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session"); 
const app = express();
const passportSetup = require("./passport-setup");
const User = require("./models/User")

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
    cors({
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
    const role = req.user.role;
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

// club login backend left
////////////////////////////////////////////////

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
    return {command: mainCommand, args: newArgs};
}