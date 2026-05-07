const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { validate, schemas } = require("../middleware/validator");

// @POST /api/auth/signup
router.post("/signup", validate(schemas.auth), signup);

// @POST /api/auth/login
router.post("/login", validate(schemas.auth), login);

module.exports = router;
