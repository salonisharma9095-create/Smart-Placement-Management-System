import { createContext, useState, useContext, useEffect } from "react";

// ===== Context banao =====
const AuthContext = createContext();

// ===== Provider component — poore app ko wrap karega =====
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== App load hote hi check karo localStorage mein user save hai ya nahi =====
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ===== Login/Register success hone par ye call karenge =====
  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ===== Logout karne ke liye =====
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== Custom hook — components mein aasani se use karne ke liye =====
export const useAuth = () => useContext(AuthContext);