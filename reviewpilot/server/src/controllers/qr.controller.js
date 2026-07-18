const QRConfig = require("../models/qr.model");
const Business = require("../models/business.model");
const QRCode = require("qrcode");

// @desc    Get QR Config for a business
// @route   GET /api/qr/:businessId
// @access  Private
const getQRConfig = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.businessId, userId: req.user._id });
    if (!business) {
      res.status(404);
      throw new Error("Business not found or unauthorized");
    }

    let qrConfig = await QRConfig.findOne({ businessId: req.params.businessId });
    if (!qrConfig) {
      qrConfig = await QRConfig.create({
        businessId: req.params.businessId,
        fgColor: business.primaryColor || "#0D9488",
      });
    }

    res.json(qrConfig);
  } catch (error) {
    next(error);
  }
};

// @desc    Upsert QR Config for a business
// @route   POST /api/qr/:businessId
// @access  Private
const saveQRConfig = async (req, res, next) => {
  try {
    const business = await Business.findOne({ _id: req.params.businessId, userId: req.user._id });
    if (!business) {
      res.status(404);
      throw new Error("Business not found or unauthorized");
    }

    const { fgColor, bgColor, dotStyle, centerIcon, tagline, offerText } = req.body;

    let qrConfig = await QRConfig.findOne({ businessId: req.params.businessId });
    if (qrConfig) {
      qrConfig.fgColor = fgColor !== undefined ? fgColor : qrConfig.fgColor;
      qrConfig.bgColor = bgColor !== undefined ? bgColor : qrConfig.bgColor;
      qrConfig.dotStyle = dotStyle !== undefined ? dotStyle : qrConfig.dotStyle;
      qrConfig.centerIcon = centerIcon !== undefined ? centerIcon : qrConfig.centerIcon;
      qrConfig.tagline = tagline !== undefined ? tagline : qrConfig.tagline;
      qrConfig.offerText = offerText !== undefined ? offerText : qrConfig.offerText;
      await qrConfig.save();
    } else {
      qrConfig = await QRConfig.create({
        businessId: req.params.businessId,
        fgColor,
        bgColor,
        dotStyle,
        centerIcon,
        tagline,
        offerText,
      });
    }

    res.json(qrConfig);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate QR Code SVG/Image (Public)
// @route   GET /api/qr/:businessId/image
// @access  Public
const generateQRCodeImage = async (req, res, next) => {
  try {
    const businessId = req.params.businessId;
    const business = await Business.findById(businessId);
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    const qrConfig = await QRConfig.findOne({ businessId });
    const fg = qrConfig ? qrConfig.fgColor : "#0d9488";
    const bg = qrConfig ? qrConfig.bgColor : "#ffffff";

    const frontendUrl = process.env.FRONTEND_URL || "https://intquik-amr2.vercel.app";
    const scanUrl = `${frontendUrl}/review/${businessId}`;

    const svgString = await QRCode.toString(scanUrl, {
      type: "svg",
      color: {
        dark: fg,
        light: bg,
      },
      width: 300,
      margin: 1,
    });

    res.type("image/svg+xml");
    res.send(svgString);
  } catch (error) {
    next(error);
  }
};

// @desc    Track QR scan and redirect to review page
// @route   GET /api/qr/:businessId/scan
// @access  Public
const scanQRCode = async (req, res, next) => {
  try {
    const businessId = req.params.businessId;
    const business = await Business.findById(businessId);
    
    if (!business) {
      res.status(404);
      throw new Error("Business not found");
    }

    // Increment scan counter
    await QRConfig.findOneAndUpdate(
      { businessId },
      { $inc: { scans: 1 } },
      { upsert: true }
    );

    // Redirect to frontend review page
    const frontendUrl = process.env.FRONTEND_URL || "https://intquik-amr2.vercel.app";
    res.redirect(`${frontendUrl}/review/${businessId}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQRConfig,
  saveQRConfig,
  generateQRCodeImage,
  scanQRCode,
};
