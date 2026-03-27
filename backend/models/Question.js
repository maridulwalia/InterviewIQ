const mongoose = require("mongoose");

/**
 * Question Schema
 * Represents a predefined interview question with a type category.
 */
const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["behavioral", "technical", "situational", "general"],
      default: "general",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
