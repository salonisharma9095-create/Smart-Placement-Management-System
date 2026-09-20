const User = require("../models/User");

// @desc    Get logged-in student's profile
// @route   GET /api/students/profile
const getProfile = async (req, res) => {
  try {
    // req.user already middleware ne attach kar diya hai (password ke bina)
    const student = await User.findById(req.user._id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update logged-in student's profile
// @route   PUT /api/students/profile
const updateProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ===== Sirf jo fields bheje hain, unhi ko update karo =====
    student.name = req.body.name || student.name;
    student.branch = req.body.branch || student.branch;
    student.cgpa = req.body.cgpa ?? student.cgpa;
    student.graduationYear = req.body.graduationYear || student.graduationYear;
    student.skills = req.body.skills || student.skills;
    student.phone = req.body.phone || student.phone;

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: updatedStudent._id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        branch: updatedStudent.branch,
        cgpa: updatedStudent.cgpa,
        graduationYear: updatedStudent.graduationYear,
        skills: updatedStudent.skills,
        phone: updatedStudent.phone,
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

// @desc    Upload resume
// @route   POST /api/students/upload-resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const student = await User.findById(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ===== File ka path save karo database mein =====
    student.resumeUrl = `/uploads/${req.file.filename}`;
    await student.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: {
        resumeUrl: student.resumeUrl,
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

module.exports = { getProfile, updateProfile ,uploadResume };