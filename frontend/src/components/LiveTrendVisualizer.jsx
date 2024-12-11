import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from "victory";

const LiveTrendVisualizer = () => {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendData((prevData) => {
        const newPoint = { x: new Date(), y: Math.random() * 100 };
        return [...prevData.slice(-29), newPoint]; // Keep the last 30 points for smooth visualization
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        background: "#1e1e1e",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2 style={{ color: "#ffffff", textAlign: "center", marginBottom: "20px" }}>AI Trend Visualizer</h2>
      <VictoryChart
        theme={VictoryTheme.material}
        style={{ parent: { background: "#1e1e1e" } }}
        animate={{ duration: 500 }}
      >
        <VictoryAxis
          tickFormat={(t) => `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`}
          style={{
            axis: { stroke: "#ffffff" },
            tickLabels: { fill: "#ffffff", fontSize: 10 },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#ffffff" },
            tickLabels: { fill: "#ffffff", fontSize: 10 },
          }}
        />
        <VictoryLine
          data={trendData}
          x="x"
          y="y"
          style={{
            data: { stroke: "#00ff00", strokeWidth: 2 },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default LiveTrendVisualizer;
