/**
 * Simple Logger Utility
 * Standardizes console logging across the application.
 */
const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, Object.keys(meta).length ? meta : "");
  },
  error: (message, error = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error.stack || error);
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta);
  },
  ai: (message, meta = {}) => {
    // Separate tag for AI interactions for easier filtering
    console.log(`[AI-DEBUG] ${new Date().toISOString()}: ${message}`, meta);
  }
};

module.exports = logger;
