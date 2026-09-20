const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===== Check karo user logged in hai (valid token hai) =====
const protect = async (req, res, next) => {
  let token;

  // Token "Authorization" header mein aata hai, format: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // "Bearer xyz123" mein se sirf "xyz123" nikaalo
      token = req.headers.authorization.split(" ")[1];

      // Token verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ko database se lao (password chhod ke) aur request mein attach karo
      req.user = await User.findById(decoded.id).select("-password");

      next(); // sab sahi hai, aage badho
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

// ===== Check karo user "admin" hai =====
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied, admin only",
    });
  }
};


// ===== Check karo user "admin" ya "recruiter" hai (dono company create kar sakte hain) =====
const adminOrRecruiter = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "recruiter")) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied, admin or recruiter only",
    });
  }
};

module.exports = { protect, adminOnly, adminOrRecruiter };