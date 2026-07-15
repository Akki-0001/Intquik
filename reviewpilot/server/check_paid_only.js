const mongoose = require("mongoose");
const User = require("./src/models/user.model");
require("dotenv").config();

async function getPaid() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({ role: { $ne: "admin" } });
  const paid = users.filter(u => u.subscription && u.subscription.plan !== "Free" && u.subscription.status === "Active");
  paid.forEach(u => {
    console.log(`- ${u.name} | ${u.email} | ${u.subscription.plan} (Active)`);
  });
  process.exit(0);
}
getPaid();
