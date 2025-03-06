const mongoose = require("mongoose");
const Types = mongoose.Schema.Types;

require("./Category");
require("./Difficulty");

const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple-choice",
  SINGLE_CHOICE: "single-choice",
  FILL_IN: "fill-in",
};

const QuestionSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    difficultyId: {
      type: Types.ObjectId,
      ref: "Difficulty",
      required: true,
      index: true,
    },
    questionText: {
      type: Types.String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    options: {
      type: [{ id: String, text: String }],
      validate: [
        optionsLimitValidator,
        "Question must have between 2 and 6 options",
      ],
    },
    correctAnswer: {
      type: Types.String,
      required: true,
      validate: [
        correctAnswerValidator,
        "Correct answer must match one of the option IDs",
      ],
    },
    type: {
      type: Types.String,
      enum: Object.values(QUESTION_TYPES),
      required: true,
    },
  },
  { timestamps: true },
);

function optionsLimitValidator(val) {
  return val.length >= 2 && val.length <= 6;
}

function correctAnswerValidator(val) {
  return this.options.some((option) => option.id === val);
}

QuestionSchema.methods.getOptionsAsAstring = async function () {
  return this.options.map((option) => option.text).join(", ");
};

QuestionSchema.index({ userId: 1, createdAt: -1 });
QuestionSchema.index({ categoryId: 1, difficultyId: 1 });
QuestionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Question", QuestionSchema);
