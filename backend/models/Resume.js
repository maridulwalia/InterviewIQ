const mongoose = require("mongoose");

/**
 * Resume Schema
 * Stores resume data, either as a file path or extracted text, linked to a user.
 */
const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Original filename for display purposes
    originalName: {
      type: String,
    },
    // Relative path where the file is stored on disk
    fileUrl: {
      type: String,
    },
    // Optional: extracted text content from the resume
    extractedText: {
      type: String,
      default: "",
    },
    // MIME type of the uploaded file
    mimetype: {
      type: String,
    },
    // File size in bytes
    size: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
