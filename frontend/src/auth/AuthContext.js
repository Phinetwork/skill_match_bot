import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize and validate token on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false); // Stop loading if no token is present
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn(`Token validation failed with status ${res.status}: ${res.statusText}`);
        throw new Error("Invalid token");
      }
      const data = await res.json();
      setUser(data); // Update user state with validated user data
    } catch (error) {
      console.error("Token validation failed:", error);
      logout(); // Logout on invalid token
    } finally {
      setLoading(false); // Stop loading after validation
    }
  };

  const login = async (token) => {
    localStorage.setItem("authToken", token); // Store token in localStorage
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error(`Login validation failed with status ${res.status}: ${res.statusText}`);
        throw new Error("Failed to fetch user info");
      }
      const userData = await res.json();
      setUser(userData); // Update user state with fetched data
      navigate("/dashboard"); // Navigate to dashboard on successful login
    } catch (error) {
      console.error("Login failed:", error);
      logout(); // Clear token and navigate to login on failure
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    setUser(null); // Clear user state
    navigate("/login"); // Navigate to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children} {/* Render children only after loading is complete */}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, AuthContext, useAuth };
