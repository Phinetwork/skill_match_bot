import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import "./MazeGame.css";

// Maze dimensions and cell size
const GRID_SIZE = 10;
const CELL_SIZE = 50;

// Utility function to generate a random maze
const generateMaze = (rows, cols) => {
  const maze = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      maze[i][j] = Math.random() > 0.75 ? 1 : 0; // 1 = wall, 0 = path
    }
  }

  // Ensure starting and ending points are open
  maze[0][0] = 0;
  maze[rows - 1][cols - 1] = 0;
  return maze;
};

// A* Pathfinding Algorithm
const findPath = (maze, start, end) => {
  const [startX, startY] = start;
  const [endX, endY] = end;

  const isWalkable = (x, y) =>
    x >= 0 &&
    y >= 0 &&
    x < maze.length &&
    y < maze[0].length &&
    maze[y][x] === 0;

  const heuristic = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

  const openSet = [[startX, startY]];
  const cameFrom = {};
  const gScore = { [`${startX},${startY}`]: 0 };
  const fScore = { [`${startX},${startY}`]: heuristic([startX, startY], [endX, endY]) };

  while (openSet.length > 0) {
    let current = openSet.reduce((a, b) =>
      fScore[`${a[0]},${a[1]}`] < fScore[`${b[0]},${b[1]}`] ? a : b
    );

    if (current[0] === endX && current[1] === endY) {
      const path = [];
      while (`${current[0]},${current[1]}` in cameFrom) {
        path.unshift(current);
        current = cameFrom[`${current[0]},${current[1]}`];
      }
      return path;
    }

    openSet.splice(openSet.indexOf(current), 1);

    const neighbors = [
      [current[0] - 1, current[1]],
      [current[0] + 1, current[1]],
      [current[0], current[1] - 1],
      [current[0], current[1] + 1],
    ];

    neighbors.forEach((neighbor) => {
      const [x, y] = neighbor;
      if (!isWalkable(x, y)) return;

      const tentativeGScore = gScore[`${current[0]},${current[1]}`] + 1;

      if (tentativeGScore < (gScore[`${x},${y}`] || Infinity)) {
        cameFrom[`${x},${y}`] = current;
        gScore[`${x},${y}`] = tentativeGScore;
        fScore[`${x},${y}`] = tentativeGScore + heuristic([x, y], [endX, endY]);
        if (!openSet.some(([ox, oy]) => ox === x && oy === y)) {
          openSet.push(neighbor);
        }
      }
    });
  }

  return [];
};

const MazeGame = () => {
  const [maze, setMaze] = useState(generateMaze(GRID_SIZE, GRID_SIZE));
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [enemyPosition, setEnemyPosition] = useState({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const collectibles = useRef([]);
  const powerUps = useRef([]);
  const traps = useRef([]);

  // Generate random collectibles, power-ups, and traps
  useEffect(() => {
    const items = [];
    const powers = [];
    const trapList = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
      powers.push({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
      trapList.push({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    }
    collectibles.current = items;
    powerUps.current = powers;
    traps.current = trapList;
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enemy movement
  useEffect(() => {
    const interval = setInterval(() => {
      const path = findPath(maze, [enemyPosition.x, enemyPosition.y], [playerPosition.x, playerPosition.y]);
      if (path.length > 0) {
        const nextMove = path[0];
        setEnemyPosition({ x: nextMove[0], y: nextMove[1] });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [maze, playerPosition, enemyPosition]);

  // Handle player movement
  const handleKeyDown = (e) => {
    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;

    if (e.key === "ArrowUp" && y > 0 && maze[y - 1][x] === 0) newY -= 1;
    if (e.key === "ArrowDown" && y < GRID_SIZE - 1 && maze[y + 1][x] === 0) newY += 1;
    if (e.key === "ArrowLeft" && x > 0 && maze[y][x - 1] === 0) newX -= 1;
    if (e.key === "ArrowRight" && x < GRID_SIZE - 1 && maze[y][x + 1] === 0) newX += 1;

    setPlayerPosition({ x: newX, y: newY });

    // Check for collectibles, power-ups, or traps
    const itemIndex = collectibles.current.findIndex((item) => item.x === newX && item.y === newY);
    if (itemIndex !== -1) {
      collectibles.current.splice(itemIndex, 1);
      setScore(score + 10);
    }

    const powerIndex = powerUps.current.findIndex((power) => power.x === newX && power.y === newY);
    if (powerIndex !== -1) {
      powerUps.current.splice(powerIndex, 1);
      setScore(score + 20); // Example: Power-up increases score
    }

    const trapIndex = traps.current.findIndex((trap) => trap.x === newX && trap.y === newY);
    if (trapIndex !== -1) {
      traps.current.splice(trapIndex, 1);
      setScore(score - 10); // Example: Trap decreases score
    }
  };

  // Add event listener for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, maze]);

  return (
    <div className="maze-container">
      <h1>Maze Explorer</h1>
      <p>Score: {score}</p>
      <p>Time Left: {timeLeft}s</p>
      <Stage width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
        <Layer>
          {/* Render Maze */}
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * CELL_SIZE}
                y={rowIndex * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={cell === 1 ? "black" : "white"}
                stroke="gray"
              />
            ))
          )}

          {/* Render Player */}
          <Circle
            x={playerPosition.x * CELL_SIZE + CELL_SIZE / 2}
            y={playerPosition.y * CELL_SIZE + CELL_SIZE / 2}
            radius={CELL_SIZE / 3}
            fill="blue"
          />

          {/* Render Enemy */}
          <Circle
            x={enemyPosition.x * CELL_SIZE + CELL_SIZE / 2}
            y={enemyPosition.y * CELL_SIZE + CELL_SIZE / 2}
            radius={CELL_SIZE / 3}
            fill="red"
          />

          {/* Render Collectibles */}
          {collectibles.current.map((item, index) => (
            <Circle
              key={index}
              x={item.x * CELL_SIZE + CELL_SIZE / 2}
              y={item.y * CELL_SIZE + CELL_SIZE / 2}
              radius={CELL_SIZE / 4}
              fill="gold"
            />
          ))}

          {/* Render Power-Ups */}
          {powerUps.current.map((power, index) => (
            <Rect
              key={index}
              x={power.x * CELL_SIZE}
              y={power.y * CELL_SIZE}
              width={CELL_SIZE / 2}
              height={CELL_SIZE / 2}
              fill="green"
            />
          ))}

          {/* Render Traps */}
          {traps.current.map((trap, index) => (
            <Rect
              key={index}
              x={trap.x * CELL_SIZE}
              y={trap.y * CELL_SIZE}
              width={CELL_SIZE / 2}
              height={CELL_SIZE / 2}
              fill="purple"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default MazeGame;
