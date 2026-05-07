const express = require("express");
const router = express.Router();
const { submitAnswer, getMyAnswers } = require("../controllers/answerController");
const { protect } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validator");

// @POST /api/answers    – Submit an answer and get AI evaluation
router.post("/", protect, validate(schemas.answerSubmission), submitAnswer);

// @GET /api/answers     – Get all answers for the current user
router.get("/", protect, getMyAnswers);

module.exports = router;
