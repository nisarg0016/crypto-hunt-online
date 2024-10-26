const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true
    },
    directory: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Level', LevelSchema);