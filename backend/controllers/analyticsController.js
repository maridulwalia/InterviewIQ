const analyticsService = require("../services/analyticsService");
const logger = require("../utils/logger");

/**
 * @route   GET /api/analytics/:userId
 * @desc    Get user performance analytics
 * @access  Private
 */
const getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    logger.info("Fetching analytics", { userId });
    
    const analytics = await analyticsService.getAnalytics(userId);
    const weakTopics = await analyticsService.detectWeakAreas(userId);
    const rawRecommendations = analyticsService.generateRecommendations(weakTopics, analytics.totalInterviewsTaken);

    // Map to frontend interface structure
    const topicPerformance = Object.entries(analytics.topicWisePerformance).map(([topic, score]) => ({
      topic,
      score: Number(score)
    }));

    const weakAreas = topicPerformance
      .filter(t => t.score < 5)
      .sort((a, b) => a.score - b.score);

    const bestArea = topicPerformance.length > 0 
      ? topicPerformance.reduce((prev, current) => (prev.score > current.score) ? prev : current).topic 
      : "N/A";

    const recommendations = rawRecommendations.map(rec => ({
      title: rec.split(".")[0],
      description: rec
    }));

    res.status(200).json({
      success: true,
      data: {
        totalInterviews: analytics.totalInterviewsTaken,
        averageScore: analytics.averageScore,
        bestArea,
        performanceOverTime: analytics.scoreOverTime.map(s => ({
          date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          score: s.score
        })),
        topicPerformance,
        weakAreas,
        recommendations
      }
    });
  } catch (error) {
    logger.error("Analytics controller failure:", error);
    next(error);
  }
};

module.exports = {
  getUserAnalytics
};
