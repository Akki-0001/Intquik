const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/auth.routes");
const businessRoutes = require("./routes/business.routes");
const reviewRoutes = require("./routes/review.routes");
const qrRoutes = require("./routes/qr.routes");
const paymentRoutes = require("./routes/payment.routes");
const googleRoutes = require("./routes/google.routes");

const path = require("path");
const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://intquik-amr2.vercel.app",
      process.env.CORS_ORIGIN
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Healthcheck
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/google", googleRoutes);

// Error Handling (must be last)
app.use(errorHandler);

module.exports = app;
