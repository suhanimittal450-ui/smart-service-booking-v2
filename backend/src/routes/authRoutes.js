const express = require("express");

const router = express.Router();

const {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

/*
=====================================
Test Route
=====================================
*/

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth Route Working",
  });
});

/*
=====================================
Authentication Routes
=====================================
*/

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Refresh Access Token
router.post("/refresh-token", refreshToken);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Logout
router.post("/logout", protect, logout);

// Current logged-in user (used to restore session on page refresh)
router.get("/me", protect, getMe);

module.exports = router;
