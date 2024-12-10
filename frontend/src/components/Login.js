import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext"; // Ensure correct path

const Login = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext); // Access AuthContext for login

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        login(response.data.token); // Log the user in via AuthContext
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error messages */}
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
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
