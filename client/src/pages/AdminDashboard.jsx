import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getAllApplications,
  updateApplicationStatus,
  updateApprovalStatus,
} from "../services/api";
import "../styles/dashboard.css";
import "../styles/admin.css";

const emptyForm = {
  name: "",
  jobRole: "",
  package: "",
  location: "",
  jobType: "Full-time",
  jobDescription: "",
  applicationDeadline: "",
  minCGPA: "",
  allowedBranches: "",
  requiredSkills: "",
};

const statusOptions = ["Applied", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"];

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
    fetchApplications();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await getAllApplications();
      setApplications(response.data.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

    // ===== Approve ya Reject karo pending company ko =====
  const handleApproval = async (id, status) => {
    try {
      await updateApprovalStatus(id, status);
      fetchCompanies(); // list refresh karo
    } catch (error) {
      console.error("Failed to update approval status:", error);
      alert("Failed to update status");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      jobRole: formData.jobRole,
      package: Number(formData.package),
      location: formData.location,
      jobType: formData.jobType,
      jobDescription: formData.jobDescription,
      applicationDeadline: formData.applicationDeadline,
      eligibility: {
        minCGPA: Number(formData.minCGPA) || 0,
        allowedBranches: formData.allowedBranches
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
        maxBacklogs: 0,
      },
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateCompany(editingId, payload);
      } else {
        await createCompany(payload);
      }

      setFormData(emptyForm);
      setEditingId(null);
      fetchCompanies();
    } catch (error) {
      console.error("Failed to save company:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (company) => {
    setFormData({
      name: company.name,
      jobRole: company.jobRole,
      package: company.package,
      location: company.location,
      jobType: company.jobType,
      jobDescription: company.jobDescription,
      applicationDeadline: company.applicationDeadline?.split("T")[0] || "",
      minCGPA: company.eligibility?.minCGPA || "",
      allowedBranches: company.eligibility?.allowedBranches?.join(", ") || "",
      requiredSkills: company.requiredSkills?.join(", ") || "",
    });
    setEditingId(company._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await deleteCompany(id);
      fetchCompanies();
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  const handleCancelEdit = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  // ===== Status dropdown change hote hi turant backend update karo =====
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      // ===== Local state bhi update karo, taaki turant UI mein reflect ho =====
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  // ===== Stats calculate karo =====
  const totalStudentsApplied = new Set(applications.map((a) => a.student?._id)).size;
  const totalSelected = applications.filter((a) => a.status === "Selected").length;

  return (
    <>
      <Navbar />
      <div className="admin-container">
        {/* ===== Stats ===== */}
        <div className="admin-stats-grid">
          <div className="admin-stat-box">
            <div className="admin-stat-number">{companies.length}</div>
            <div className="admin-stat-label">Total Companies</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-number">{applications.length}</div>
            <div className="admin-stat-label">Total Applications</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-number">{totalStudentsApplied}</div>
            <div className="admin-stat-label">Students Applied</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-number">{totalSelected}</div>
            <div className="admin-stat-label">Total Selected</div>
          </div>
        </div>

        {/* ===== Add/Edit Company Form ===== */}
        <div className="admin-section">
          <h2>{editingId ? "Edit Company" : "Add New Company"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group-admin">
                <label>Company Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group-admin">
                <label>Job Role</label>
                <input name="jobRole" value={formData.jobRole} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-admin">
                <label>Package (LPA)</label>
                <input
                  type="number"
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-admin">
                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-admin">
                <label>Job Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="form-group-admin">
                <label>Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group-admin">
                <label>Job Description</label>
                <textarea
                  name="jobDescription"
                  rows="3"
                  value={formData.jobDescription}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-admin">
                <label>Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  name="minCGPA"
                  value={formData.minCGPA}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-admin">
                <label>Allowed Branches (comma-separated)</label>
                <input
                  name="allowedBranches"
                  placeholder="CSE, IT, ECE"
                  value={formData.allowedBranches}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group-admin">
                <label>Required Skills (comma-separated)</label>
                <input
                  name="requiredSkills"
                  placeholder="JavaScript, React, Node.js"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              {editingId ? "Update Company" : "Add Company"}
            </button>
            {editingId && (
              <button
                type="button"
                className="submit-btn"
                style={{ background: "#999", marginLeft: "10px" }}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

                {/* ===== Pending Approvals ===== */}
        <div className="admin-section">
          <h2>
            Pending Approvals (
            {companies.filter((c) => c.status === "pending").length})
          </h2>
          {companies.filter((c) => c.status === "pending").length === 0 ? (
            <p>No pending job postings to review.</p>
          ) : (
            companies
              .filter((c) => c.status === "pending")
              .map((company) => (
                <div className="approval-row" key={company._id}>
                  <div className="company-row-info">
                    <strong>{company.name}</strong> — {company.jobRole}
                    <span>
                      ₹{company.package} LPA | {company.location} | Posted by recruiter
                    </span>
                  </div>
                  <div className="approval-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApproval(company._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleApproval(company._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* ===== Companies List ===== */}
        <div className="admin-section">
          <h2>All Companies ({companies.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : companies.length === 0 ? (
            <p>No companies added yet.</p>
          ) : (
            companies.map((company) => (
              <div className="company-row" key={company._id}>
                <div className="company-row-info">
                  <strong>{company.name}</strong> — {company.jobRole}
                  <span>
                    ₹{company.package} LPA | {company.location} | Deadline:{" "}
                    {new Date(company.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="company-row-actions">
                  <button className="btn-edit" onClick={() => handleEdit(company)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(company._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ===== Applications Management ===== */}
        <div className="admin-section">
          <h2>All Applications ({applications.length})</h2>
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Branch / CGPA</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      {app.student?.name}
                      <br />
                      <small>{app.student?.email}</small>
                    </td>
                    <td>
                      {app.student?.branch} / {app.student?.cgpa}
                    </td>
                    <td>{app.company?.name}</td>
                    <td>{app.company?.jobRole}</td>
                    <td>
                      <select
                        className="status-dropdown"
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;