const mongoose = require("mongoose");
const LEVELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

const DifficultySchema = new mongoose.Schema({
  level: {
    type: String,
    enum: Object.values(LEVELS),
    required: true,
    unique: true,
    index: true,
  },
  pointMultiplier: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Difficulty", DifficultySchema);
