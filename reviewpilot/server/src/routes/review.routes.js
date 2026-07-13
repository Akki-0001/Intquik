const express = require("express");
const Review = require("../models/review.model");
const Business = require("../models/business.model");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// @desc    Submit new review (Public Funnel)
// @route   POST /api/reviews
router.post("/", async (req, res, next) => {
  try {
    const { businessId, rating, customerName, customerEmail, comment, status } = req.body;

    if (!businessId || !rating || !customerName || !customerEmail || !status) {
      res.status(400);
      throw new Error("Missing required review fields");
    }

    const businessExists = await Business.findById(businessId);
    if (!businessExists) {
      res.status(404);
      throw new Error("Target business location not found");
    }

    const review = await Review.create({
      businessId,
      rating,
      customerName,
      customerEmail,
      comment,
      status, // public, private
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// Protect all other routes
router.use(protect);

// @desc    Get reviews for all businesses owned by current user
// @route   GET /api/reviews
router.get("/", async (req, res, next) => {
  try {
    // 1. Find all businesses belonging to current user
    const userBusinesses = await Business.find({ userId: req.user._id }).select("_id");
    const businessIds = userBusinesses.map((b) => b._id);

    // 2. Fetch reviews matching those business IDs
    const reviews = await Review.find({ businessId: { $in: businessIds } })
      .populate("businessId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// @desc    Reply/Respond to a review
// @route   PUT /api/reviews/:id/reply
router.put("/:id/reply", async (req, res, next) => {
  try {
    const { reply } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // Verify ownership
    const business = await Business.findOne({ _id: review.businessId, userId: req.user._id });
    if (!business) {
      res.status(403);
      throw new Error("Unauthorized to reply to this review");
    }

    review.reply = reply;
    const updatedReview = await review.save();

    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
});

// @desc    Get all reviews in database (Admin only)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
router.get("/admin/all", admin, async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate({
        path: "businessId",
        select: "name userId",
        populate: {
          path: "userId",
          select: "name email companyName",
        },
      })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete any review (Admin only)
// @route   DELETE /api/reviews/admin/:id
// @access  Private/Admin
router.delete("/admin/:id", admin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }
    res.json({ message: "Review deleted successfully by Administrator" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
