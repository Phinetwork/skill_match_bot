import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Button, Grid, Card, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import "@fontsource/roboto"; // Import Roboto font
import "./Dashboard.css"; // Import the custom CSS for the dashboard

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();
      if (isTokenExpired) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      fetchDashboardData(token);
    } catch (err) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const barChartData = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Monthly Revenue",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: userData?.monthlyRevenue || [0, 0, 0, 0], // Ensure data fallback
      },
    ],
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>
      {userData ? (
        <Typography variant="h5" align="center">
          Welcome, {userData.username || "User"}!
        </Typography>
      ) : (
        <Typography variant="h5" align="center">
          Welcome to your Dashboard!
        </Typography>
      )}

      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="card">
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{userData?.totalUsers || "N/A"}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="card">
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">{userData?.activeUsers || "N/A"}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="card">
            <Typography variant="h6">Monthly Revenue</Typography>
            <Typography variant="h4">{userData?.monthlyRevenueTotal || "N/A"}</Typography>
          </Card>
        </Grid>
      </Grid>

      <div className="chart-container">
        <Typography variant="h6" align="center" gutterBottom>
          Monthly Revenue Trend
        </Typography>
        <Bar data={barChartData} />
      </div>

      <div className="logout-button">
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
