const mongoose = require("mongoose");

/**
 * Answer Schema
 * Stores a user's submitted answer to an interview question.
 */
const answerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answerText: {
      type: String,
      required: [true, "Answer text is required"],
      trim: true,
    },
  },
  { timestamps: true } // createdAt serves as timestamp
);

module.exports = mongoose.model("Answer", answerSchema);
