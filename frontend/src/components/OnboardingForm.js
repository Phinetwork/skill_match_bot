import React, { useState } from "react";
import axios from "axios";

const OnboardingForm = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://skill-match-bot.onrender.com/api/matches", {
        skills: skills.split(",").map((skill) => skill.trim()),
        interests: interests.split(",").map((interest) => skill.trim()),
      });
      console.log("Matches:", response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  return (
    <div>
      <h1>Find Your Perfect Side Hustle</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter Your Skills (comma-separated):</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., coding, writing"
          />
        </div>
        <div>
          <label>Enter Your Interests (comma-separated):</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., design, photography"
          />
        </div>
        <button type="submit">Find Matches</button>
      </form>
    </div>
  );
};

export default OnboardingForm;
