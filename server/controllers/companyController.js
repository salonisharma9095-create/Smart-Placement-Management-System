const Company = require("../models/Company");

// @desc    Create a new company (Admin creates as approved, Recruiter creates as pending)
// @route   POST /api/companies
const createCompany = async (req, res) => {
  try {
    // ===== Admin ki company turant "approved" hoti hai, recruiter ki "pending" =====
    const status = req.user.role === "admin" ? "approved" : "pending";

    const company = await Company.create({
      ...req.body,
      createdBy: req.user._id,
      status,
    });

    res.status(201).json({
      success: true,
      message:
        req.user.role === "admin"
          ? "Company added successfully"
          : "Job posted! It will be visible after admin approval.",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all companies (students see only approved, admin sees all, recruiter sees own)
// @route   GET /api/companies
const getCompanies = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "student") {
      filter.status = "approved"; // students ko sirf approved dikhe
    } else if (req.user.role === "recruiter") {
      filter.createdBy = req.user._id; // recruiter ko sirf apni postings dikhe
    }
    // admin ko sab dikhega (empty filter)

    const companies = await Company.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get single company by ID
// @route   GET /api/companies/:id
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update company (Admin or Recruiter)
// @route   PUT /api/companies/:id
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // updated document wapas do, purana nahi
      runValidators: true, // schema validation dobara chalao
    });

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete company (Admin or Recruiter)
// @route   DELETE /api/companies/:id
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Approve or reject a company posting (Admin only)
// @route   PUT /api/companies/:id/approve
const updateApprovalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'rejected'",
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    company.status = status;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Company ${status} successfully`,
      data: company,
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
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  updateApprovalStatus,
};