const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, branch, cgpa, graduationYear, skills } = req.body;

    // ===== Step 1: Zaroori fields check karo =====
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    // ===== Step 2: Check karo email already exist to nahi karta =====
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // ===== Step 3: Naya user banao =====
    const user = await User.create({
      name,
      email,
      password, // pre-save hook isko automatically hash kar dega
      role: role || "student",
      branch,
      cgpa,
      graduationYear,
      skills,
    });

    // ===== Step 4: Response bhejo with token =====
    if (user) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===== Step 1: Email/password diya hai ya nahi check karo =====
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ===== Step 2: User ko email se dhoondo =====
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ===== Step 3: Password match karo =====
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ===== Step 4: Sab sahi hai, token bhejo =====
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = { registerUser, loginUser };

