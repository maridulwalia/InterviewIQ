/**
 * Shared pool of sample interview questions.
 * Used by both the auto-seeder in server.js and the standalone seed.js script.
 */
const questions = [
  // ── Behavioral ─────────────────────────────────────────────────────
  { text: "Tell me about yourself and your background.", type: "behavioral" },
  {
    text: "Describe a challenging project you worked on and how you overcame the obstacles.",
    type: "behavioral",
  },
  {
    text: "Give an example of a time you showed leadership skills.",
    type: "behavioral",
  },
  {
    text: "How do you handle tight deadlines and pressure?",
    type: "behavioral",
  },
  {
    text: "Tell me about a time you disagreed with a team member and how you resolved it.",
    type: "behavioral",
  },
  {
    text: "What is your greatest professional achievement?",
    type: "behavioral",
  },

  // ── Technical ──────────────────────────────────────────────────────
  {
    text: "Explain the difference between SQL and NoSQL databases.",
    type: "technical",
  },
  {
    text: "What is the difference between REST and GraphQL APIs?",
    type: "technical",
  },
  { text: "Explain how JWT authentication works.", type: "technical" },
  {
    text: "What are the SOLID principles in software engineering?",
    type: "technical",
  },
  {
    text: "How does asynchronous programming work in JavaScript?",
    type: "technical",
  },
  {
    text: "What is the difference between a process and a thread?",
    type: "technical",
  },
  {
    text: "Explain the concept of microservices architecture.",
    type: "technical",
  },

  // ── Situational ────────────────────────────────────────────────────
  {
    text: "How would you prioritize tasks if you had multiple urgent deadlines at the same time?",
    type: "situational",
  },
  {
    text: "What would you do if you discovered a critical bug in production right before a major release?",
    type: "situational",
  },
  {
    text: "How would you handle a situation where a client keeps changing their requirements?",
    type: "situational",
  },

  // ── General ────────────────────────────────────────────────────────
  { text: "Where do you see yourself in 5 years?", type: "general" },
  { text: "Why do you want to work at this company?", type: "general" },
  {
    text: "What are your biggest strengths and weaknesses?",
    type: "general",
  },
  { text: "Why are you leaving your current job?", type: "general" },
];

module.exports = questions;
