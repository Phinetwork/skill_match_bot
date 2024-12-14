import React, { useState, useEffect } from "react";
import "./Game.css";

// Simulate backend APIs
const fetchUserProfile = async () => ({
  name: "Player One",
  streak: Math.floor(Math.random() * 10) + 1,
  skillStats: {
    timeManagement: Math.floor(Math.random() * 100),
    problemSolving: Math.floor(Math.random() * 100),
    mindfulness: Math.floor(Math.random() * 100),
  },
});

const fetchLeaderboard = async () => [
  { name: "Alice", score: Math.floor(Math.random() * 300) + 200 },
  { name: "Bob", score: Math.floor(Math.random() * 300) + 200 },
  { name: "Player One", score: Math.floor(Math.random() * 300) + 100 },
];

const generateRandomSequence = (length) => {
  const colors = ["Red", "Blue", "Green", "Yellow", "Orange", "Purple"];
  return Array.from({ length }, () => colors[Math.floor(Math.random() * colors.length)]);
};

const generateDynamicScenario = (userStats) => {
  const templates = [
    {
      title: "Time Crunch",
      description: "You have multiple tasks. How do you prioritize?",
      options: [
        { text: "Focus on urgent tasks", skill: "timeManagement" },
        { text: "Delegate to others", skill: "problemSolving" },
        { text: "Take a break", skill: "mindfulness" },
      ],
    },
    {
      title: "Financial Decision",
      description: "You have unexpected expenses. What do you do?",
      options: [
        { text: "Save the money", skill: "mindfulness" },
        { text: "Invest in a project", skill: "problemSolving" },
        { text: "Spend it carefully", skill: "timeManagement" },
      ],
    },
  ];

  return templates.map((template) => {
    const options = template.options.map((option) => ({
      ...option,
      text: `${option.text} (${Math.floor(Math.random() * 100)} points)`,
      score: Math.floor(Math.random() * 20) + 5 + Math.floor(userStats[option.skill] / 10),
    }));

    return {
      title: template.title,
      description: template.description,
      options,
    };
  });
};

const generateDynamicMiniGames = () => [
  {
    id: "memory",
    title: "Memory Blitz",
    description: "Memorize the sequence and repeat it.",
    levels: Array.from({ length: 3 }, (_, i) => ({
      sequence: generateRandomSequence(i + 3),
      points: (i + 1) * 10,
    })),
  },
  {
    id: "reaction",
    title: "Reaction Challenge",
    description: "Tap the button as quickly as you can when it appears!",
    difficulty: Array.from({ length: 3 }, (_, i) => ({
      delayRange: [300 + i * 200, 1000 - i * 200],
      points: (i + 1) * 10,
    })),
  },
  {
    id: "logic",
    title: "Logical Puzzle",
    description: "Solve multi-step challenges.",
    levels: Array.from({ length: 3 }, (_, i) => ({
      question: `What is ${(i + 1) * 10} + ${(i + 2) * 5}?`,
      answer: `${(i + 1) * 10 + (i + 2) * 5}`,
      points: (i + 1) * 15,
    })),
  },
];

function Game() {
  const [userProfile, setUserProfile] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [miniGames, setMiniGames] = useState([]);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [miniGameActive, setMiniGameActive] = useState(false);
  const [currentMiniGame, setCurrentMiniGame] = useState(null);
  const [miniGameLevel, setMiniGameLevel] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const initializeGame = async () => {
      const profile = await fetchUserProfile();
      setUserProfile(profile);

      const scenarios = generateDynamicScenario(profile.skillStats);
      setScenarios(scenarios);

      const leaderboard = await fetchLeaderboard();
      setLeaderboard(leaderboard);

      const miniGames = generateDynamicMiniGames();
      setMiniGames(miniGames);
    };
    initializeGame();
  }, []);

  const handleOptionClick = (option) => {
    setScore(score + option.score);
    setFeedback(`You earned ${option.score} points!`);
    setProgress(progress + 1);

    if (currentScenarioIndex + 1 < scenarios.length) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      setFeedback("You've completed all scenarios!");
    }
  };

  const startMiniGame = () => {
    const randomGame = miniGames[Math.floor(Math.random() * miniGames.length)];
    setCurrentMiniGame(randomGame);
    setMiniGameActive(true);
    setMiniGameLevel(0);
  };

  const handleMiniGameSubmit = (answer) => {
    const game = currentMiniGame;
    const level = game.levels ? game.levels[miniGameLevel] : null;
    const correct = level?.sequence ? answer === level.sequence.join(", ") : answer === level?.answer;

    if (correct) {
      setScore(score + level.points);
      setFeedback(`Correct! You earned ${level.points} points!`);
      if (miniGameLevel + 1 < (game.levels?.length || 0)) {
        setMiniGameLevel(miniGameLevel + 1);
      } else {
        setMiniGameActive(false);
      }
    } else {
      setFeedback("Oops! That was incorrect.");
      setMiniGameActive(false);
    }
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>MindVault Quest</h1>
        {userProfile && <p>Welcome, {userProfile.name}! Streak: {userProfile.streak} days</p>}
        <div className="stats">
          <p>Score: {score}</p>
          <p>Progress: {progress}/{scenarios.length}</p>
        </div>
      </header>
      <main className="game-area">
        {!miniGameActive ? (
          <>
            <h2>{scenarios[currentScenarioIndex]?.title}</h2>
            <p>{scenarios[currentScenarioIndex]?.description}</p>
            <div className="options">
              {scenarios[currentScenarioIndex]?.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            <button className="mini-game-button" onClick={startMiniGame}>
              Play Mini-Game for Bonus Points
            </button>
          </>
        ) : (
          <div className="mini-game">
            <h2>{currentMiniGame.title}</h2>
            <p>{currentMiniGame.description}</p>
            {currentMiniGame.levels && currentMiniGame.levels[miniGameLevel]?.sequence ? (
              <div className="options">
                {currentMiniGame.levels[miniGameLevel].sequence.map((seq, index) => (
                  <button
                    key={index}
                    className="option-button"
                    onClick={() => handleMiniGameSubmit(seq)}
                  >
                    {seq}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Enter your answer"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleMiniGameSubmit(e.target.value);
                }}
              />
            )}
          </div>
        )}
        {feedback && <p className="feedback">{feedback}</p>}
      </main>
    </div>
  );
}

export default Game;
