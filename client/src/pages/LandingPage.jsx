import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";

const LandingPage = () => {
    const { user, loading } = useAuth();

    // ===== Agar already logged in hai, to seedha apne dashboard bhej do =====
    if (!loading && user) {
        const redirectPath =
            user.role === "admin"
                ? "/admin"
                : user.role === "recruiter"
                    ? "/recruiter/dashboard"
                    : "/dashboard";
        return <Navigate to={redirectPath} />;
    }

    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="landing-logo">🎓 Smart Placement Portal</div>
                <div className="landing-nav-buttons">
                    <Link to="/login" className="nav-btn nav-btn-outline">
                        Login
                    </Link>
                    <Link to="/register" className="nav-btn nav-btn-filled">
                        Register
                    </Link>
                </div>
            </nav>

            <section className="landing-hero">
                <h1>
                    Your Placement Journey, <span>Simplified</span>
                </h1>
                <p>
                    Browse eligible companies, apply in one click, and track every application —
                    all in one place built for students and placement coordinators.
                </p>
                <div className="hero-cta">
                    <Link to="/register" className="cta-btn cta-primary">
                        Get Started
                    </Link>
                    <Link to="/login" className="cta-btn cta-secondary">
                        I already have an account
                    </Link>
                </div>

                <p style={{ marginTop: "24px", fontSize: "20px", color: "#cbd5e1" }}>
                    Hiring? <Link to="/register/recruiter" style={{ color: "#93c5fd", fontWeight: 700, textDecoration: "underline" }}>Post jobs as a Recruiter</Link>
                </p>
            </section>

            <section className="landing-features">
                <div className="feature-box">
                    <div className="feature-icon">🎯</div>
                    <h3>Smart Eligibility Check</h3>
                    <p>Automatically see which companies you qualify for based on your CGPA and branch.</p>
                </div>
                <div className="feature-box">
                    <div className="feature-icon">⚡</div>
                    <h3>One-Click Apply</h3>
                    <p>Apply to companies instantly and track your status from Applied to Selected.</p>
                </div>
                <div className="feature-box">
                    <div className="feature-icon">📊</div>
                    <h3>Readiness Score</h3>
                    <p>Get a real-time score showing how complete and placement-ready your profile is.</p>
                </div>
                <div className="feature-box">
                    <div className="feature-icon">🏢</div>
                    <h3>Admin Dashboard</h3>
                    <p>Placement coordinators can manage companies and applications from one panel.</p>
                </div>
            </section>

            <footer className="landing-footer">
                © 2026 Smart Placement Management System. Built for college placements.
            </footer>
        </div>
    );
};

export default LandingPage;