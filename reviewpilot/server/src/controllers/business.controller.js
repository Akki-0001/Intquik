const Business = require("../models/business.model");
const { generateReviews, generateBatchReviews } = require("../services/ai.service");

// @desc    Get user's businesses
// @route   GET /api/businesses
// @access  Private
const getBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ userId: req.user._id });
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a business profile
// @route   POST /api/businesses
// @access  Private
const createBusiness = async (req, res, next) => {
  try {
    const { name, googleReviewUrl, yelpReviewUrl, primaryColor, ratingThreshold, seoKeywords } = req.body;

    if (!name || !googleReviewUrl) {
      res.status(400);
      throw new Error("Name and Google Review URL are required");
    }

    // Subscription Limit validation
    const activeBusinessesCount = await Business.countDocuments({ userId: req.user._id });
    const userPlan = req.user.subscription?.plan || "Free";

    let limit = 1; // Default Free plan limit
    if (userPlan === "Starter") limit = 3;
    else if (userPlan === "Professional") limit = 10;
    else if (userPlan === "Enterprise") limit = 999999; // Unlimited

    if (activeBusinessesCount >= limit) {
      res.status(403);
      throw new Error(`Location Limit Reached! Your current ${userPlan} plan allows a maximum of ${limit} location(s). Please upgrade your plan in settings.`);
    }

    let logoUrl = "";
    if (req.file) {
      logoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const business = await Business.create({
      userId: req.user._id,
      name,
      googleReviewUrl,
      yelpReviewUrl,
      primaryColor,
      ratingThreshold: ratingThreshold ? parseInt(ratingThreshold) : 4,
      seoKeywords: seoKeywords || [],
      logoUrl,
    });

    res.status(201).json(business);
  } catch (error) {
    next(error);
  }
};

// @desc    Update business profile
// @route   PUT /api/businesses/:id
// @access  Private
const updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.id, userId: req.user._id });
    if (!business) {
      res.status(404);
      throw new Error("Business not found or unauthorized");
    }

    const { name, googleReviewUrl, yelpReviewUrl, primaryColor, ratingThreshold, seoKeywords } = req.body;

    business.name = name || business.name;
    business.googleReviewUrl = googleReviewUrl || business.googleReviewUrl;
    business.yelpReviewUrl = yelpReviewUrl !== undefined ? yelpReviewUrl : business.yelpReviewUrl;
    business.primaryColor = primaryColor || business.primaryColor;
    business.ratingThreshold = ratingThreshold ? parseInt(ratingThreshold) : business.ratingThreshold;
    if (seoKeywords !== undefined) business.seoKeywords = seoKeywords;

    if (req.file) {
      business.logoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedBusiness = await business.save();
    res.json(updatedBusiness);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete business profile
// @route   DELETE /api/businesses/:id
// @access  Private
const deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!business) {
      res.status(404);
      throw new Error("Business not found or unauthorized");
    }
    res.json({ message: "Business deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment business scan tracker (Public)
// @route   POST /api/businesses/:id/scan
// @access  Public
const trackScan = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    const { device } = req.body;
    const scanCount = business.scans.push({ device: device || "unknown", converted: false });
    const savedBiz = await business.save();
    
    // Get the newly added scan subdocument
    const newScan = savedBiz.scans[scanCount - 1];

    res.json({ 
      message: "Scan tracked successfully", 
      scanId: newScan._id,
      totalScans: savedBiz.scans.length 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark scan as converted (Public)
// @route   PUT /api/businesses/:id/scan/:scanId
// @access  Public
const convertScan = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    const scan = business.scans.id(req.params.scanId);
    if (!scan) {
      res.status(404);
      throw new Error("Scan event not found");
    }

    scan.converted = true;
    await business.save();

    res.json({ message: "Scan marked converted successfully", scan });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public business profile details (No Auth)
// @route   GET /api/businesses/public/:id
// @access  Public
const getPublicBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id).select(
      "name googleReviewUrl yelpReviewUrl primaryColor ratingThreshold logoUrl isActive"
    );
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }
    res.json(business);
  } catch (error) {
    next(error);
  }
};

// generateSeoSuggestions removed in favor of Groq API

// @desc    Get random unused AI suggestions
// @route   GET /api/businesses/public/:id/suggestions
// @access  Public
const getSuggestions = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    const used = business.usedSuggestions || [];
    let allSuggestions = await generateReviews(business.name, business.seoKeywords || [], used);
    
    // Filter out used suggestions
    let available = allSuggestions.filter(s => !used.includes(s));
    
    // If all generated were used (unlikely with LLM, but possible), just use them anyway to ensure we return 3
    if (available.length < 3) {
      available = allSuggestions;
    }

    res.json(available.slice(0, 3));
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a suggestion as used
// @route   PUT /api/businesses/public/:id/suggestions/mark-used
// @access  Public
const markSuggestionUsed = async (req, res, next) => {
  try {
    const { suggestion } = req.body;
    if (!suggestion) {
      res.status(400);
      throw new Error("Suggestion text required");
    }

    const business = await Business.findById(req.params.id);
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    if (!business.usedSuggestions.includes(suggestion)) {
      business.usedSuggestions.push(suggestion);
      await business.save();
    }

    res.json({ message: "Suggestion marked as used" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all businesses (Admin only)
// @route   GET /api/businesses/admin/all
// @access  Private/Admin
const getAllBusinessesAdmin = async (req, res, next) => {
  try {
    const businesses = await Business.find({}).populate("userId", "name email companyName");
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any business profile (Admin only)
// @route   DELETE /api/businesses/admin/:id
// @access  Private/Admin
const deleteBusinessAdmin = async (req, res, next) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      res.status(404);
      throw new Error("Business location not found");
    }
    res.json({ message: "Business deleted successfully by Administrator" });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle business status (admin only)
// @route   PUT /api/businesses/:id/status
// @access  Private/Admin
const toggleBusinessStatusAdmin = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    business.isActive = !business.isActive;
    await business.save();

    res.json(business);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate batch of AI reviews for the dashboard
// @route   POST /api/businesses/generate-batch
// @access  Private (Dashboard)
const generateBatch = async (req, res, next) => {
  try {
    const { config } = req.body;
    if (!config) {
      res.status(400);
      throw new Error("Configuration is required");
    }

    const reviews = await generateBatchReviews(config);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  trackScan,
  convertScan,
  getPublicBusiness,
  getAllBusinessesAdmin,
  deleteBusinessAdmin,
  toggleBusinessStatusAdmin,
  getSuggestions,
  markSuggestionUsed,
  generateBatch,
};
