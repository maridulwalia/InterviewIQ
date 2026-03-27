const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const { submitAnswer, getMyAnswers } = require("../controllers/answerController");

const router = express.Router();

// All answer routes are protected
router.use(protect);

// Validation for submitting an answer
const answerValidation = [
  body("questionId").notEmpty().withMessage("questionId is required"),
  body("answerText")
    .trim()
    .notEmpty()
    .withMessage("Answer text is required")
    .isLength({ min: 5 })
    .withMessage("Answer must be at least 5 characters"),
];

// @POST /api/answers   – Submit an answer
router.post("/", answerValidation, submitAnswer);

// @GET  /api/answers   – Get current user's answers
router.get("/", getMyAnswers);

module.exports = router;
