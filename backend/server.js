const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const Question = require("./models/Question");
const sampleQuestions = require("./config/questions");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// ─── Connect to MongoDB & Auto-seed ──────────────────────────────────
const initDB = async () => {
  await connectDB();
  // Auto-seed questions if the collection is empty
  const count = await Question.countDocuments();
  if (count === 0) {
    await Question.insertMany(sampleQuestions);
    console.log(`🌱 Auto-seeded ${sampleQuestions.length} sample questions.`);
  }
};
initDB();

// ─── Global Middlewares ───────────────────────────────────────────────

// Enable CORS for the React frontend (port 8080 / 5173 / 3000)
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (e.g. /uploads/resume-xxx.pdf)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API Routes ───────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/answers", require("./routes/answerRoutes"));

// ─── Health Check ────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InterviewIQ API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler for Unknown Routes ─────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Centralized Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
});
