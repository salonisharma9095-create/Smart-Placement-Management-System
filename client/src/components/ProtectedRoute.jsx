import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // ===== Login hi nahi hai =====
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ===== Login hai, lekin galat role se galat page access kar raha hai =====
  if (allowedRole && user.role !== allowedRole) {
    // Student ko uske dashboard bhej do, Admin ko uske panel
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />;
  }

  return children;
};

export default ProtectedRoute;