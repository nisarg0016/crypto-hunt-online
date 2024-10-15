const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    flags: [{
        type: String,
    }],
    levelFinished: [{
        type: Boolean
    }]
})

module.exports = mongoose.model("User", userSchema);