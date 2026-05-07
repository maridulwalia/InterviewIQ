const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getAllQuestions,
  getMockInterview,
} = require("../controllers/questionController");
const { protect } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validator");

// Routes for /api/questions and /api/interview
router.post("/", protect, validate(schemas.questionGeneration), getQuestions);
router.get("/all", protect, getAllQuestions);
router.post("/mock", protect, validate(schemas.questionGeneration), getMockInterview);

module.exports = router;
