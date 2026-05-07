const Answer = require("../models/Answer");
const logger = require("../utils/logger");

// Simple in-memory cache for analytics
const analyticsCache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Compute analytics for a specific user.
 */
const getAnalytics = async (userId) => {
  try {
    // Check cache
    const cached = analyticsCache.get(userId.toString());
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      logger.info("Analytics retrieved from cache", { userId });
      return cached.data;
    }

    const answers = await Answer.find({ userId }).populate("questionId");
    
    if (!answers.length) {
      return {
        totalInterviewsTaken: 0,
        averageScore: 0,
        scoreOverTime: [],
        topicWisePerformance: {}
      };
    }

    const totalInterviewsTaken = answers.length;
    
    // Use Number() and handle potential undefined/null
    const scores = answers.map(a => Number(a.score) || 0);
    const averageScore = scores.length > 0 
      ? Number((scores.reduce((acc, curr) => acc + curr, 0) / totalInterviewsTaken).toFixed(2)) 
      : 0;
    
    const scoreOverTime = answers.map(a => ({
      date: a.createdAt,
      score: Number(a.score) || 0
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const topicWisePerformance = {};
    answers.forEach(a => {
      const topic = a.questionId?.category || "General";
      if (!topicWisePerformance[topic]) {
        topicWisePerformance[topic] = { total: 0, count: 0 };
      }
      topicWisePerformance[topic].total += (Number(a.score) || 0);
      topicWisePerformance[topic].count += 1;
    });

    const formattedTopicWisePerformance = {};
    for (const topic in topicWisePerformance) {
      const avg = topicWisePerformance[topic].total / topicWisePerformance[topic].count;
      formattedTopicWisePerformance[topic] = Number(avg.toFixed(2));
    }

    const result = {
      totalInterviewsTaken,
      averageScore,
      scoreOverTime,
      topicWisePerformance: formattedTopicWisePerformance
    };

    // Update cache
    analyticsCache.set(userId.toString(), {
      data: result,
      timestamp: Date.now()
    });

    logger.info("Analytics computed and cached", { userId });
    return result;
  } catch (error) {
    logger.error("Analytics computation failure:", error);
    return {
      totalInterviewsTaken: 0,
      averageScore: 0,
      scoreOverTime: [],
      topicWisePerformance: {}
    };
  }
};

/**
 * Detect weak areas based on average score per topic.
 */
const detectWeakAreas = async (userId) => {
  const analytics = await getAnalytics(userId);
  const weakTopics = [];
  
  for (const topic in analytics.topicWisePerformance) {
    const score = Number(analytics.topicWisePerformance[topic]);
    if (!isNaN(score) && score < 5) {
      weakTopics.push(topic);
    }
  }
  
  return weakTopics;
};

/**
 * Generate recommendations based on weak topics.
 */
const generateRecommendations = (weakTopics, totalInterviews = 0) => {
  try {
    if (totalInterviews === 0) {
      return ["Welcome to InterviewIQ! Take your first AI-generated interview to see personalized performance recommendations."];
    }

    if (!Array.isArray(weakTopics) || !weakTopics.length) {
      return ["Your performance is solid! Keep practicing with diverse questions to maintain your level."];
    }

    const recommendations = [];
    weakTopics.forEach(topic => {
      if (topic === "DSA") recommendations.push("Strengthen your Data Structures and Algorithms fundamentals.");
      else if (topic === "System Design") recommendations.push("Practice designing scalable systems and understanding microservices.");
      else if (topic === "HR" || topic === "Behavioral") recommendations.push("Work on your communication and star method for behavioral questions.");
      else recommendations.push(`Practice more questions in the ${topic} category.`);
    });

    return recommendations;
  } catch (error) {
    logger.error("Recommendation generation failure:", error);
    return ["Continue practicing to improve your skills."];
  }
};

module.exports = {
  getAnalytics,
  detectWeakAreas,
  generateRecommendations,
  // Exporting cache clear for testing if needed
  clearCache: (userId) => analyticsCache.delete(userId.toString())
};
