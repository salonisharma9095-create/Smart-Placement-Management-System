import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getMyApplications } from "../services/api";
import "../styles/companies.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getMyApplications();
      setApplications(response.data.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Status ke naam mein space hai, CSS class ke liye dash use karenge =====
  const statusClass = (status) => `status-badge status-${status.replace(/\s+/g, "-")}`;

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="loading-text">Loading applications...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="companies-page">
        <div className="companies-header">
          <h1>My Applications ({applications.length})</h1>
        </div>

        {applications.length === 0 ? (
          <div className="no-results">
            You haven't applied to any companies yet. Go to "Browse Companies" to get started!
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <div className="application-item" key={app._id}>
                <div className="application-info">
                  <h3>{app.company.name}</h3>
                  <p>
                    {app.company.jobRole} • ₹{app.company.package} LPA • {app.company.location}
                  </p>
                  <p>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={statusClass(app.status)}>{app.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyApplications;