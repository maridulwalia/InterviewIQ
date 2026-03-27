const Question = require("../models/Question");

/**
 * @route   GET /api/questions
 * @desc    Get a random set of interview questions
 * @access  Private
 */
const getQuestions = async (req, res, next) => {
  try {
    // Optional query params: ?type=behavioral&limit=5
    const { type, limit = 10 } = req.query;

    const filter = {};
    if (type) {
      const validTypes = ["behavioral", "technical", "situational", "general"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid type. Valid values: ${validTypes.join(", ")}`,
        });
      }
      filter.type = type;
    }

    // MongoDB $sample aggregation for random selection
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit, 10) } },
    ]);

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/questions/all
 * @desc    Get all questions (optionally filtered by type)
 * @access  Private
 */
const getAllQuestions = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const questions = await Question.find(filter).sort({ type: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestions, getAllQuestions };
