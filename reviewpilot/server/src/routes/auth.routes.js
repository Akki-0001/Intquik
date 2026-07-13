const express = require("express");
const { protect, admin } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserSubscription,
  updateMySubscription,
  createClientUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
router.get("/me", protect, getUserProfile);

// Admin-only Client Management
router.get("/users", protect, admin, getAllUsers);
router.post("/users", protect, admin, createClientUser);
router.put("/users/:id/subscription", protect, admin, updateUserSubscription);

// Client Self-Serve subscription management
router.put("/my-subscription", protect, updateMySubscription);

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
