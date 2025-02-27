const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  score: { type: Number, default: 0 },
  puzzleHistory: [
    {
      date: { type: Date, default: Date.now }, 
      puzzlesSolved: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);