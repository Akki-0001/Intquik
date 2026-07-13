const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getQRConfig,
  saveQRConfig,
  generateQRCodeImage,
  scanQRCode,
} = require("../controllers/qr.controller");

const router = express.Router();

// Public route to generate actual QR image
router.get("/:businessId/image", generateQRCodeImage);
router.get("/:businessId/scan", scanQRCode);

// Protected routes
router.use(protect);
router.get("/:businessId", getQRConfig);
router.post("/:businessId", saveQRConfig);

module.exports = router;
