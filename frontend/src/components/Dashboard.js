import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [liveChartData, setLiveChartData] = useState({ labels: [], data: [] });
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

        await Promise.allSettled([
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

    const interval = setInterval(() => {
      updateLiveChartData();
    }, 1000); // Update every second

    return () => clearInterval(interval);
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
      const response = await axios.get("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
      const parsedResponse = JSON.parse(response.data.contents);
      const quoteText = parsedResponse[0]?.q + " - " + parsedResponse[0]?.a;
      setQuote(quoteText);
    } catch (err) {
      console.error("Error fetching motivational quote:", err);
      setQuote("Stay motivated to achieve your goals!");
    }
  };

  const fetchHabits = () => {
    const habitList = [
      "Exercise daily",
      "Read 20 minutes",
      "Write a journal",
      "Practice mindfulness",
      "Learn a new skill",
      "Drink more water",
      "Declutter one area",
      "Plan tomorrow's tasks",
      "Practice gratitude",
      "Stretch for 10 minutes",
      "Limit screen time",
      "Go for a walk",
      "Meditate for 5 minutes",
      "Write a to-do list",
      "Call a friend or family member",
      "Learn a new word",
      "Cook a healthy meal",
      "Practice deep breathing",
      "Spend time in nature",
      "Reflect on your day",
      "Limit caffeine intake",
      "Read a motivational quote",
      "Track your expenses",
      "Organize your workspace",
      "Take a power nap",
      "Smile at a stranger",
      "Do 15 minutes of cardio",
      "Write down a goal",
      "Compliment someone",
      "Focus on a single task",
      "Avoid procrastination",
      "Limit social media",
      "Journal about gratitude",
      "Set a new habit",
      "Break a bad habit",
      "Watch an educational video",
      "Learn a hobby",
      "Spend time with loved ones",
      "Volunteer for a cause",
      "Reflect on your strengths",
      "Set a daily affirmation",
      "Do a random act of kindness",
      "Focus on posture",
      "Set a digital detox day",
      "Drink herbal tea",
      "Write about your dreams",
      "Spend time with a pet",
      "Work on a personal project",
      "Learn a new recipe",
    ];

    const rotateHabits = () => {
      const shuffledHabits = habitList.sort(() => 0.5 - Math.random());
      setHabits(shuffledHabits.slice(0, 3));
    };

    rotateHabits(); // Initial shuffle
    const interval = setInterval(rotateHabits, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
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

  const updateLiveChartData = () => {
    setLiveChartData((prevState) => {
      const now = new Date();
      const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const newData = [...prevState.data, Math.random() * 100];
      const newLabels = [...prevState.labels, timeLabel];

      if (newData.length > 10) {
        newData.shift();
        newLabels.shift();
      }

      return { labels: newLabels, data: newData };
    });
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

      <div className="live-chart-container">
        <h2>Live Data Chart</h2>
        <Line
          data={{
            labels: liveChartData.labels,
            datasets: [
              {
                label: "Live Data",
                data: liveChartData.data,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
            animation: {
              duration: 0,
            },
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Value",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
