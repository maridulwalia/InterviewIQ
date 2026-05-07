const express = require("express");
const { protect } = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const { uploadResume, getResumes, getMyResume, deleteResume } = require("../controllers/resumeController");

const router = express.Router();

// All resume routes require a valid JWT
router.use(protect);

// @POST /api/resume/upload – Upload PDF or .txt resume, extract text
router.post(
  "/upload",
  uploadMiddleware.single("resume"), // field name must match frontend FormData key
  uploadResume
);

// @GET /api/resume/me – Get latest resume with full text
router.get("/me", getMyResume);

// @GET /api/resume – Get all resumes for current user
router.get("/", getResumes);

// @DELETE /api/resume/:id – Delete a resume
router.delete("/:id", deleteResume);

module.exports = router;
