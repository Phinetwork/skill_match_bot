import React, { useState, useEffect } from "react";

// Simulate backend APIs
const fetchUserProfile = async () => ({
  name: "Player One",
  streak: 5,
  skillStats: {
    timeManagement: 60,
    problemSolving: 40,
    mindfulness: 50,
  },
  level: 1,
});

const fetchLeaderboard = async () => [
  { name: "Alice", score: 120 },
  { name: "Bob", score: 100 },
  { name: "Player One", score: 80 },
];

const fetchMiniGames = () => [
  {
    id: "memory",
    title: "Memory Blitz",
    description: "Remember this sequence: Red, Blue, Green, Yellow. Repeat it.",
    options: [
      { text: "Red, Blue, Green, Yellow", correct: true },
      { text: "Red, Green, Blue, Yellow", correct: false },
      { text: "Yellow, Blue, Red, Green", correct: false },
    ],
  },
  {
    id: "logic",
    title: "Logical Puzzle",
    description: "A train leaves Station A at 6:00 PM and travels at 60 mph. How far does it go in 2 hours?",
    options: [
      { text: "60 miles", correct: false },
      { text: "120 miles", correct: true },
      { text: "90 miles", correct: false },
    ],
  },
  {
    id: "reaction",
    title: "Reaction Challenge",
    description: "Tap the button as quickly as you can when it appears!",
    isReaction: true,
  },
  {
    id: "calculation",
    title: "Quick Math",
    description: "Solve this: 12 + 15 = ?",
    options: [
      { text: "27", correct: true },
      { text: "28", correct: false },
      { text: "26", correct: false },
    ],
  },
];

// Enhanced Scenarios with Levels
const generateDynamicScenarios = (level, userStats, feedbackData) => {
  const baseScenarios = [
    {
      title: "Time Crunch",
      description: "You have 3 tasks due at the same time. How do you prioritize?",
      options: [
        { text: "Finish the easiest task first", score: 5, skill: "timeManagement" },
        { text: "Complete the hardest task first", score: 10, skill: "problemSolving" },
        { text: "Delegate to your team", score: 8, skill: "timeManagement" },
      ],
      difficulty: 1,
    },
    {
      title: "Mindfulness Break",
      description: "You’re feeling overwhelmed. What do you do?",
      options: [
        { text: "Meditate for 5 minutes", score: 10, skill: "mindfulness" },
        { text: "Take a quick walk", score: 8, skill: "mindfulness" },
        { text: "Power through and ignore it", score: 3, skill: "timeManagement" },
      ],
      difficulty: 1,
    },
    // Add more base scenarios with varying difficulties
    {
      title: "Complex Decision",
      description: "You need to choose between increasing your team size or improving existing processes. What do you do?",
      options: [
        { text: "Increase team size", score: 7, skill: "teamManagement" },
        { text: "Improve existing processes", score: 9, skill: "processImprovement" },
        { text: "Balance both equally", score: 8, skill: "balanceSkills" },
      ],
      difficulty: 2,
    },
    {
      title: "Stress Management",
      description: "Deadlines are approaching fast. How do you manage your stress?",
      options: [
        { text: "Prioritize tasks and delegate", score: 10, skill: "timeManagement" },
        { text: "Work longer hours to get everything done", score: 4, skill: "workEthic" },
        { text: "Take regular short breaks to stay refreshed", score: 8, skill: "mindfulness" },
      ],
      difficulty: 2,
    },
  ];

  // Filter scenarios based on level and feedback
  const filteredScenarios = baseScenarios.filter(
    (scenario) => scenario.difficulty <= level
  );

  // Randomize scenarios
  const randomizedScenarios = filteredScenarios.sort(() => 0.5 - Math.random());

  // Adjust scenarios based on user feedback (simulated adaptive learning)
  const adaptedScenarios = randomizedScenarios.map((scenario) => {
    // Example: If user feedback indicates difficulty with time management, increase related scenario complexity
    if (feedbackData.timeManagementDifficulty) {
      scenario.options = scenario.options.map((option) => {
        if (option.skill === "timeManagement") {
          option.score += 2; // Adjust scores based on difficulty
        }
        return option;
      });
    }
    return scenario;
  });

  return adaptedScenarios;
};

