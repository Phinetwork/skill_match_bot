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
      const response = await axios.post("https://skill-match-bot.onrender.com/api/matches", {
        skills: skills.split(",").map((skill) => skill.trim()),
        interests: interests.split(",").map((interest) => interest.trim()),
      });

      // Update matches state with response data
      setMatches(response.data);
      console.log("Matches:", response.data);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("An error occurred while fetching matches. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={styles.container}>
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
  );
};

const styles = {
  container: {
    padding: "10px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#fff", // White text
    backgroundColor: "#007BFF", // Blue background
    padding: "10px",
    borderRadius: "5px",
  },
  form: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#28a745", // Green background
    color: "#fff", // White text
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
    textAlign: "center",
  },
  results: {
    marginTop: "20px",
    backgroundColor: "#f1f1f1", // Light grey background
    padding: "15px",
    borderRadius: "5px",
  },
  resultsHeading: {
    fontSize: "20px",
    marginBottom: "10px",
    textAlign: "center",
    color: "#333", // Darker text for contrast
  },
  resultsList: {
    listStyleType: "none",
    padding: 0,
  },
  resultItem: {
    backgroundColor: "#ffffff", // White background
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "5px",
    textAlign: "center",
    color: "#007BFF", // Blue text
    border: "1px solid #ccc", // Add a border for better visibility
  },
};

export default OnboardingForm;
