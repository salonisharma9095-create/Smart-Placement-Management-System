import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "../services/api";
import { useAuth } from "../context/AuthContext";
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

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [postings, setPostings] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostings();
  }, []);

  const fetchPostings = async () => {
    try {
      // ===== Backend automatically sirf isी recruiter ki postings dega =====
      const response = await getCompanies();
      setPostings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch postings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name || user.companyName, // agar khali chhoड़ा to profile wala company name use ho
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
        alert("Job posted! It will be visible to students after admin approval.");
      }

      setFormData(emptyForm);
      setEditingId(null);
      fetchPostings();
    } catch (error) {
      console.error("Failed to save posting:", error);
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
    if (!window.confirm("Are you sure you want to delete this posting?")) return;
    try {
      await deleteCompany(id);
      fetchPostings();
    } catch (error) {
      console.error("Failed to delete posting:", error);
    }
  };

  const handleCancelEdit = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const statusBadgeClass = (status) => {
    if (status === "approved") return "posting-status-badge status-approved-badge";
    if (status === "rejected") return "posting-status-badge status-rejected-badge";
    return "posting-status-badge status-pending-badge";
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        {/* ===== Recruiter Info ===== */}
        <div className="admin-section">
          <h2>Welcome, {user?.companyName || user?.name}</h2>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            {user?.name} • {user?.designation || "Recruiter"}
          </p>
        </div>

        {/* ===== Post New Job Form ===== */}
        <div className="admin-section">
          <h2>{editingId ? "Edit Job Posting" : "Post a New Job"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group-admin">
                <label>Company Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={user?.companyName || "Your company name"}
                />
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
              {editingId ? "Update Posting" : "Post Job"}
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

        {/* ===== My Postings List ===== */}
        <div className="admin-section">
          <h2>My Job Postings ({postings.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : postings.length === 0 ? (
            <p>You haven't posted any jobs yet.</p>
          ) : (
            postings.map((company) => (
              <div className="company-row" key={company._id}>
                <div className="company-row-info">
                  <strong>{company.name}</strong> — {company.jobRole}{" "}
                  <span className={statusBadgeClass(company.status)}>{company.status}</span>
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
      </div>
    </>
  );
};

export default RecruiterDashboard;