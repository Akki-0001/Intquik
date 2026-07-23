const express = require("express");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
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
} = require("../controllers/business.controller");

const router = express.Router();

// Public endpoints
router.get("/public/:id", getPublicBusiness);
router.get("/public/:id/suggestions", getSuggestions);
router.put("/public/:id/suggestions/mark-used", markSuggestionUsed);
router.post("/:id/scan", trackScan);
router.put("/:id/scan/:scanId", convertScan);

// Protect all other endpoints
router.use(protect);

router.get("/", getBusinesses);
router.post("/", upload.single("logo"), createBusiness);
router.put("/:id", upload.single("logo"), updateBusiness);
router.delete("/:id", deleteBusiness);

// Admin Database endpoints
router.get("/admin/all", admin, getAllBusinessesAdmin);
router.delete("/admin/:id", admin, deleteBusinessAdmin);
router.put("/admin/:id/status", admin, toggleBusinessStatusAdmin);

module.exports = router;
