import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode"; // Correct import for jwt-decode
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2"; // Assuming you use Chart.js for charts

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // User data from the backend
  const [chartData, setChartData] = useState([]); // Data for the charts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message
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
        console.error("Token expired");
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }
      fetchDashboardData(token);
      fetchChartData(token);
    } catch (err) {
      console.error("Invalid token:", err);
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
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chart-data`, // Adjust to your chart data endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChartData(response.data || []);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setChartData([]); // Fallback to empty data
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const generatePlaceholderChartData = () => {
    // Generate placeholder data with zeros
    return {
      labels: ["Skill 1", "Skill 2", "Skill 3"],
      datasets: [
        {
          label: "Progress",
          data: [0, 0, 0],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <div>
          <h2>Welcome, {userData.username}</h2>
          <p>Your email: {userData.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      {/* Charts Section */}
      <div style={{ marginTop: "20px" }}>
        <h2>Your Progress</h2>
        {chartData.length > 0 ? (
          <Bar
            data={{
              labels: chartData.map((item) => item.name),
              datasets: [
                {
                  label: "Skill Progress",
                  data: chartData.map((item) => item.progress),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
            options={chartOptions}
          />
        ) : (
          <Bar data={generatePlaceholderChartData()} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
