const express = require("express");
const router = express.Router();
const {
  applyToCompany,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ===== Student routes =====
router.post("/", protect, applyToCompany);
router.get("/my", protect, getMyApplications);

// ===== Admin routes =====
router.get("/", protect, adminOnly, getAllApplications);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

module.exports = router;