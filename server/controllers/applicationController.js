const Application = require("../models/Application");
const Company = require("../models/Company");

// @desc    Apply to a company
// @route   POST /api/applications
const applyToCompany = async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    // ===== Check karo company exist karti hai =====
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ===== Check karo deadline nikal to nahi gayi =====
    if (new Date(company.applicationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // ===== Application create karo =====
    const application = await Application.create({
      student: req.user._id,
      company: companyId,
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (error) {
    // ===== Duplicate application error handle karo =====
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this company",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get logged-in student's applications
// @route   GET /api/applications/my
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("company", "name jobRole package location applicationDeadline")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email branch cgpa")
      .populate("company", "name jobRole package")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update application status (Admin only)
// @route   PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Applied", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  applyToCompany,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};