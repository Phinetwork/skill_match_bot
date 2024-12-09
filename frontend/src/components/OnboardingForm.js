// OnboardingForm.js

import React, { useState } from "react";
import axios from "axios";

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
      // Fetch side hustles based on skills
      if (skills.trim() !== "") {
        const skillsResponse = await axios.post(
          "https://skill-match-bot.onrender.com/api/matches",
          {
            skills: skills.split(",").map((skill) => skill.trim()),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setMatches(skillsResponse.data);
      }

      // Fetch recommended skills based on interests
      if (interests.trim() !== "") {
        const interestsResponse = await axios.post(
          "https://skill-match-bot.onrender.com/api/skills",
          {
            interests: interests.split(",").map((interest) => interest.trim()),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
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
        "https://skill-match-bot.onrender.com/api/habits",
        {
          side_hustle: sideHustle,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Find Your Perfect Side Hustle</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="skills" style={styles.label}>
              Enter Your Skills (comma-separated):
            </label>
            <input
              id="skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., coding, writing"
              style={styles.input}
              aria-label="Enter skills"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="interests" style={styles.label}>
              Enter Your Interests (comma-separated):
            </label>
            <input
              id="interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., design, photography"
              style={styles.input}
              aria-label="Enter interests"
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: loading ? "#ccc" : "#007BFF",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
            aria-label="Submit to find matches"
          >
            {loading ? "Finding Matches..." : "Find Matches"}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {matches.length > 0 && (
          <div style={styles.results}>
            <h2 style={styles.resultsHeading}>Recommended Side Hustles</h2>
            <ul style={styles.resultsList}>
              {matches.map((match, index) => (
                <li key={index} style={styles.resultItem}>
                  <button
                    onClick={() => handleSideHustleSelect(match)}
                    style={styles.resultButton}
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
          <div style={styles.results}>
            <h2 style={styles.resultsHeading}>Recommended Skills</h2>
            <ul style={styles.resultsList}>
              {recommendedSkills.map((skill, index) => (
                <li key={index} style={styles.resultItem}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedSideHustle !== "" && habits.length > 0 && (
          <div style={styles.results}>
            <h2 style={styles.resultsHeading}>
              Recommended Habits for {selectedSideHustle}
            </h2>
            <ul style={styles.resultsList}>
              {habits.map((habit, index) => (
                <li key={index} style={styles.resultItem}>
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

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2a2a72, #009ffd)",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    background: "#fff",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "100%",
    padding: "30px",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  form: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "5px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    transition: "background-color 0.3s",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  },
  results: {
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  resultsHeading: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "15px",
  },
  resultsList: {
    listStyleType: "none",
    padding: 0,
  },
  resultItem: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
    textAlign: "center",
    color: "#007BFF",
    border: "1px solid #ddd",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
  },
  resultButton: {
    background: "none",
    border: "none",
    color: "#007BFF",
    cursor: "pointer",
    fontSize: "16px",
    textDecoration: "underline",
  },
};

export default OnboardingForm;
