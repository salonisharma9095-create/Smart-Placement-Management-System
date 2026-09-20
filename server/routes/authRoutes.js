const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// Temporary test route
router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated!",
    user: req.user,
  });
});

module.exports = router;