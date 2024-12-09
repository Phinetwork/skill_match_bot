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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Find Your Perfect Side Hustle</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Enter Your Skills (comma-separated):
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., coding, writing"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Enter Your Interests (comma-separated):
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., design, photography"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Finding Matches..." : "Find Matches"}
        </button>
      </form>

      {/* Display Error Message */}
      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      {/* Display Matches */}
      {matches.length > 0 && (
        <div>
          <h2>Recommended Side Hustles</h2>
          <ul>
            {matches.map((match, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {match}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OnboardingForm;
