import React, { useState, useEffect } from "react";
import "./Game.css";

// Expanded Scenarios grouped by levels
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
    {
      id: 3,
      title: "Meeting Maestro",
      description: "You have a meeting scheduled but realize it overlaps with another important task. What do you do?",
      options: [
        { text: "Attend the meeting and postpone the task", score: 5 },
        { text: "Reschedule the meeting to accommodate the task", score: 10 },
        { text: "Attend both simultaneously", score: 2 },
      ],
    },
  ],
  2: [
    {
      id: 4,
      title: "Conflict Resolver",
      description: "Your team is in disagreement over a project direction. How do you handle it?",
      options: [
        { text: "Listen to everyone's input and find a compromise", score: 10 },
        { text: "Decide quickly to avoid delays", score: 5 },
        { text: "Let someone else decide", score: 2 },
      ],
    },
    {
      id: 5,
      title: "Time vs Quality",
      description: "You’re running out of time to finish a project. What do you prioritize?",
      options: [
        { text: "Submit as-is to meet the deadline", score: 5 },
        { text: "Request more time to improve quality", score: 8 },
        { text: "Split tasks with teammates", score: 10 },
      ],
    },
    {
      id: 6,
      title: "Resource Allocation",
      description: "Your department has limited resources this quarter. How do you allocate them?",
      options: [
        { text: "Focus on high-impact projects", score: 10 },
        { text: "Distribute resources evenly across projects", score: 5 },
        { text: "Allocate resources based on seniority of team members", score: 3 },
      ],
    },
  ],
  3: [
    {
      id: 7,
      title: "Innovation Challenge",
      description: "Your company encourages innovation. How do you contribute?",
      options: [
        { text: "Propose a new project based on market research", score: 10 },
        { text: "Suggest minor improvements to existing processes", score: 8 },
        { text: "Focus solely on your assigned tasks", score: 5 },
      ],
    },
    {
      id: 8,
      title: "Crisis Management",
      description: "A critical system has failed during peak hours. What’s your immediate action?",
      options: [
        { text: "Assemble the team to troubleshoot immediately", score: 10 },
        { text: "Notify stakeholders and wait for further instructions", score: 5 },
        { text: "Attempt to fix it yourself without informing others", score: 2 },
      ],
    },
    {
      id: 9,
      title: "Feedback Facilitator",
      description: "A team member is underperforming. How do you address it?",
      options: [
        { text: "Have a private, constructive conversation to understand issues", score: 10 },
        { text: "Publicly call them out to improve performance", score: 2 },
        { text: "Ignore it and hope it improves over time", score: 3 },
      ],
    },
  ],
  4: [
    {
      id: 10,
      title: "Strategic Planning",
      description: "You’re tasked with developing a strategic plan for the next year. What’s your first step?",
      options: [
        { text: "Conduct a SWOT analysis to understand strengths and weaknesses", score: 10 },
        { text: "Set ambitious goals without detailed analysis", score: 5 },
        { text: "Follow last year’s plan and make minor adjustments", score: 3 },
      ],
    },
    {
      id: 11,
      title: "Change Management",
      description: "Your company is undergoing a major change. How do you support your team?",
      options: [
        { text: "Communicate transparently and involve the team in the process", score: 10 },
        { text: "Implement changes without discussing with the team", score: 3 },
        { text: "Wait and see how the change affects the company before acting", score: 5 },
      ],
    },
    {
      id: 12,
      title: "Diversity Champion",
      description: "You notice a lack of diversity in your team. What steps do you take?",
      options: [
        { text: "Initiate diversity and inclusion programs", score: 10 },
        { text: "Ignore it as it’s not directly related to work", score: 2 },
        { text: "Rely on HR to handle diversity issues", score: 5 },
      ],
    },
  ],
  5: [
    {
      id: 13,
      title: "Ethical Dilemma",
      description: "You discover that a colleague is manipulating data to meet targets. What do you do?",
      options: [
        { text: "Report the behavior to management", score: 10 },
        { text: "Confront the colleague privately", score: 8 },
        { text: "Ignore it to avoid conflict", score: 2 },
      ],
    },
    {
      id: 14,
      title: "Scaling Up",
      description: "Your startup is growing rapidly. How do you ensure sustainable growth?",
      options: [
        { text: "Invest in scalable infrastructure and hire strategically", score: 10 },
        { text: "Focus solely on increasing sales", score: 5 },
        { text: "Expand without a clear plan to capture market share quickly", score: 3 },
      ],
    },
    {
      id: 15,
      title: "Global Expansion",
      description: "You’re considering expanding your business internationally. What’s your approach?",
      options: [
        { text: "Conduct thorough market research and adapt strategies locally", score: 10 },
        { text: "Launch in multiple countries simultaneously to maximize reach", score: 5 },
        { text: "Use the same strategies from your home market without adjustments", score: 3 },
      ],
    },
  ],
  6: [
    {
      id: 16,
      title: "Leadership Legacy",
      description: "You’re preparing to leave your current role. How do you ensure a smooth transition?",
      options: [
        { text: "Mentor your successor and document key processes", score: 10 },
        { text: "Leave quickly without detailed handover", score: 2 },
        { text: "Only inform your immediate team without broader communication", score: 5 },
      ],
    },
    {
      id: 17,
      title: "Innovation Under Pressure",
      description: "Your team needs to innovate under tight deadlines. How do you foster creativity?",
      options: [
        { text: "Encourage brainstorming sessions and provide resources", score: 10 },
        { text: "Increase work hours to maximize output", score: 3 },
        { text: "Set minimal expectations to reduce stress", score: 5 },
      ],
    },
    {
      id: 18,
      title: "Sustainability Steward",
      description: "Your company wants to improve its sustainability practices. What initiatives do you propose?",
      options: [
        { text: "Implement recycling programs and reduce waste", score: 10 },
        { text: "Promote remote work to cut down on commuting", score: 8 },
        { text: "Focus on digital transformation without addressing physical sustainability", score: 5 },
      ],
    },
  ],
  7: [
    {
      id: 19,
      title: "Advanced Negotiation",
      description: "You’re negotiating a major contract with a key client. How do you approach it?",
      options: [
        { text: "Seek a win-win agreement by understanding the client's needs", score: 10 },
        { text: "Push for maximum benefits for your company", score: 5 },
        { text: "Agree to all terms to secure the deal quickly", score: 3 },
      ],
    },
    {
      id: 20,
      title: "Tech Integration",
      description: "Your company is integrating a new technology. How do you manage the transition?",
      options: [
        { text: "Provide comprehensive training and support to the team", score: 10 },
        { text: "Implement the technology without additional training", score: 3 },
        { text: "Delay integration to avoid disruption", score: 5 },
      ],
    },
    {
      id: 21,
      title: "Market Disruption",
      description: "A new competitor is disrupting your market. What’s your strategy?",
      options: [
        { text: "Innovate your offerings and enhance customer experience", score: 10 },
        { text: "Engage in a price war to outcompete them", score: 5 },
        { text: "Ignore the competitor and continue as usual", score: 2 },
      ],
    },
  ],
  8: [
    {
      id: 22,
      title: "Data-Driven Decisions",
      description: "You have access to vast amounts of data. How do you leverage it effectively?",
      options: [
        { text: "Analyze the data to inform strategic decisions", score: 10 },
        { text: "Use intuition instead of data for decisions", score: 3 },
        { text: "Share the data without proper analysis", score: 5 },
      ],
    },
    {
      id: 23,
      title: "Remote Team Leadership",
      description: "Your team is fully remote. How do you maintain productivity and engagement?",
      options: [
        { text: "Implement regular check-ins and virtual team-building activities", score: 10 },
        { text: "Monitor hours worked without focusing on outcomes", score: 5 },
        { text: "Allow complete autonomy without any communication", score: 2 },
      ],
    },
    {
      id: 24,
      title: "Customer-Centric Approach",
      description: "Feedback shows customers are unsatisfied with your service. What’s your next step?",
      options: [
        { text: "Revamp your customer service strategy based on feedback", score: 10 },
        { text: "Offer discounts to appease dissatisfied customers", score: 5 },
        { text: "Ignore the feedback and continue operations", score: 2 },
      ],
    },
  ],
  9: [
    {
      id: 25,
      title: "Personal Development",
      description: "You want to advance in your career. What’s your strategy?",
      options: [
        { text: "Pursue continuous learning and seek mentorship", score: 10 },
        { text: "Wait for opportunities to come your way", score: 5 },
        { text: "Focus solely on your current role without additional growth", score: 3 },
      ],
    },
    {
      id: 26,
      title: "Balancing Work and Life",
      description: "You’re feeling overwhelmed with work. How do you achieve better balance?",
      options: [
        { text: "Set clear boundaries and prioritize tasks", score: 10 },
        { text: "Work longer hours to get everything done", score: 3 },
        { text: "Take extended breaks without addressing workload", score: 5 },
      ],
    },
    {
      id: 27,
      title: "Mentorship Matters",
      description: "A junior team member seeks your mentorship. How do you respond?",
      options: [
        { text: "Provide guidance and support to help them grow", score: 10 },
        { text: "Agree reluctantly without offering much support", score: 5 },
        { text: "Decline to mentor due to time constraints", score: 2 },
      ],
    },
  ],
  10: [
    {
      id: 28,
      title: "Corporate Social Responsibility",
      description: "Your company wants to enhance its CSR initiatives. What actions do you take?",
      options: [
        { text: "Develop programs that align with company values and community needs", score: 10 },
        { text: "Choose CSR activities based on trends without alignment", score: 5 },
        { text: "Allocate minimal resources to CSR without strategic planning", score: 2 },
      ],
    },
    {
      id: 29,
      title: "Innovation Pipeline",
      description: "You need to maintain a steady flow of innovative ideas. How do you achieve this?",
      options: [
        { text: "Create a structured process for idea submission and evaluation", score: 10 },
        { text: "Rely on spontaneous ideas without a formal process", score: 5 },
        { text: "Restrict idea generation to senior team members only", score: 3 },
      ],
    },
    {
      id: 30,
      title: "Adaptive Leadership",
      description: "Unexpected changes disrupt your project plan. How do you lead your team through it?",
      options: [
        { text: "Adapt the plan and communicate changes effectively", score: 10 },
        { text: "Stick rigidly to the original plan despite changes", score: 3 },
        { text: "Delegate the problem without taking responsibility", score: 5 },
      ],
    },
  ],
};

