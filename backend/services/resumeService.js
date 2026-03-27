const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extract text from an uploaded resume file.
 *
 * Supports:
 *   - PDF  → extract via pdf-parse
 *   - DOCX → extract via mammoth
 *   - .txt → read directly with fs
 *
 * @param {Express.Multer.File} file - The file object provided by multer
 * @returns {Promise<string>} Extracted text content
 */
const extractTextFromFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;

  try {
    if (ext === ".pdf") {
      // Read the file into a buffer and parse with pdf-parse v2
      const buffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse(uint8Array);
      const result = await parser.getText();
      return (result.text || "").trim();
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return (result.value || "").trim();
    }

    if (ext === ".doc") {
      console.warn("⚠️ Legacy .doc file uploaded. Text extraction skipped.");
      return "";
    }

    if (ext === ".txt") {
      // Plain-text: read directly from disk
      return fs.readFileSync(filePath, "utf-8").trim();
    }

    // Should never reach here due to the middleware filter, but guard anyway
    throw new Error(`Unsupported file extension: ${ext}`);
  } catch (err) {
    // Re-throw with a clear message so the controller can handle gracefully
    throw new Error(`Text extraction failed: ${err.message}`);
  }
};

module.exports = { extractTextFromFile };
