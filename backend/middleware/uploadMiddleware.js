const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists on startup
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Disk storage: saves files to /uploads with a unique timestamped name.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

/**
 * MIME + extension whitelist.
 * Accepts: PDF, plain-text (.txt), and Word docs (.doc, .docx).
 */
const ALLOWED_MIME_TYPES = [
  "application/pdf", 
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"  
];
const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".docx", ".doc"];

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Only PDF, TXT, DOC, and DOCX files are accepted."
      ),
      false
    );
  }
};

/**
 * Multer upload instance.
 * Max file size: 5 MB. Field name: "resume".
 */
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = uploadMiddleware;
