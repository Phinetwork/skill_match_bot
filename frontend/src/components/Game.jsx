import React, { useState, useEffect } from "react";
import "./Game.css";

// Scenarios grouped by levels
const levelScenarios = {
  1: [
    {
      id: 1,
      title: "Time Crunch",
      description: "You have 3 tasks due at the same time. How do you prioritize?",
      options: [
        { text: "Finish the easiest task first", score: 5 },
        { text: "Complete the hardest task first", score: 10 },
        { text: "Delegate to your team", score: 8 },
      ],
    },
    {
      id: 2,
      title: "Budget Balancer",
      description: "You have $500 left in your monthly budget. What do you do?",
      options: [
        { text: "Save for emergencies", score: 10 },
        { text: "Invest in a course to improve skills", score: 8 },
        { text: "Buy a new gadget", score: 3 },
      ],
    },
  ],
  2: [
    {
      id: 3,
      title: "Conflict Resolver",
      description: "Your team is in disagreement over a project direction. How do you handle it?",
      options: [
        { text: "Listen to everyone's input and find a compromise", score: 10 },
        { text: "Decide quickly to avoid delays", score: 5 },
        { text: "Let someone else decide", score: 2 },
      ],
    },
    {
      id: 4,
      title: "Time vs Quality",
      description: "You’re running out of time to finish a project. What do you prioritize?",
      options: [
        { text: "Submit as-is to meet the deadline", score: 5 },
        { text: "Request more time to improve quality", score: 8 },
        { text: "Split tasks with teammates", score: 10 },
      ],
    },
  ],
};

// Mini-game questions (e.g., memory and problem-solving)
const miniGames = {
  memory: {
    id: "memory",
    title: "Memory Blitz",
    description: "Remember this sequence: Red, Blue, Green, Yellow. Repeat it.",
    options: [
      { text: "Red, Blue, Green, Yellow", correct: true },
      { text: "Red, Green, Blue, Yellow", correct: false },
      { text: "Yellow, Blue, Red, Green", correct: false },
    ],
  },
  logic: {
    id: "logic",
    title: "Logical Puzzle",
    description: "A train leaves Station A at 6:00 PM and travels at 60 mph. How far does it go in 2 hours?",
    options: [
      { text: "60 miles", correct: false },
      { text: "120 miles", correct: true },
      { text: "90 miles", correct: false },
    ],
  },
};

function Game() {
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [miniGameActive, setMiniGameActive] = useState(false);
  const [miniGameResult, setMiniGameResult] = useState("");

  const scenarios = levelScenarios[currentLevel];
  const maxProgress = scenarios.length;

  // Add to streak on component mount
  useEffect(() => {
    setDailyStreak((prev) => prev + 1);
  }, []);

  const handleOptionClick = (optionScore) => {
    setScore(score + optionScore);
    setProgress(progress + 1);
    setFeedback(`You earned ${optionScore} points!`);

    // Check for achievements
    if (score + optionScore >= 50 && !achievements.includes("Score Master")) {
      setAchievements([...achievements, "Score Master"]);
      setFeedback("Achievement Unlocked: Score Master!");
    }

    // Proceed to next scenario or level
    if (currentScenarioIndex + 1 < scenarios.length) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else if (currentLevel < Object.keys(levelScenarios).length) {
      // Reset progress and advance level
      setCurrentLevel(currentLevel + 1);
      setCurrentScenarioIndex(0);
      setProgress(0);
      setFeedback("Level Up! Welcome to the next challenge!");
    } else {
      setFeedback("Congratulations! You’ve completed all levels!");
    }
  };

  const handleMiniGameSubmit = (isCorrect) => {
    setMiniGameActive(false);
    if (isCorrect) {
      setScore(score + 20);
      setMiniGameResult("Correct! Bonus 20 points!");
    } else {
      setMiniGameResult("Oops! That was incorrect.");
    }
  };

  const startMiniGame = () => {
    setMiniGameActive(true);
    setMiniGameResult("");
  };

  const currentScenario = scenarios[currentScenarioIndex];
  const randomMiniGame = miniGames.memory;

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>MindVault Quest</h1>
        <div className="stats">
          <p>Score: {score}</p>
          <p>Level: {currentLevel}</p>
          <p>Progress: {progress}/{maxProgress}</p>
          <p>Daily Streak: {dailyStreak} Days</p>
        </div>
      </header>
      <main className="game-area">
        {!miniGameActive && (progress < maxProgress || currentLevel < Object.keys(levelScenarios).length) ? (
          <>
            <h2>{currentScenario.title}</h2>
            <p>{currentScenario.description}</p>
            <div className="options">
              {currentScenario.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleOptionClick(option.score)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            {feedback && <p className="feedback">{feedback}</p>}
            <button className="mini-game-button" onClick={startMiniGame}>
              Play Mini-Game for Bonus Points
            </button>
          </>
        ) : miniGameActive ? (
          <div className="mini-game">
            <h2>{randomMiniGame.title}</h2>
            <p>{randomMiniGame.description}</p>
            <div className="options">
              {randomMiniGame.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleMiniGameSubmit(option.correct)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="game-over">
            <h2>Congratulations!</h2>
            <p>Your final score: {score}</p>
            <ul>
              {achievements.map((ach, index) => (
                <li key={index}>{ach}</li>
              ))}
            </ul>
            <button
              className="restart-button"
              onClick={() => {
                setScore(0);
                setProgress(0);
                setCurrentLevel(1);
                setCurrentScenarioIndex(0);
                setFeedback("");
                setAchievements([]);
              }}
            >
              Play Again
            </button>
          </div>
        )}
        {miniGameResult && <p className="feedback">{miniGameResult}</p>}
      </main>
      <footer className="game-footer">
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${(progress / maxProgress) * 100}%` }}
          ></div>
        </div>
      </footer>
    </div>
  );
}

export default Game;
