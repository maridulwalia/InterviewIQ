const Joi = require("joi");

/**
 * Validator Middleware
 * @param {Object} schema - Joi validation schema.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
  
  // Replace req.body with validated and sanitized values
  req.body = value;
  next();
};

// Validation Schemas
const schemas = {
  answerSubmission: Joi.object({
    questionId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
      "string.pattern.base": "Invalid Question ID format"
    }),
    answerText: Joi.string().min(10).max(5000).required(),
    sessionId: Joi.string().allow(null, ""),
  }),
  questionGeneration: Joi.object({
    role: Joi.string().min(2).max(100).default("Software Developer"),
    difficulty: Joi.string().valid("EASY", "MEDIUM", "HARD").default("MEDIUM"),
    total: Joi.number().min(1).max(20).default(10),
    technical: Joi.number().min(0).max(20).default(5),
    hr: Joi.number().min(0).max(10).default(2),
    behavioral: Joi.number().min(0).max(10).default(2),
    aptitude: Joi.number().min(0).max(10).default(1),
    technicalCategories: Joi.array().items(Joi.string()).default([]),
    regenerate: Joi.boolean().default(false),
  }),
  auth: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50),
  }),
};

module.exports = { validate, schemas };
