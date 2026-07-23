require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const Business = require("./src/models/business.model");
const { processBusinessReviews } = require("./src/services/gmb.service");

async function runTest() {
  console.log("=== Testing Cron Job Logic ===");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const allBusinesses = await Business.find({});
    console.log(`Total businesses in DB: ${allBusinesses.length}`);
    for (const b of allBusinesses) {
      console.log(`- ${b.name}: isActive=${b.isActive}, autoReplyEnabled=${b.autoReplyEnabled}, hasGoogleToken=${!!b.googleAccessToken}, gmbLocationId=${b.gmbLocationId}`);
    }

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    mongoose.connection.close();
    console.log("Disconnected from MongoDB.");
  }
}

runTest();
