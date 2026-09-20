const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"],
      default: "Applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ===== Duplicate application rokne ke liye compound unique index =====
// Ek student, ek company mein sirf ek hi baar apply kar sakta hai
applicationSchema.index({ student: 1, company: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;