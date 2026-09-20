import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-title">🎓 Smart Placement Portal</div>
            <div className="navbar-user">
                {user?.role === "admin" && (
                    <Link to="/admin" style={{ color: "white", fontWeight: 600 }}>
                        Admin Panel
                    </Link>
                )}
                {user?.role === "student" && (
                    <>
                        <Link to="/dashboard" style={{ color: "white", fontWeight: 600 }}>
                            My Profile
                        </Link>
                        <Link to="/companies" style={{ color: "white", fontWeight: 600 }}>
                            Browse Companies
                        </Link>
                        <Link to="/my-applications" style={{ color: "white", fontWeight: 600 }}>
                            My Applications
                        </Link>
                    </>
                )}
                {user?.role === "recruiter" && (
  <Link to="/recruiter/dashboard" style={{ color: "white", fontWeight: 600 }}>
    My Postings
  </Link>
)}
                <span>Hi, {user?.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;