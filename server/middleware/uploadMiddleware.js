const multer = require("multer");
const path = require("path");

// ===== Kahan aur kis naam se file save karni hai, ye batate hain =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // saari files "uploads" folder mein jayengi
  },
  filename: (req, file, cb) => {
    // ===== Unique filename banao taaki do students ke same-naam files overwrite na hon =====
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // jaise ".pdf"
    cb(null, `resume-${req.user._id}-${uniqueSuffix}${ext}`);
  },
});

// ===== Sirf PDF files allow karo =====
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;