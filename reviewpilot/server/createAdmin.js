const mongoose = require("mongoose");
const User = require("./src/models/user.model");
require("dotenv").config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    
    let admin = await User.findOne({ email: "admin@intuik.com" });
    if (!admin) {
      admin = new User({
        name: "Super Admin",
        email: "admin@intuik.com",
        password: "adminpassword",
        role: "admin",
      });
      await admin.save();
      console.log("Created new admin");
    } else {
      admin.password = "adminpassword";
      await admin.save();
      console.log("Updated admin password");
    }
    
    console.log("Admin email: admin@intuik.com");
    console.log("Admin password: adminpassword");
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
