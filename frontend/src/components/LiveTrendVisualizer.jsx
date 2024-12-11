import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory";

const LiveTrendVisualizer = () => {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendData((prevData) => {
        const newPoint = { x: new Date(), y: Math.random() * 100 };
        return [...prevData.slice(-9), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>AI Global Trend Tracker</h2>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine
          data={trendData}
          x="x"
          y="y"
          style={{
            data: { stroke: "#00ff00" },
            parent: { border: "1px solid #ccc" },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default LiveTrendVisualizer;
