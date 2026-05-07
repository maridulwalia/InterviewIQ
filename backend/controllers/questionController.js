const Question = require("../models/Question");
const Resume = require("../models/Resume");
const InterviewSession = require("../models/InterviewSession");
const aiService = require("../services/aiService");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

/**
 * @route   POST /api/questions
 * @desc    Get or Generate interview questions with caching and custom config
 * @access  Private
 */
const getQuestions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { 
      role = "Software Developer", 
      difficulty = "MEDIUM",
      total = 10,
      technical = 5,
      hr = 2,
      behavioral = 2,
      aptitude = 1,
      technicalCategories = [],
      regenerate = false
    } = req.body;

    const questionConfig = { total, technical, hr, behavioral, aptitude, technicalCategories };

    logger.info("Handling question request", { userId, role, difficulty, regenerate });

    // 1. Check for existing active session if not regenerating
    if (!regenerate) {
      const existingSession = await InterviewSession.findOne({
        userId,
        role,
        difficulty,
        "questionConfig.total": total,
        "questionConfig.technical": technical,
        "questionConfig.hr": hr,
        "questionConfig.behavioral": behavioral,
        "questionConfig.aptitude": aptitude,
        isActive: true
      });

      if (existingSession && existingSession.questions.length > 0) {
        logger.info("Returning cached interview session", { sessionId: existingSession._id });
        return res.status(200).json({
          success: true,
          data: existingSession.questions,
          sessionId: existingSession._id,
          cached: true
        });
      }
    }

    // 2. If no session or regenerating, generate new questions
    const resume = await Resume.findOne({ userId });
    const resumeText = resume ? resume.extractedText : "No resume provided.";

    const aiQuestions = await aiService.generateQuestions(resumeText, role, difficulty, questionConfig);

    // 3. Deactivate previous sessions for this specific setup
    await InterviewSession.updateMany(
      { userId, role, difficulty, isActive: true },
      { isActive: false }
    );

    // 4. Save new session
    const newSession = await InterviewSession.create({
      userId,
      role,
      difficulty,
      questionConfig,
      questions: aiQuestions,
      generatedByAI: true,
      isActive: true
    });

    // 5. Also upsert to global Question collection for analytics/history
    await Promise.all(
      aiQuestions.map((q) =>
        Question.findOneAndUpdate(
          { text: q.text },
          { text: q.text, category: q.category || "General", type: q.type || "technical" },
          { upsert: true, new: true }
        )
      )
    );

    res.status(200).json({
      success: true,
      data: newSession.questions,
      sessionId: newSession._id,
      cached: false
    });
  } catch (error) {
    logger.error("Question generation controller failure:", error);
    next(error);
  }
};

/**
 * @route   GET /api/interview/mock
 * @desc    Start a mock interview session (Timed)
 * @access  Private
 */
const getMockInterview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { role = "Software Developer", difficulty = "MEDIUM" } = req.query;

    logger.info("Starting mock interview session", { userId, role, difficulty });

    const resume = await Resume.findOne({ userId });
    const resumeText = resume ? resume.extractedText : "No resume provided.";

    const questions = await aiService.generateQuestions(resumeText, role, difficulty);
    
    // Enrich with unique sessionId, time limit and difficulty
    const mockSession = {
      sessionId: uuidv4(),
      questions: questions.slice(0, 5), // Return 5 for mock
      timeLimit: 180, // 180 seconds per question
      difficulty,
      startedAt: new Date()
    };

    res.status(200).json({
      success: true,
      data: mockSession,
    });
  } catch (error) {
    logger.error("Mock interview controller failure:", error);
    next(error);
  }
};

/**
 * @route   GET /api/questions/all
 * @desc    Get all questions (optionally filtered by type)
 */
const getAllQuestions = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const questions = await Question.find(filter).sort({ type: 1 });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestions, getAllQuestions, getMockInterview };
