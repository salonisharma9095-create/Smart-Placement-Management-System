import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  // ===== Form ke saare fields ek object mein rakhte hain =====
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== Jab bhi koi input change ho, isko call karte hain =====
  const handleChange = (e) => {
    setFormData({
      ...formData, // purani values rakho
      [e.target.name]: e.target.value, // sirf jo field change hui, use update karo
    });
  };

  // ===== Form submit hone par =====
  const handleSubmit = async (e) => {
    e.preventDefault(); // page reload hone se roko (default browser behavior)
    setError("");
    setLoading(true);

    try {
      const response = await registerUser(formData);

      // token aur user data ko browser mein save karo
      login(response.data.data);

      // register hone ke baad dashboard par bhej do
      navigate("/dashboard");
    } catch (err) {
      // backend se aaya error message dikhao
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Register as a student to get started</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="form-group">
            <label>CGPA</label>
            <input
              type="number"
              step="0.1"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.5"
            />
          </div>

          <div className="form-group">
            <label>Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="e.g. 2026"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;