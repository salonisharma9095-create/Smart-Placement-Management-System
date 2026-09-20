const express = require("express");
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  updateApprovalStatus,
} = require("../controllers/companyController");
const { protect, adminOnly, adminOrRecruiter } = require("../middleware/authMiddleware");

// ===== Logged-in users dekh sakte hain (role ke hisaab se filtered) =====
router.get("/", protect, getCompanies);
router.get("/:id", protect, getCompanyById);

// ===== Admin ya Recruiter create kar sakte hain =====
router.post("/", protect, adminOrRecruiter, createCompany);
router.put("/:id", protect, adminOrRecruiter, updateCompany);
router.delete("/:id", protect, adminOrRecruiter, deleteCompany);

// ===== Sirf Admin approve/reject kar sakta hai =====
router.put("/:id/approve", protect, adminOnly, updateApprovalStatus);

module.exports = router;