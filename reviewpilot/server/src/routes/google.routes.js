const express = require("express");
const Business = require("../models/business.model");
const { protect } = require("../middleware/auth");
const { getAuthUrl, getTokens, getLocations, syncReviews, replyToReview } = require("../services/gmb.service");
const { generateReply } = require("../services/ai.service");

const router = express.Router();

// @desc    Get Google OAuth URL
// @route   GET /api/google/auth
router.get("/auth", protect, async (req, res, next) => {
  try {
    const url = getAuthUrl();
    res.json({ url });
  } catch (error) {
    next(error);
  }
});

// @desc    Handle Google OAuth callback
// @route   POST /api/google/callback
router.post("/callback", protect, async (req, res, next) => {
  try {
    const { code, businessId } = req.body;
    
    const business = await Business.findOne({ _id: businessId, userId: req.user._id });
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    const tokens = await getTokens(code);
    business.googleAccessToken = tokens.access_token;
    if (tokens.refresh_token) business.googleRefreshToken = tokens.refresh_token;
    business.googleTokenExpiry = tokens.expiry_date;
    
    await business.save();
    res.json({ message: "Successfully connected to Google My Business" });
  } catch (error) {
    next(error);
  }
});

// @desc    Get GMB Locations
// @route   GET /api/google/locations/:businessId
router.get("/locations/:businessId", protect, async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.businessId, userId: req.user._id });
    if (!business || !business.googleAccessToken) {
      res.status(400);
      throw new Error("Google not connected");
    }

    const tokens = {
      access_token: business.googleAccessToken,
      refresh_token: business.googleRefreshToken,
      expiry_date: business.googleTokenExpiry,
    };

    const locations = await getLocations(tokens);
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

// @desc    Save GMB Location ID and Toggle Auto Reply
// @route   PUT /api/google/settings/:businessId
router.put("/settings/:businessId", protect, async (req, res, next) => {
  try {
    const { gmbLocationId, autoReplyEnabled } = req.body;
    const business = await Business.findOne({ _id: req.params.businessId, userId: req.user._id });
    
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    if (gmbLocationId !== undefined) business.gmbLocationId = gmbLocationId;
    if (autoReplyEnabled !== undefined) business.autoReplyEnabled = autoReplyEnabled;

    const updatedBusiness = await business.save();
    res.json(updatedBusiness);
  } catch (error) {
    next(error);
  }
});

// @desc    Sync Reviews and Auto-Reply if enabled
// @route   POST /api/google/sync/:businessId
router.post("/sync/:businessId", protect, async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.businessId, userId: req.user._id });
    if (!business || !business.googleAccessToken || !business.gmbLocationId) {
      res.status(400);
      throw new Error("GMB not fully configured");
    }

    const tokens = {
      access_token: business.googleAccessToken,
      refresh_token: business.googleRefreshToken,
      expiry_date: business.googleTokenExpiry,
    };

    // 1. Fetch reviews
    const gmbReviews = await syncReviews(business, tokens);
    let repliesSent = 0;

    // 2. Loop through and process (Auto-reply logic)
    for (const rev of gmbReviews) {
      // In a real app, we'd check our DB to see if we already saved/replied to this review.
      // We will skip that for this mock.
      
      const ratingNum = rev.starRating === 'FIVE' ? 5 : rev.starRating === 'FOUR' ? 4 : rev.starRating === 'THREE' ? 3 : rev.starRating === 'TWO' ? 2 : 1;
      const customerName = rev.reviewer ? rev.reviewer.displayName : "Customer";
      
      if (business.autoReplyEnabled) {
        // Generate real AI reply with Groq
        const replyText = await generateReply(customerName, ratingNum, rev.comment || "", business.name);
        // In a real app we would only reply if there is no reviewReply object on rev
        if (!rev.reviewReply) {
           await replyToReview(business.gmbLocationId, rev.reviewId, replyText, tokens);
           repliesSent++;
        }
      }
    }

    res.json({ message: "Sync complete", reviewsSynced: gmbReviews.length, repliesSent });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
