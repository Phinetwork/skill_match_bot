import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Bar, Line } from "react-chartjs-2";
import LiveTrendVisualizer from "./LiveTrendVisualizer";
import LiveHeatmap from "./LiveHeatmap";
import AI_DecisionTreeVisualizer from "./DecisionTree";
import PredictiveForecastChart from "./PredictiveForecastChart";
import InteractiveGlobe from "./InteractiveGlobe";
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
  const [selectedHabit, setSelectedHabit] = useState(null);
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

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while loading data. Please try again later.");
        setLoading(false);
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
      setChartData([]);
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
      "Exercise daily", "Read 20 minutes", "Write a journal", "Practice mindfulness",
      "Learn a new skill", "Drink more water", "Declutter one area", "Plan tomorrow's tasks",
      "Practice gratitude", "Stretch for 10 minutes", "Limit screen time", "Go for a walk",
      "Meditate for 5 minutes", "Write a to-do list", "Call a friend or family member",
      "Learn a new word", "Cook a healthy meal", "Practice deep breathing",
      "Spend time in nature", "Reflect on your day", "Limit caffeine intake",
      "Read a motivational quote", "Track your expenses", "Organize your workspace",
      "Take a power nap", "Smile at a stranger", "Do 15 minutes of cardio",
      "Write down a goal", "Compliment someone", "Focus on a single task",
      "Avoid procrastination", "Limit social media", "Journal about gratitude",
      "Set a new habit", "Break a bad habit", "Watch an educational video",
      "Learn a hobby", "Spend time with loved ones", "Volunteer for a cause",
      "Reflect on your strengths", "Set a daily affirmation",
      "Do a random act of kindness", "Focus on posture", "Set a digital detox day",
      "Drink herbal tea", "Write about your dreams", "Spend time with a pet",
      "Work on a personal project", "Learn a new recipe",
    ];

    const generateHabits = () => {
      const shuffledHabits = habitList.sort(() => 0.5 - Math.random());
      setHabits(shuffledHabits.slice(0, 3));
    };

    generateHabits();
  };

  const displayHabitDetails = (habit) => {
    const habitDetails = {
      "Exercise daily": "Improve your physical health and energy levels by exercising daily.",
      "Read 20 minutes": "Expand your knowledge and vocabulary by reading every day.",
      "Write a journal": "Reflect on your thoughts and experiences by keeping a daily journal.",
      "Practice mindfulness": "Cultivate awareness and reduce stress through mindfulness practices.",
      "Learn a new skill": "Develop yourself by learning something new and exciting.",
      "Drink more water": "Stay hydrated to maintain your overall health and energy.",
      "Declutter one area": "Organize your space and clear your mind by decluttering daily.",
      "Plan tomorrow's tasks": "Stay organized and productive by planning your tasks in advance.",
      "Practice gratitude": "Improve your mood and mindset by focusing on things you are grateful for.",
      "Stretch for 10 minutes": "Increase your flexibility and relieve tension with a daily stretch.",
      "Limit screen time": "Protect your eyes and mental health by reducing screen usage.",
      "Go for a walk": "Boost your physical and mental health with a relaxing walk.",
      "Meditate for 5 minutes": "Calm your mind and reduce stress with a short meditation session.",
      "Write a to-do list": "Organize your day and achieve your goals by creating a to-do list.",
      "Call a friend or family member": "Strengthen relationships by connecting with loved ones.",
      "Learn a new word": "Expand your vocabulary by learning a new word every day.",
      "Cook a healthy meal": "Take control of your diet by preparing a nutritious meal.",
      "Practice deep breathing": "Relieve stress and improve focus with deep breathing exercises.",
      "Spend time in nature": "Recharge and gain clarity by spending time outdoors.",
      "Reflect on your day": "Analyze your achievements and challenges by reflecting daily.",
      "Limit caffeine intake": "Improve your sleep and reduce anxiety by moderating caffeine consumption.",
      "Read a motivational quote": "Stay inspired and motivated by reading uplifting quotes.",
      "Track your expenses": "Take control of your finances by monitoring your spending habits.",
      "Organize your workspace": "Increase productivity by keeping your workspace tidy.",
      "Take a power nap": "Boost your energy and focus with a short nap during the day.",
      "Smile at a stranger": "Spread positivity and kindness with a simple smile.",
      "Do 15 minutes of cardio": "Enhance your cardiovascular health with quick daily exercise.",
      "Write down a goal": "Clarify your aspirations and track progress by setting a goal.",
      "Compliment someone": "Brighten someone's day and foster positivity with a genuine compliment.",
      "Focus on a single task": "Increase productivity by concentrating on one task at a time.",
      "Avoid procrastination": "Achieve your goals faster by staying disciplined and proactive.",
      "Limit social media": "Protect your mental health by spending less time on social media.",
      "Journal about gratitude": "Develop a positive mindset by writing about things you are thankful for.",
      "Set a new habit": "Take a step toward self-improvement by establishing a new habit.",
      "Break a bad habit": "Improve your life by identifying and stopping an unhelpful habit.",
      "Watch an educational video": "Learn something new by watching an informative video.",
      "Learn a hobby": "Add joy to your life by picking up a fun and creative hobby.",
      "Spend time with loved ones": "Strengthen bonds by sharing quality time with those who matter.",
      "Volunteer for a cause": "Make a difference by giving your time to a meaningful cause.",
      "Reflect on your strengths": "Build confidence by acknowledging your abilities and achievements.",
      "Set a daily affirmation": "Encourage positivity with empowering statements each day.",
      "Do a random act of kindness": "Brighten someone's day with an unexpected kind gesture.",
      "Focus on posture": "Prevent discomfort and boost confidence by improving your posture.",
      "Set a digital detox day": "Recharge by spending a day away from electronic devices.",
      "Drink herbal tea": "Relax and unwind with a calming cup of herbal tea.",
      "Write about your dreams": "Gain insights and inspire creativity by journaling your dreams.",
      "Spend time with a pet": "Enjoy companionship and reduce stress by spending time with a pet.",
      "Work on a personal project": "Pursue your passion by dedicating time to a personal project.",
      "Learn a new recipe": "Expand your culinary skills by trying out a new recipe.",
    };
  
    return habitDetails[habit] || "Details not available.";
  };  

  const fetchEducationResources = async () => {
    try {
      setEducationResources([
        // Programming & Web Development
        { name: "freeCodeCamp", link: "https://www.freecodecamp.org/", category: "Programming & Web Development" },
        { name: "MDN Web Docs", link: "https://developer.mozilla.org/", category: "Programming & Web Development" },
        { name: "W3Schools", link: "https://www.w3schools.com/", category: "Programming & Web Development" },
        { name: "GeeksforGeeks", link: "https://www.geeksforgeeks.org/", category: "Programming & Web Development" },
        { name: "Codecademy", link: "https://www.codecademy.com/", category: "Programming & Web Development" },
        { name: "The Odin Project", link: "https://www.theodinproject.com/", category: "Programming & Web Development" },

        // Data Science & Machine Learning
        { name: "Kaggle Learn", link: "https://www.kaggle.com/learn", category: "Data Science & Machine Learning" },
        { name: "Fast.ai", link: "https://www.fast.ai/", category: "Data Science & Machine Learning" },
        { name: "DataCamp", link: "https://www.datacamp.com/", category: "Data Science & Machine Learning" },
        { name: "Coursera - Machine Learning by Andrew Ng", link: "https://www.coursera.org/learn/machine-learning", category: "Data Science & Machine Learning" },

        // UI/UX & Design
        { name: "Interaction Design Foundation", link: "https://www.interaction-design.org/", category: "UI/UX & Design" },
        { name: "Figma Learn", link: "https://www.figma.com/resources/learn-design/", category: "UI/UX & Design" },
        { name: "Adobe XD Ideas", link: "https://xd.adobe.com/ideas/", category: "UI/UX & Design" },
        { name: "Canva Design School", link: "https://www.canva.com/learn/", category: "UI/UX & Design" },

        // Mathematics & Sciences
        { name: "Khan Academy (Math & Science)", link: "https://www.khanacademy.org/science", category: "Mathematics & Sciences" },
        { name: "MIT OpenCourseWare", link: "https://ocw.mit.edu/", category: "Mathematics & Sciences" },
        { name: "Brilliant", link: "https://www.brilliant.org/", category: "Mathematics & Sciences" },
        { name: "Wolfram MathWorld", link: "https://mathworld.wolfram.com/", category: "Mathematics & Sciences" },

        // Language Learning
        { name: "Duolingo", link: "https://www.duolingo.com/", category: "Language Learning" },
        { name: "Babbel", link: "https://www.babbel.com/", category: "Language Learning" },
        { name: "LingQ", link: "https://www.lingq.com/", category: "Language Learning" },
        { name: "italki", link: "https://www.italki.com/", category: "Language Learning" },

        // Business & Finance
        { name: "edX Business Courses", link: "https://www.edx.org/learn/business", category: "Business & Finance" },
        { name: "Coursera Business Specializations", link: "https://www.coursera.org/browse/business", category: "Business & Finance" },
        { name: "HubSpot Academy", link: "https://academy.hubspot.com/", category: "Business & Finance" },
        { name: "Futureskilling (Udemy)", link: "https://www.udemy.com/topic/business/", category: "Business & Finance" },

        // Creative Skills
        { name: "Skillshare", link: "https://www.skillshare.com/", category: "Creative Skills" },
        { name: "Domestika", link: "https://www.domestika.org/", category: "Creative Skills" },
        { name: "MasterClass", link: "https://www.masterclass.com/", category: "Creative Skills" },
        { name: "LinkedIn Learning (Creative Section)", link: "https://www.linkedin.com/learning/", category: "Creative Skills" },

        // General Education & MOOCs
        { name: "Khan Academy (General)", link: "https://www.khanacademy.org/", category: "General Education & MOOCs" },
        { name: "Coursera", link: "https://www.coursera.org/", category: "General Education & MOOCs" },
        { name: "edX", link: "https://www.edx.org/", category: "General Education & MOOCs" },
        { name: "FutureLearn", link: "https://www.futurelearn.com/", category: "General Education & MOOCs" },
        { name: "OpenLearn (Open University)", link: "https://www.open.edu/openlearn/", category: "General Education & MOOCs" },

        // Career Development & Professional Skills
        { name: "Google Digital Garage", link: "https://digitalgarage.withgoogle.com/", category: "Career Development & Professional Skills" },
        { name: "Alison", link: "https://alison.com/", category: "Career Development & Professional Skills" },
        { name: "Udemy Professional Skills Courses", link: "https://www.udemy.com/", category: "Career Development & Professional Skills" },
        { name: "CareerFoundry", link: "https://careerfoundry.com/", category: "Career Development & Professional Skills" }
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

  const categories = educationResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

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
            <li key={index} onClick={() => displayHabitDetails(habit)}>
              {habit}
            </li>
          ))}
        </ul>
        <button onClick={fetchHabits}>Generate More Habits</button>
        {selectedHabit && <p className="habit-details">{selectedHabit}</p>}
      </div>

      <div className="education-container">
        <h2>Education Resources</h2>
        {Object.keys(categories).map((cat) => (
          <div className="education-category" key={cat}>
            <h3>{cat}</h3>
            <ul>
              {categories[cat].map((resource, index) => (
                <li key={index}>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
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

      <div className="chart-container">
        <PredictiveForecastChart />
      </div>

      <div className="chart-container">
        <InteractiveGlobe />
      </div>

      <div className="chart-container">
        <LiveTrendVisualizer />
      </div>

      <div className="chart-container">
        <LiveHeatmap />
      </div>

      <div className="chart-container">
        <AI_DecisionTreeVisualizer />
      </div>

      <div className="live-chart-container">
        <h2>AI Adaptive Pulse</h2>
        <Line
          data={{
            labels: liveChartData.labels,
            datasets: [
              {
                label: "Neural Signal",
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
                  text: "Processing Intensity",
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