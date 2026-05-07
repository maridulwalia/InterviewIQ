const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const logger = require("../utils/logger");

/**
 * Extract text from an uploaded resume file.
 */
const extractTextFromFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;

  logger.info("Starting text extraction", { fileName: file.originalname, ext });

  try {
    if (ext === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse(uint8Array);
      const result = await parser.getText();
      const text = (result.text || "").trim();
      logger.info("PDF text extraction successful", { charCount: text.length });
      return text;
    }

    if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      const text = (result.value || "").trim();
      logger.info("DOCX text extraction successful", { charCount: text.length });
      return text;
    }

    if (ext === ".txt") {
      const text = fs.readFileSync(filePath, "utf-8").trim();
      logger.info("TXT text extraction successful", { charCount: text.length });
      return text;
    }

    throw new Error(`Unsupported file extension: ${ext}`);
  } catch (err) {
    logger.error("Text extraction failed", { fileName: file.originalname, error: err.message });
    throw new Error(`Text extraction failed: ${err.message}`);
  }
};

module.exports = { extractTextFromFile };
