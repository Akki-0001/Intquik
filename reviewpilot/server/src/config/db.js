const mongoose = require("mongoose");
const User = require("../models/user.model");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/intuik");
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin if not exists
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "Super Owner",
        email: "admin@intuik.com",
        password: "Admin@123", // Will be hashed automatically by userSchema pre("save")
        companyName: "Intuik HQ",
        role: "admin",
        subscription: {
          plan: "Enterprise",
          status: "Active",
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        }
      });
      console.log("Seeded default Super Admin user: admin@intuik.com / Admin@123");
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // We don't exit in development so that nodemon can keep running and watch changes
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
