const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user.model");
const {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendSubscriptionEmail,
  sendInvoiceEmail,
} = require("../utils/email");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecret_jwt_key_intuik_123!", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, companyName, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      companyName,
      phone,
    });

    if (user) {
      const token = generateToken(user._id);

      // Set HttpOnly Cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Send Welcome Email
      sendWelcomeEmail(user).catch(err => console.error("Failed to send welcome email:", err.message));

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        subscription: user.subscription,
        token: token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      // Check subscription status for client users
      if (user.role !== "admin" && user.subscription.status !== "Active") {
        res.status(403);
        throw new Error("Access denied. Your subscription is inactive or expired. Please contact Intuik support.");
      }

      const token = generateToken(user._id);

      // Set HttpOnly Cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
        subscription: user.subscription,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users/clients (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update client subscription (Admin only)
// @route   PUT /api/auth/users/:id/subscription
// @access  Private/Admin
const updateUserSubscription = async (req, res, next) => {
  try {
    const { plan, status, endDate } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("Client not found");
    }

    if (plan) user.subscription.plan = plan;
    if (status) user.subscription.status = status;
    if (endDate) user.subscription.endDate = new Date(endDate);

    const updatedUser = await user.save();

    // Send subscription update email
    sendSubscriptionEmail(updatedUser, updatedUser.subscription.plan, updatedUser.subscription.status)
      .catch(err => console.error("Failed to send subscription update email:", err.message));

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      companyName: updatedUser.companyName,
      role: updatedUser.role,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own subscription (Client User self-serve)
// @route   PUT /api/auth/my-subscription
// @access  Private
const updateMySubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const validPlans = ["Free", "Starter", "Professional", "Enterprise", "Smart AI-Review", "WhatsApp Chatbot", "AI Telecalling"];
    if (!validPlans.includes(plan)) {
      res.status(400);
      throw new Error("Invalid plan selected");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.subscription.plan = plan;
    user.subscription.status = "Active";
    user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days renewal

    const updatedUser = await user.save();

    // Trigger confirmation and invoice emails if upgrading to a paid plan
    if (plan !== "Free") {
      const planPrices = {
        "Starter": "₹799/yr",
        "Professional": "₹1,599/yr",
        "Enterprise": "Custom Quote",
        "Smart AI-Review": "₹4,999/yr",
        "WhatsApp Chatbot": "₹9,999/yr",
        "AI Telecalling": "₹14,999/yr"
      };
      const amount = planPrices[plan] || "₹0";
      const invoiceId = "INV-" + Math.floor(100000 + Math.random() * 900000);

      sendSubscriptionEmail(updatedUser, plan, "Active")
        .catch(err => console.error("Failed to send self-serve subscription email:", err.message));
      sendInvoiceEmail(updatedUser, plan, amount, invoiceId)
        .catch(err => console.error("Failed to send self-serve invoice email:", err.message));
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      companyName: updatedUser.companyName,
      role: updatedUser.role,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a client user directly (Admin only)
// @route   POST /api/auth/users
// @access  Private/Admin
const createClientUser = async (req, res, next) => {
  try {
    const { name, email, password, companyName, plan, status, endDate } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User with this email already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      companyName,
      subscription: {
        plan: plan || "Free",
        status: status || "Active",
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - request reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("No user found with that email address");
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP and save in user document
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(otpCode)
      .digest("hex");

    // Set token expiration (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Log OTP to server console for easy testing/fallback
    console.log("\n========================================");
    console.log(`🔑 PASSWORD RESET OTP FOR TESTING:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   OTP:   ${otpCode}`);
    console.log("========================================\n");

    // Send email (fire-and-forget, don't block on delivery)
    sendForgotPasswordEmail(user, otpCode).catch(err =>
      console.error("Failed to send OTP email:", err.message)
    );

    const response = { message: "Password reset OTP sent to email" };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password - submit OTP and new password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body; // token is the OTP code here

    if (!token || !password) {
      res.status(400);
      throw new Error("OTP and password are required");
    }

    // Hash the OTP received to match against stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token.trim())
      .digest("hex");

    // Find user with valid OTP and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Invalid or expired OTP");
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserSubscription,
  updateMySubscription,
  createClientUser,
  forgotPassword,
  resetPassword,
};
