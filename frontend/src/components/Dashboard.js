import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [quote, setQuote] = useState("");
  const [habits, setHabits] = useState([]);
  const [educationResources, setEducationResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
          console.warn("Token expired, redirecting to login");
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        await Promise.all([
          fetchDashboardData(token),
          fetchChartData(token),
          fetchQuote(),
          fetchHabits(),
          fetchEducationResources(),
        ]);

        setLoading(false); // Mark loading complete after all fetches finish
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while loading data. Please try again later.");
        setLoading(false); // Mark loading complete even if there’s an error
      }
    };

    fetchAllData();
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
      setUserData({ username: "Guest", email: "guest@example.com" }); // Fallback demo data
    }
  };

  const fetchChartData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chart-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChartData(response.data || []);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setChartData([]); // Fallback to empty chart data
    }
  };

  const fetchQuote = async () => {
    try {
      const response = await axios.get("https://zenquotes.io/api/random");
      const quoteText = response.data[0]?.q + " - " + response.data[0]?.a;
      setQuote(quoteText);
    } catch (err) {
      console.error("Error fetching motivational quote:", err);
      setQuote("Stay motivated to achieve your goals!");
    }
  };

  const fetchHabits = async () => {
    try {
      setHabits(["Exercise daily", "Read 20 minutes", "Write a journal"]); // Fallback habit ideas
    } catch (err) {
      console.error("Error fetching habit ideas:", err);
      setHabits(["Default Habit 1", "Default Habit 2", "Default Habit 3"]);
    }
  };

  const fetchEducationResources = async () => {
    try {
      setEducationResources([
        { name: "FreeCodeCamp", link: "https://www.freecodecamp.org/" },
        { name: "Khan Academy", link: "https://www.khanacademy.org/" },
      ]);
    } catch (err) {
      console.error("Error fetching education resources:", err);
      setEducationResources([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const generatePlaceholderChartData = () => ({
    labels: ["Skill 1", "Skill 2", "Skill 3"],
    datasets: [
      {
        label: "Progress",
        data: [0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {userData && (
        <div className="card">
          <h2>Welcome, {userData.username}</h2>
          <p>Your email: {userData.email}</p>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className="quote-container">
        <h2>Motivational Quote</h2>
        <p>{quote}</p>
      </div>

      <div className="habit-container">
        <h2>Habit Ideas</h2>
        <ul>
          {habits.map((habit, index) => (
            <li key={index}>{habit}</li>
          ))}
        </ul>
      </div>

      <div className="education-container">
        <h2>Education Resources</h2>
        <ul>
          {educationResources.map((resource, index) => (
            <li key={index}>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-container">
        <h2>Your Progress</h2>
        {chartData.length > 0 ? (
          <Bar
            data={{
              labels: chartData.map((item) => item.name || "Unknown Skill"),
              datasets: [
                {
                  label: "Skill Progress",
                  data: chartData.map((item) => item.progress || 0),
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
