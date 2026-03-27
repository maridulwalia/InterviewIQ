const express = require("express");
const { protect } = require("../middleware/auth");
const { getQuestions, getAllQuestions } = require("../controllers/questionController");

const router = express.Router();

// All question routes are protected
router.use(protect);

// @GET /api/questions        – Random questions (default 10, use ?limit=N&type=behavioral)
router.get("/", getQuestions);

// @GET /api/questions/all    – All questions, with optional ?type= filter
router.get("/all", getAllQuestions);

module.exports = router;
