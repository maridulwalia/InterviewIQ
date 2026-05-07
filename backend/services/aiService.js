const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const logger = require("../utils/logger");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Robust JSON Parser for AI Responses
 * Handles markdown formatting (```json ... ```) and common AI glitches.
 */
const parseAIResponse = (text, fallback) => {
  try {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const cleaned = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let parsed = JSON.parse(cleaned);

    // If the response is wrapped in a difficulty object
    if (parsed && !Array.isArray(parsed) && parsed.questions && Array.isArray(parsed.questions)) {
      parsed = parsed.questions;
    }

    if (!Array.isArray(parsed)) {
      throw new Error("AI response is not an array");
    }

    // Normalize fields (text/question, category/topic/type)
    return parsed.map(q => ({
      text: q.text || q.question || "Explain your experience with " + (q.category || "this technology"),
      type: (q.type || q.category || "technical").toLowerCase(),
      category: q.category || q.topic || "General"
    }));
  } catch (error) {
    logger.error("Failed to parse AI response:", { text, error });
    return fallback;
  }
};

/**
 * Generate personalized interview questions based on resume, role and config.
 */
const generateQuestions = async (resumeText, role = "Software Developer", difficulty = "MEDIUM", config = {}) => {
  const {
    total = 10,
    technical = 5,
    hr = 2,
    behavioral = 2,
    aptitude = 1,
    technicalCategories = []
  } = config;

  const fallback = [
    { text: "Tell me about yourself and your background.", type: "hr", category: "HR" },
    { text: "Explain a challenging technical problem you solved recently.", type: "technical", category: "Technical" },
    { text: "How do you handle conflict within a team?", type: "behavioral", category: "Behavioral" },
    { text: "What are your strengths and weaknesses?", type: "hr", category: "HR" }
  ];

  try {
    logger.ai("Generating questions with configuration", { role, difficulty, total });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const techFocus = technicalCategories.length > 0 
      ? `Focus technical questions on: ${technicalCategories.join(", ")}.`
      : "Intelligently balance topics across DSA, DBMS, OS, Networking, SQL, OOPs, and System Design.";

    const prompt = `
      You are an expert technical interviewer for "InterviewIQ".
      
      OBJECTIVE:
      Generate a realistic, high-quality interview session.
      
      INPUTS:
      Resume: ${resumeText}
      Target Role: ${role}
      Difficulty: ${difficulty}
      
      DISTRIBUTION REQUIREMENTS (STRICT):
      - Total Questions: ${total}
      - Technical: ${technical} (${techFocus})
      - HR: ${hr}
      - Behavioral: ${behavioral}
      - Aptitude: ${aptitude}

      DIFFICULTY CONTROL:
      - EASY: basic fundamentals, conceptual clarity
      - MEDIUM: application, scenario-based, project deep-dives
      - HARD: system design, scalability, complex problem solving, edge cases

      CORE RULES:
      1. RESUME-DRIVEN: Use ONLY skills and projects from the resume.
      2. DIVERSITY: Ensure technical questions cover the specified categories if provided.
      3. BEHAVIORAL: Use real project scenarios from the resume.
      4. APTITUDE: Logical reasoning or scenario-based problem solving relative to the role.

      OUTPUT FORMAT (STRICT JSON ONLY):
      {
        "questions": [
          {
            "type": "technical | hr | behavioral | aptitude",
            "category": "Specific Topic (e.g. SQL, DBMS, DSA, React, Node.js)",
            "question": "..."
          }
        ]
      }

      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return parseAIResponse(text, fallback);
  } catch (error) {
    logger.error("AI Question Generation Critical Failure:", error);
    return fallback;
  }
};

/**
 * Evaluate a user's answer to a specific question.
 */
const evaluateAnswer = async (question, answer, resumeContext = "") => {
  const fallback = {
    score: 5,
    feedback: "The AI was unable to evaluate your answer at this time.",
    missingPoints: ["Technical depth", "Specific examples"],
    improvementSuggestion: "Try to be more descriptive and provide real-world examples."
  };

  try {
    logger.ai("Evaluating answer", { question: question.substring(0, 50) });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Evaluate the user's answer to the interview question.
      Question: ${question}
      User Answer: ${answer}
      Resume Context: ${resumeContext}

      Provide a strict JSON response:
      {
        "score": number (0-10),
        "feedback": "string",
        "missingPoints": ["string"],
        "improvementSuggestion": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const evaluation = parseAIResponse(text, fallback);
    
    // Ensure numeric score and correct structure
    evaluation.score = isNaN(evaluation.score) ? 5 : Math.max(0, Math.min(10, Number(evaluation.score)));
    evaluation.missingPoints = Array.isArray(evaluation.missingPoints) ? evaluation.missingPoints : [];
    
    return evaluation;
  } catch (error) {
    logger.error("AI Evaluation Critical Failure:", error);
    return fallback;
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswer
};
