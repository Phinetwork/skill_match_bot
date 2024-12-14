import React, { useState } from 'react';
import './Game.css';

const scenarios = [
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
  {
    id: 3,
    title: "Conflict Resolver",
    description:
      "Your team is in disagreement over a project direction. How do you handle it?",
    options: [
      { text: "Listen to everyone's input and find a compromise", score: 10 },
      { text: "Decide quickly to avoid delays", score: 5 },
      { text: "Let someone else decide", score: 2 },
    ],
  },
];

function Game() {
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState("");

  const maxProgress = scenarios.length;

  const handleOptionClick = (optionScore) => {
    setScore(score + optionScore);
    setProgress(progress + 1);
    setFeedback(`You earned ${optionScore} points!`);

    // Proceed to the next scenario or reset if completed
    if (currentScenarioIndex + 1 < scenarios.length) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      setFeedback("Game Over! Well done!");
    }
  };

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>MindVault Quest</h1>
        <div className="stats">
          <p>Score: {score}</p>
          <p>Progress: {progress}/{maxProgress}</p>
        </div>
      </header>
      <main className="game-area">
        {progress < maxProgress ? (
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
          </>
        ) : (
          <div className="game-over">
            <h2>Congratulations!</h2>
            <p>Your final score: {score}</p>
            <button
              className="restart-button"
              onClick={() => {
                setScore(0);
                setProgress(0);
                setCurrentScenarioIndex(0);
                setFeedback("");
              }}
            >
              Play Again
            </button>
          </div>
        )}
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
