import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip } from "victory";

const LiveTrendVisualizer = () => {
  const [trendData, setTrendData] = useState([]);
  const [lineColor, setLineColor] = useState("#00ff00"); // Default green color for upward trend

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendData((prevData) => {
        const newPoint = { x: new Date(), y: Math.random() * 100 };
        const previousY = prevData.length > 0 ? prevData[prevData.length - 1].y : 0;

        // Update line color based on trend
        setLineColor(newPoint.y >= previousY ? "#00ff00" : "#ff0000"); // Green if up, red if down

        return [...prevData.slice(-9), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        marginTop: "20px",
        backgroundColor: "#1e1e2f",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          marginBottom: "10px",
        }}
      >
        AI Global Trend Detector
      </h2>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryLine
          data={trendData}
          x="x"
          y="y"
          style={{
            data: {
              stroke: lineColor,
              strokeWidth: 3,
              transition: "stroke 0.3s ease-in-out", // Smooth transition for color changes
            },
            parent: { border: "1px solid #ccc" },
          }}
          animate={{ duration: 500, onLoad: { duration: 1000 } }}
          labels={({ datum }) => `${datum.y.toFixed(2)}`}
          labelComponent={<VictoryTooltip style={{ fontSize: 10, fill: "#ffffff" }} flyoutStyle={{ fill: "#333" }} />}
        />
      </VictoryChart>
    </div>
  );
};

export default LiveTrendVisualizer;
