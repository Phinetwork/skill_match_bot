import React, { useState } from "react";
import axios from "axios";

const OnboardingForm = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [matches, setMatches] = useState([]); // State for storing fetched matches
  const [loading, setLoading] = useState(false); // State for tracking loading status
  const [error, setError] = useState(""); // State for storing error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors
    setMatches([]); // Clear previous matches

    try {
      // Make API call
      const response = await axios.post(
        "https://skill-match-bot.onrender.com/api/matches",
        {
          skills: skills.split(",").map((skill) => skill.trim()),
          interests: interests.split(",").map((interest) => interest.trim()),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update matches state with response data
      setMatches(response.data);
      console.log("Matches:", response.data);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(
        err.response?.data?.error ||
          "An error occurred while fetching matches. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Find Your Perfect Side Hustle</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Enter Your Skills (comma-separated):</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., coding, writing"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Enter Your Interests (comma-separated):</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., design, photography"
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Finding Matches..." : "Find Matches"}
          </button>
        </form>

        {/* Display Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Display Matches */}
        {matches.length > 0 && (
          <div style={styles.results}>
            <h2 style={styles.resultsHeading}>Recommended Side Hustles</h2>
            <ul style={styles.resultsList}>
              {matches.map((match, index) => (
                <li key={index} style={styles.resultItem}>
                  {match}
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
    background: "linear-gradient(135deg, #2a2a72, #009ffd)", // Elegant gradient
    padding: "20px",
  },
  card: {
    background: "#fff", // White background
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    borderRadius: "12px",
    maxWidth: "500px",
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
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
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
};

export default OnboardingForm;
