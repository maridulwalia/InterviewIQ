const dotenv = require("dotenv");
const Question = require("../models/Question");
const connectDB = require("./db");
const questions = require("./questions");

dotenv.config();

/**
 * Standalone seed script: node config/seed.js
 * Clears existing questions and re-seeds from the shared questions list.
 */
const seedDB = async () => {
  try {
    await connectDB();

    await Question.deleteMany({});
    console.log("🗑️  Cleared existing questions.");

    await Question.insertMany(questions);
    console.log(`🌱 Seeded ${questions.length} interview questions successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
