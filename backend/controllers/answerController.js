const { validationResult } = require("express-validator");
const Answer = require("../models/Answer");
const Question = require("../models/Question");

/**
 * @route   POST /api/answers
 * @desc    Submit an answer to a question
 * @access  Private
 */
const submitAnswer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { questionId, answerText } = req.body;

    // Verify the question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    const answer = await Answer.create({
      userId: req.user._id,
      questionId,
      answerText,
    });

    res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      answer: {
        id: answer._id,
        questionId: answer.questionId,
        answerText: answer.answerText,
        submittedAt: answer.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/answers
 * @desc    Get all answers submitted by the authenticated user
 * @access  Private
 */
const getMyAnswers = async (req, res, next) => {
  try {
    const answers = await Answer.find({ userId: req.user._id })
      .populate("questionId", "text type") // Join question details
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: answers.length,
      answers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitAnswer, getMyAnswers };
