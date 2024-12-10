import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
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
      setUser(data);
    } catch (error) {
      console.error("Error during token validation:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("authToken", token);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error(`Login failed with status ${res.status}: ${res.statusText}`);
        throw new Error("Failed to fetch user info");
      }
      const userData = await res.json();
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
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
