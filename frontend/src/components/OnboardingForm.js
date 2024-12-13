import React, { useState } from "react";
import axios from "axios";
import "./OnboardingForm.css"; // Import the global CSS file

const OnboardingForm = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [matches, setMatches] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [habits, setHabits] = useState([]);
  const [selectedSideHustle, setSelectedSideHustle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMatches([]);
    setRecommendedSkills([]);
    setHabits([]);
    setSelectedSideHustle("");

    try {
      if (skills.trim() !== "") {
        const skillsResponse = await axios.post(
          "https://skyriz.onrender.com/api/matches",
          { skills: skills.split(",").map((skill) => skill.trim()) },
          { headers: { "Content-Type": "application/json" } }
        );
        setMatches(skillsResponse.data);
      }

      if (interests.trim() !== "") {
        const interestsResponse = await axios.post(
          "https://skyriz.onrender.com/api/skills",
          { interests: interests.split(",").map((interest) => interest.trim()) },
          { headers: { "Content-Type": "application/json" } }
        );
        setRecommendedSkills(interestsResponse.data);
      }
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
        "https://skyriz.onrender.com/api/habits",
        { side_hustle: sideHustle },
        { headers: { "Content-Type": "application/json" } }
      );
      setHabits(response.data);
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
          <button
            type="submit"
            className={`form-button ${loading ? "disabled" : ""}`}
            disabled={loading}
            aria-label="Submit to find matches"
          >
            {loading ? "Finding Matches..." : "Find Matches"}
          </button>
        </form>

        {error && <div className="form-error">{error}</div>}

        {matches.length > 0 && (
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

        {recommendedSkills.length > 0 && (
          <div className="results">
            <h2 className="results-heading">Recommended Skills</h2>
            <ul className="results-list">
              {recommendedSkills.map((skill, index) => (
                <li key={index} className="result-item">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedSideHustle !== "" && habits.length > 0 && (
          <div className="results">
            <h2 className="results-heading">
              Recommended Habits for {selectedSideHustle}
            </h2>
            <ul className="results-list">
              {habits.map((habit, index) => (
                <li key={index} className="result-item">
                  {habit}
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
