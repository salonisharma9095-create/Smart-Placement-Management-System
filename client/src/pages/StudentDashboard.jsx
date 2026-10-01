import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile, getMyApplications, uploadResume } from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import { calculateReadinessScore } from "../utils/readinessScore";

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ total: 0, shortlisted: 0, interview: 0, selected: 0 });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resumeMessage, setResumeMessage] = useState({ text: "", type: "" });
    const [skillsInput, setSkillsInput] = useState("");

    const { score, breakdown } = calculateReadinessScore(profile);

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getMyProfile();
            setProfile(response.data.data);
            setFormData(response.data.data);
            setSkillsInput((response.data.data.skills || []).join(", "));
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getMyApplications();
            const applications = response.data.data;

            setStats({
                total: applications.length,
                shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
                interview: applications.filter((a) => a.status === "Interview Scheduled").length,
                selected: applications.filter((a) => a.status === "Selected").length,
            });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const skillsArray = skillsInput
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            const response = await updateMyProfile({ ...formData, skills: skillsArray });
            setProfile(response.data.data);
            setSkillsInput((response.data.data.skills || []).join(", "));
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type !== "application/pdf") {
            setResumeMessage({ text: "Only PDF files are allowed", type: "error" });
            setResumeFile(null);
            return;
        }

        setResumeFile(file);
        setResumeMessage({ text: "", type: "" });
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setResumeMessage({ text: "Please select a PDF file first", type: "error" });
            return;
        }

        setUploading(true);
        setResumeMessage({ text: "", type: "" });

        const formDataToSend = new FormData();
        formDataToSend.append("resume", resumeFile);

        try {
            const response = await uploadResume(formDataToSend);
            setProfile({ ...profile, resumeUrl: response.data.data.resumeUrl });
            setResumeMessage({ text: "Resume uploaded successfully!", type: "success" });
            setResumeFile(null);
        } catch (error) {
            setResumeMessage({
                text: error.response?.data?.message || "Upload failed. Try again.",
                type: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <p className="loading-text">Loading profile...</p>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="stats-grid">
                    <div className="stat-box total">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Total Applications</div>
                    </div>
                    <div className="stat-box shortlisted">
                        <div className="stat-number">{stats.shortlisted}</div>
                        <div className="stat-label">Shortlisted</div>
                    </div>
                    <div className="stat-box interview">
                        <div className="stat-number">{stats.interview}</div>
                        <div className="stat-label">Interviews</div>
                    </div>
                    <div className="stat-box selected">
                        <div className="stat-number">{stats.selected}</div>
                        <div className="stat-label">Selected</div>
                    </div>
                </div>

                <div className="readiness-card">
                    <div className="readiness-header">
                        <h2>Placement Readiness Score</h2>
                        <span
                            className={`readiness-score-text ${score >= 70 ? "score-good" : score >= 40 ? "score-medium" : "score-low"
                                }`}
                        >
                            {score}/100
                        </span>
                    </div>

                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${score}%`,
                                background: score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626",
                            }}
                        ></div>
                    </div>

                    <div className="readiness-checklist">
                        {breakdown.map((item, i) => (
                            <div className="checklist-item" key={i}>
                                <span className={`checklist-icon ${item.done ? "checklist-done" : "checklist-pending"}`}>
                                    {item.done ? "✓" : "○"}
                                </span>
                                <span className={item.done ? "checklist-text-done" : "checklist-text-pending"}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="profile-card">
                    <div className="profile-header">
                        <h2>My Profile</h2>
                        {!isEditing && (
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="profile-grid">
                        <div className="profile-field">
                            <label>Name</label>
                            {isEditing ? (
                                <input name="name" value={formData.name || ""} onChange={handleChange} />
                            ) : (
                                <p>{profile.name}</p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label>Email</label>
                            <p>{profile.email}</p>
                        </div>

                        <div className="profile-field">
                            <label>Branch</label>
                            {isEditing ? (
                                <input name="branch" value={formData.branch || ""} onChange={handleChange} />
                            ) : (
                                <p>{profile.branch || "Not set"}</p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label>CGPA</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    step="0.1"
                                    name="cgpa"
                                    value={formData.cgpa || ""}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p>{profile.cgpa || "Not set"}</p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label>Graduation Year</label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={formData.graduationYear || ""}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p>{profile.graduationYear || "Not set"}</p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label>Phone</label>
                            {isEditing ? (
                                <input name="phone" value={formData.phone || ""} onChange={handleChange} />
                            ) : (
                                <p>{profile.phone || "Not set"}</p>
                            )}
                        </div>
                        <div className="profile-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Skills (comma-separated)</label>
                            {isEditing ? (
                                <input
                                    name="skillsInput"
                                    value={skillsInput}
                                    onChange={(e) => setSkillsInput(e.target.value)}
                                    placeholder="e.g. JavaScript, React, Node.js"
                                />
                            ) : (
                                <p>{profile.skills?.length > 0 ? profile.skills.join(", ") : "Not set"}</p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <button className="save-btn" onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    )}

                    {/* ===== Resume Upload Section ===== */}
                    <div className="resume-section">
                        <h3>Resume</h3>

                        {profile.resumeUrl && (
                            <p style={{ marginBottom: "10px" }}>
                                <a
                                    href={`http://localhost:5000${profile.resumeUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="view-resume-link"
                                >
                                    📄 View Current Resume
                                </a>
                            </p>
                        )}

                        <div className="resume-upload-row">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="resume-file-input"
                            />
                            <button className="upload-resume-btn" onClick={handleResumeUpload} disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload Resume"}
                            </button>
                        </div>

                        {resumeMessage.text && (
                            <p
                                className={`resume-upload-message ${resumeMessage.type === "success" ? "resume-msg-success" : "resume-msg-error"
                                    }`}
                            >
                                {resumeMessage.text}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;