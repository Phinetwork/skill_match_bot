import React, { useState } from "react";
import axios from "axios";
import "./OnboardingForm.css"; // Import the global CSS file

const OnboardingForm = () => {
  const [activeTab, setActiveTab] = useState("skills"); // Tracks the current active tab
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [matches, setMatches] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [habits, setHabits] = useState([]);
  const [selectedSideHustle, setSelectedSideHustle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0); // Progress state for the progress indicator

  const saveUserData = async (data) => {
    try {
      await axios.post(
        "https://skill-match-bot.onrender.com/api/save-user-data",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      console.error("Error saving user data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMatches([]);
    setRecommendedSkills([]);
    setHabits([]);
    setSelectedSideHustle("");
    setProgress(0); // Reset progress

    const userData = {
      skills: skills.split(",").map((skill) => skill.trim()),
      interests: interests.split(",").map((interest) => interest.trim()),
    };

    saveUserData(userData);

    try {
      if (skills.trim() !== "") {
        setProgress(33); // Update progress
        const skillsResponse = await axios.post(
          "https://skill-match-bot.onrender.com/api/matches",
          { skills: userData.skills },
          { headers: { "Content-Type": "application/json" } }
        );
        setMatches(skillsResponse.data);
      }

      if (interests.trim() !== "") {
        setProgress(66); // Update progress
        const interestsResponse = await axios.post(
          "https://skill-match-bot.onrender.com/api/skills",
          { interests: userData.interests },
          { headers: { "Content-Type": "application/json" } }
        );
        setRecommendedSkills(interestsResponse.data);
      }
      setProgress(100); // Complete progress
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while fetching data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSideHustleSelect = async (sideHustle) => {
    setSelectedSideHustle(sideHustle);
    setHabits([]);
    setError("");

    try {
      const response = await axios.post(
        "https://skill-match-bot.onrender.com/api/habits",
        { side_hustle: sideHustle },
        { headers: { "Content-Type": "application/json" } }
      );
      setHabits(response.data);
      saveUserData({ selectedSideHustle: sideHustle });
    } catch (err) {
      console.error("Error fetching habits:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while fetching habits. Please try again."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1 className="form-heading">Find Your Perfect Side Hustle</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab("skills")}
            className={`tab-button ${activeTab === "skills" ? "active" : ""}`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab("interests")}
            className={`tab-button ${activeTab === "interests" ? "active" : ""}`}
          >
            Interests
          </button>
          <button
            onClick={() => setActiveTab("side-hustles")}
            className={`tab-button ${activeTab === "side-hustles" ? "active" : ""}`}
          >
            Side Hustles
          </button>
        </div>

        {/* Tabs Content */}
        {activeTab === "skills" && (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="skills" className="form-label">
                Enter Your Skills (comma-separated):
              </label>
              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., coding, writing"
                className="form-input"
                aria-label="Enter skills"
              />
            </div>
          </form>
        )}

        {activeTab === "interests" && (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="interests" className="form-label">
                Enter Your Interests (comma-separated):
              </label>
              <input
                id="interests"
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., design, photography"
                className="form-input"
                aria-label="Enter interests"
              />
            </div>
          </form>
        )}

        {activeTab === "side-hustles" && (
          <div className="results">
            <h2 className="results-heading">Recommended Side Hustles</h2>
            <ul className="results-list">
              {matches.map((match, index) => (
                <li key={index} className="result-item">
                  <button
                    onClick={() => handleSideHustleSelect(match)}
                    className="result-button"
                    aria-label={`Select ${match} to get habit recommendations`}
                  >
                    {match}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingForm;
