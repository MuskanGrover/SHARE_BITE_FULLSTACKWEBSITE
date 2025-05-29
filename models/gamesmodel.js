const mongoose = require("mongoose");

const gameScoreSchema = new mongoose.Schema({
    name: {  // Store the user's name
        type: String,
    },
    email: {  // Ensure email is unique
        type: String,
        required: true,
        unique: true, // This ensures each email is unique
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    datePlayed: {
        type: Date,
        default: Date.now
    }
});

const GameScore = mongoose.model("GameScore", gameScoreSchema);

module.exports = GameScore;

