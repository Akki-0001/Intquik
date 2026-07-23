const cron = require("node-cron");
const Business = require("../models/business.model");
const { processBusinessReviews } = require("../services/gmb.service");

// Runs every 30 minutes
const startReviewSyncJob = () => {
  cron.schedule("*/30 * * * *", async () => {
    console.log("[CRON] Starting Google My Business review sync & auto-reply job...");

    try {
      // Find all active businesses that have auto-reply enabled and have connected to GMB
      const businesses = await Business.find({
        isActive: true,
        autoReplyEnabled: true,
        googleAccessToken: { $exists: true, $ne: "" },
        gmbLocationId: { $exists: true, $ne: "" },
      });

      console.log(`[CRON] Found ${businesses.length} eligible businesses for auto-reply sync.`);

      for (const business of businesses) {
        try {
          console.log(`[CRON] Processing business: ${business.name} (${business._id})`);
          const { synced, replied } = await processBusinessReviews(business);
          console.log(`[CRON] - Synced ${synced} reviews, sent ${replied} auto-replies.`);
        } catch (bizError) {
          console.error(`[CRON] Failed to process business ${business._id}:`, bizError.message);
          // Continue to next business even if one fails
        }
      }

      console.log("[CRON] Review sync & auto-reply job completed successfully.");
    } catch (error) {
      console.error("[CRON] Fatal error during review sync job:", error);
    }
  });
  
  console.log("[CRON] Review sync job initialized (runs every 30 minutes).");
};

module.exports = startReviewSyncJob;
