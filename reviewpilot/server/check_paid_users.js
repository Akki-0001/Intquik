const mongoose = require("mongoose");
const User = require("./src/models/user.model");
require("dotenv").config();

async function checkPaidUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const users = await User.find({ role: { $ne: "admin" } }).select("name email phone subscription role");
    
    console.log("=========================================");
    console.log("Client Accounts and their Subscriptions:");
    console.log("=========================================");
    
    let paidUsers = 0;
    users.forEach((u) => {
      const isPaid = u.subscription && u.subscription.plan !== "Free" && u.subscription.status === "Active";
      if (isPaid) paidUsers++;
      console.log(`- Name: ${u.name}`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Phone: ${u.phone}`);
      console.log(`  Plan: ${u.subscription?.plan || "Free"} (${u.subscription?.status || "Inactive"})`);
      console.log(`  End Date: ${u.subscription?.endDate ? new Date(u.subscription.endDate).toLocaleDateString() : "N/A"}`);
      console.log("-----------------------------------------");
    });
    
    console.log(`Total Client Accounts: ${users.length}`);
    console.log(`Total Paid/Active Accounts: ${paidUsers}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkPaidUsers();
