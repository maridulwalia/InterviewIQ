const mongoose = require("mongoose");

/**
 * InterviewSession Schema
 * Stores a specific set of questions generated for a user's configuration.
 * Enables caching and reuse of interview sessions.
 */
const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"],
    },
    questionConfig: {
      total: { type: Number, default: 10 },
      technical: { type: Number, default: 5 },
      hr: { type: Number, default: 2 },
      behavioral: { type: Number, default: 2 },
      aptitude: { type: Number, default: 1 },
      technicalCategories: { type: [String], default: [] },
    },
    questions: [
      {
        text: String,
        type: {
          type: String,
          enum: ["technical", "hr", "behavioral", "aptitude"],
        },
        category: String,
      }
    ],
    generatedByAI: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookup of existing sessions
interviewSessionSchema.index({ userId: 1, role: 1, difficulty: 1, "questionConfig.total": 1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
