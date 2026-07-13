const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header or Cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret_jwt_key_intuik_123!");

    // 3. Find and attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found with this token" });
    }

    // Check subscription status for client users
    if (req.user.role !== "admin" && req.user.subscription.status !== "Active") {
      // Allow self-serve plan updates/purchase even when expired/inactive
      if (
        req.path === "/my-subscription" || 
        req.baseUrl === "/api/auth" || 
        req.originalUrl.includes("my-subscription") ||
        req.originalUrl.includes("/api/payment")
      ) {
        return next();
      }
      return res.status(403).json({ message: "Access denied. Your subscription is inactive or expired." });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
