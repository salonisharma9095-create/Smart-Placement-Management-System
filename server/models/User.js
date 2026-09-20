const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ===== Schema define karo =====
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "admin", "recruiter"],
      default: "student",
    },
    // ---- Student-specific fields ----
    branch: {
      type: String,
      default: "",
    },
    cgpa: {
      type: Number,
      default: 0,
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    skills: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    // ---- Recruiter-specific fields ----
    companyName: {
      type: String,
      default: "",
    },
    companyWebsite: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt apne aap add ho jaayenge
  }
);

// ===== Password ko save hone se pehle hash karo =====
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ===== Login ke waqt password compare karne ka method =====
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;