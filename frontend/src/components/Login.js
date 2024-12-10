import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Redirect to dashboard if already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token } = response.data;

      if (token) {
        login(token); // Update context and state
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Failed to connect to the server.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
