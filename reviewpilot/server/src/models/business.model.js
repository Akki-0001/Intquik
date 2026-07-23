const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    googleReviewUrl: {
      type: String,
      required: [true, "Google Review URL is required"],
      trim: true,
    },
    yelpReviewUrl: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    primaryColor: {
      type: String,
      default: "#0D9488", // Teal
    },
    ratingThreshold: {
      type: Number,
      default: 4,
      min: 1,
      max: 5,
    },
    seoKeywords: [
      {
        type: String,
        trim: true
      }
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    scans: [
      {
        device: {
          type: String,
          enum: ["mobile", "tablet", "desktop", "unknown"],
          default: "unknown",
        },
        converted: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Google My Business Integration
    googleAccessToken: {
      type: String,
    },
    googleRefreshToken: {
      type: String,
    },
    googleTokenExpiry: {
      type: Number,
    },
    gmbAccountId: {
      type: String,
    },
    gmbLocationId: {
      type: String,
    },
    autoReplyEnabled: {
      type: Boolean,
      default: false,
    },
    usedSuggestions: [
      {
        type: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model("Business", businessSchema);
module.exports = Business;
