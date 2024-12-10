import React, { useEffect, useState } from "react";
import axios from "axios";
import { decode as jwtDecode } from "jwt-decode"; // Correct import for jwt-decode@4.x.x
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // State for storing user data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
      return;
    }

    try {
      jwtDecode(token); // Decode the token to verify its structure
      fetchDashboardData(); // Fetch user-specific dashboard data
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token"); // Clear invalid token
      navigate("/login");
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard`, // Use dynamic backend URL
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserData(response.data); // Update user data
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      localStorage.removeItem("token"); // Clear token if fetching fails
      navigate("/login"); // Redirect to login
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <div>
          <h2>Welcome, {userData.username}</h2>
          <p>Your email: {userData.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Error loading dashboard data. Please try logging in again.</p>
      )}
    </div>
  );
};

export default Dashboard;
