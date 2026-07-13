const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      unique: true,
    },
    fgColor: {
      type: String,
      default: "#0D9488",
    },
    bgColor: {
      type: String,
      default: "#FFFFFF",
    },
    dotStyle: {
      type: String,
      enum: ["square", "rounded", "dots"],
      default: "rounded",
    },
    centerIcon: {
      type: String,
      enum: ["none", "star", "coffee", "heart", "health"],
      default: "star",
    },
    tagline: {
      type: String,
      default: "Scan to Review Us!",
    },
    offerText: {
      type: String,
      default: "Help our local business grow",
    },
    scans: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const QRConfig = mongoose.model("QRConfig", qrSchema);
module.exports = QRConfig;
