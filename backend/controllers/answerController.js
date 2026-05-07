const Answer = require("../models/Answer");
const Question = require("../models/Question");
const Resume = require("../models/Resume");
const aiService = require("../services/aiService");
const logger = require("../utils/logger");

/**
 * @route   POST /api/answers
 * @desc    Submit an answer to a question and get AI evaluation
 * @access  Private
 */
const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answerText, sessionId } = req.body;

    logger.info("Answer submission started", { userId: req.user._id, questionId });

    // Verify the question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // Get resume context for better evaluation
    const resume = await Resume.findOne({ userId: req.user._id });
    const resumeText = resume ? resume.extractedText : "";

    // Get AI evaluation
    const evaluation = await aiService.evaluateAnswer(
      question.text,
      answerText,
      resumeText
    );

    const answer = await Answer.create({
      userId: req.user._id,
      questionId,
      answerText,
      sessionId: sessionId || null,
      score: evaluation.score,
      feedback: evaluation.feedback,
      missingPoints: evaluation.missingPoints,
      improvementSuggestion: evaluation.improvementSuggestion,
    });

    logger.info("Answer submitted and evaluated", { answerId: answer._id, score: answer.score });

    res.status(201).json({
      success: true,
      data: {
        id: answer._id,
        questionId: answer.questionId,
        answerText: answer.answerText,
        score: answer.score,
        feedback: answer.feedback,
        missingPoints: answer.missingPoints,
        improvementSuggestion: answer.improvementSuggestion,
        submittedAt: answer.createdAt,
      },
    });
  } catch (error) {
    logger.error("Answer submission failure:", error);
    next(error);
  }
};

/**
 * @route   GET /api/answers
 * @desc    Get all answers submitted by the authenticated user
 */
const getMyAnswers = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    const filter = { userId: req.user._id };
    if (sessionId) filter.sessionId = sessionId;

    const answers = await Answer.find(filter)
      .populate("questionId", "text type category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: answers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitAnswer, getMyAnswers };
