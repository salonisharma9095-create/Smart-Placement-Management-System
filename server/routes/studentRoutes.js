const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, uploadResume } = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ===== "resume" field name se aane wali single file accept karo =====
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;