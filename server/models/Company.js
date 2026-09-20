const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    jobRole: {
      type: String,
      required: [true, "Job role is required"],
    },
    package: {
      type: Number, // LPA (Lakhs Per Annum) mein
      required: [true, "Package is required"],
    },
    jobDescription: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Internship"],
      default: "Full-time",
    },
    eligibility: {
      minCGPA: {
        type: Number,
        default: 0,
      },
      allowedBranches: {
        type: [String],
        default: [],
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
        status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;