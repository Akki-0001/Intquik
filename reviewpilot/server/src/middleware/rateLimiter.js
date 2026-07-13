const rateLimit = require("express-rate-limit");

// General API limiter: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again after 15 minutes"
  }
});

// Authentication rate limiter: 20 login/register attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    status: 429,
    message: "Too many login/registration attempts, please try again after 15 minutes"
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