function Game() {
  const [userProfile, setUserProfile] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [miniGames, setMiniGames] = useState([]);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [miniGameActive, setMiniGameActive] = useState(false);
  const [currentMiniGame, setCurrentMiniGame] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [level, setLevel] = useState(1);
  const [feedbackData, setFeedbackData] = useState({
    timeManagementDifficulty: false,
    problemSolvingDifficulty: false,
    mindfulnessDifficulty: false,
  });

  useEffect(() => {
    const initializeGame = async () => {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      setLevel(profile.level);

      const dynamicScenarios = generateDynamicScenarios(
        profile.level,
        profile.skillStats,
        feedbackData
      );
      setScenarios(dynamicScenarios);

      const leaderboardData = await fetchLeaderboard();
      setLeaderboard(leaderboardData);

      const games = fetchMiniGames();
      setMiniGames(games);
    };
    initializeGame();
  }, [level, feedbackData]);

  const handleOptionClick = (option) => {
    setScore(score + option.score);
    setFeedback(`You earned ${option.score} points!`);
    setProgress(progress + 1);

    // Update user skills based on the option selected
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      skillStats: {
        ...prevProfile.skillStats,
        [option.skill]: prevProfile.skillStats[option.skill] + option.score,
      },
    }));

    // Collect feedback data for adaptive learning
    if (option.skill === "timeManagement" && option.score < 5) {
      setFeedbackData((prev) => ({ ...prev, timeManagementDifficulty: true }));
    }

    // Proceed to the next scenario or level up
    if (currentScenarioIndex + 1 < scenarios.length) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      // Level completed, increase level and generate new scenarios
      setLevel(level + 1);
      setCurrentScenarioIndex(0);
      setProgress(0);
      setFeedback("");
      // Optionally, save progress to backend here
    }
  };

  const startMiniGame = () => {
    const randomGame = miniGames[Math.floor(Math.random() * miniGames.length)];
    setCurrentMiniGame(randomGame);
    setMiniGameActive(true);

    // Set reaction game timing
    if (randomGame.isReaction) {
      setTimeout(() => {
        setReactionTime(Date.now());
      }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
    }
  };

  const handleMiniGameSubmit = (option) => {
    if (currentMiniGame.isReaction) {
      const timeTaken = Date.now() - reactionTime;
      setScore(score + Math.max(0, 1000 - timeTaken));
      setFeedback(`Reaction Time: ${timeTaken}ms. You earned ${Math.max(0, 1000 - timeTaken)} points!`);
    } else if (option.correct) {
      setScore(score + 20);
      setFeedback("Correct! Bonus 20 points!");
    } else {
      setFeedback("Oops! That was incorrect.");
    }
    setMiniGameActive(false);
    setReactionTime(null);
  };

  const restartGame = () => {
    setScore(0);
    setProgress(0);
    setCurrentScenarioIndex(0);
    setFeedback("");
    setGameOver(false);
    setMiniGameActive(false);
    setCurrentMiniGame(null);
    setLevel(1);
    setFeedbackData({
      timeManagementDifficulty: false,
      problemSolvingDifficulty: false,
      mindfulnessDifficulty: false,
    });
    // Optionally, reset user profile
  };

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>MindVault Quest</h1>
        {userProfile && (
          <p>
            Welcome, {userProfile.name}! Streak: {userProfile.streak} days | Level: {level}
          </p>
        )}
        <div className="stats">
          <p>Score: {score}</p>
          <p>Progress: {progress}/{scenarios.length}</p>
        </div>
      </header>
      <main className="game-area">
        {!miniGameActive && !gameOver && currentScenario ? (
          <>
            <h2>{currentScenario.title}</h2>
            <p>{currentScenario.description}</p>
            <div className="options">
              {currentScenario.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleOptionClick(option)}
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
        ) : miniGameActive && currentMiniGame ? (
          <div className="mini-game">
            <h2>{currentMiniGame.title}</h2>
            <p>{currentMiniGame.description}</p>
            {!currentMiniGame.isReaction ? (
              <div className="options">
                {currentMiniGame.options.map((option, index) => (
                  <button
                    key={index}
                    className="option-button"
                    onClick={() => handleMiniGameSubmit(option)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <button
                className="reaction-button"
                onClick={() => handleMiniGameSubmit()}
                disabled={!reactionTime}
              >
                Tap Here!
              </button>
            )}
          </div>
        ) : gameOver ? (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Your final score: {score}</p>
            <h3>Leaderboard</h3>
            <ul>
              {leaderboard.map((entry, index) => (
                <li key={index}>
                  {entry.name}: {entry.score} points
                </li>
              ))}
            </ul>
            <button className="restart-button" onClick={restartGame}>
              Play Again
            </button>
          </div>
        ) : null}
      </main>
      <footer className="game-footer">
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${(progress / scenarios.length) * 100}%` }}
          ></div>
        </div>
      </footer>
    </div>
  );
}

export default Game;