// Expanded mini-game questions
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
    math: {
      id: "math",
      title: "Math Challenge",
      description: "What is the value of 7 * 8?",
      options: [
        { text: "54", correct: false },
        { text: "56", correct: true },
        { text: "58", correct: false },
      ],
    },
    trivia: {
      id: "trivia",
      title: "Trivia Time",
      description: "What is the capital of France?",
      options: [
        { text: "Berlin", correct: false },
        { text: "Madrid", correct: false },
        { text: "Paris", correct: true },
      ],
    },
    riddle: {
      id: "riddle",
      title: "Riddle Me This",
      description: "I speak without a mouth and hear without ears. What am I?",
      options: [
        { text: "An echo", correct: true },
        { text: "A shadow", correct: false },
        { text: "A reflection", correct: false },
      ],
    },
    pattern: {
      id: "pattern",
      title: "Pattern Recognition",
      description: "What comes next in the sequence: 2, 4, 8, 16, ?",
      options: [
        { text: "18", correct: false },
        { text: "24", correct: false },
        { text: "32", correct: true },
      ],
    },
    reaction: {
      id: "reaction",
      title: "Reaction Time",
      description: "Click the button as quickly as possible when it turns green.",
      options: [
        { text: "Button Clicked Quickly", correct: true },
        { text: "Button Clicked Slowly", correct: false },
        { text: "Button Not Clicked", correct: false },
      ],
    },
    wordScramble: {
      id: "wordScramble",
      title: "Word Scramble",
      description: "Unscramble the word: 'LEPAH'",
      options: [
        { text: "APPLE", correct: false },
        { text: "PEACH", correct: false },
        { text: "HELPA", correct: false },
      ],
    },
    sequence: {
      id: "sequence",
      title: "Sequence Solver",
      description: "What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ?",
      options: [
        { text: "12", correct: false },
        { text: "13", correct: true },
        { text: "11", correct: false },
      ],
    },
    spatial: {
      id: "spatial",
      title: "Spatial Reasoning",
      description: "Which shape completes the pattern?",
      options: [
        { text: "Circle", correct: false },
        { text: "Triangle", correct: true },
        { text: "Square", correct: false },
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
    const [usedMiniGames, setUsedMiniGames] = useState([]);
    const [selectedMiniGame, setSelectedMiniGame] = useState(null);
  
    const scenarios = levelScenarios[currentLevel];
    const maxProgress = scenarios.length;
    const totalLevels = Object.keys(levelScenarios).length;
  
    // Add to streak on component mount
    useEffect(() => {
      // Assuming dailyStreak logic is handled elsewhere or persistently
      setDailyStreak((prev) => prev + 1);
    }, []);
  
    const handleOptionClick = (optionScore) => {
      const newScore = score + optionScore;
      setScore(newScore);
      setProgress(progress + 1);
      setFeedback(`You earned ${optionScore} points!`);
  
      // Check for achievements
      if (newScore >= 50 && !achievements.includes("Score Master")) {
        setAchievements([...achievements, "Score Master"]);
        setFeedback("Achievement Unlocked: Score Master!");
      }
  
      // Proceed to next scenario or level
      if (currentScenarioIndex + 1 < scenarios.length) {
        setCurrentScenarioIndex(currentScenarioIndex + 1);
      } else if (currentLevel < totalLevels) {
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
        setScore((prevScore) => prevScore + 20);
        setMiniGameResult("Correct! Bonus 20 points!");
      } else {
        setMiniGameResult("Oops! That was incorrect.");
      }
    };
  
    const startMiniGame = () => {
      const availableMiniGames = Object.keys(miniGames).filter(
        (key) => !usedMiniGames.includes(key)
      );
  
      // If all mini-games have been used, reset the used list
      if (availableMiniGames.length === 0) {
        setUsedMiniGames([]);
        // Optionally, notify the user
        alert("All mini-games have been played. Starting the rotation anew!");
        return startMiniGame(); // Recursively call to select from all mini-games
      }
  
      // Select a random mini-game from available ones
      const randomIndex = Math.floor(Math.random() * availableMiniGames.length);
      const selectedKey = availableMiniGames[randomIndex];
      const selectedGame = miniGames[selectedKey];
  
      setSelectedMiniGame(selectedGame);
      setMiniGameActive(true);
      setMiniGameResult("");
  
      // Add the selected mini-game to the used list
      setUsedMiniGames([...usedMiniGames, selectedKey]);
    };
  
    const currentScenario = scenarios[currentScenarioIndex];
  
    return (
      <div className="game-container">
        <header className="game-header">
          <h1>MindVault Quest</h1>
          <div className="stats">
            <p>Score: {score}</p>
            <p>
              Level: {currentLevel} / {totalLevels}
            </p>
            <p>
              Progress: {progress} / {maxProgress}
            </p>
            <p>Daily Streak: {dailyStreak} Days</p>
          </div>
        </header>
        <main className="game-area">
          {!miniGameActive && (progress < maxProgress || currentLevel < totalLevels) ? (
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
          ) : miniGameActive && selectedMiniGame ? (
            <div className="mini-game">
              <h2>{selectedMiniGame.title}</h2>
              <p>{selectedMiniGame.description}</p>
              <div className="options">
                {selectedMiniGame.options.map((option, index) => (
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
                  setDailyStreak(1); // Reset streak or handle appropriately
                  setUsedMiniGames([]);
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