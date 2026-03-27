const Resume = require("../models/Resume");
const { extractTextFromFile } = require("../services/resumeService");

/**
 * @route   POST /api/resume/upload
 * @desc    Upload a resume file, extract its text, and save to DB
 * @access  Private (JWT required)
 */
const uploadResume = async (req, res, next) => {
  try {
    // Multer populates req.file; if missing the middleware rejected the file
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { originalname, filename, mimetype, size } = req.file;
    const fileUrl = `/uploads/${filename}`;

    // ── Extract text from the uploaded file ────────────────────────────
    let extractedText = "";
    try {
      extractedText = await extractTextFromFile(req.file);
    } catch (extractErr) {
      // Non-fatal: log the error but continue saving the record
      console.warn("⚠️  Text extraction warning:", extractErr.message);
    }

    // ── Persist to MongoDB ─────────────────────────────────────────────
    const resume = await Resume.create({
      userId: req.user._id,
      originalName: originalname,
      fileUrl,
      mimetype,
      size,
      extractedText,
    });

    // Return a 200-char preview of extracted text in the response
    const textPreview = extractedText.slice(0, 200);

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      extractedText: textPreview,
      resume: {
        id: resume._id,
        originalName: resume.originalName,
        fileUrl: resume.fileUrl,
        size: resume.size,
        hasText: extractedText.length > 0,
        uploadedAt: resume.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/resume
 * @desc    Get the authenticated user's resumes
 * @access  Private
 */
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select("-extractedText")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadResume, getResumes };
