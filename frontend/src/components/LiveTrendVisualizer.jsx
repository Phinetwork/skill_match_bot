import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryAxis } from "victory";

const LiveTrendVisualizer = () => {
  const [trendData, setTrendData] = useState([]);
  const [lineColor, setLineColor] = useState("#00ff00"); // Default green color for upward trend
  const [startTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendData((prevData) => {
        const secondsElapsed = Math.floor((new Date() - startTime) / 1000);
        const newPoint = { x: secondsElapsed, y: Math.random() * 100 };
        const previousY = prevData.length > 0 ? prevData[prevData.length - 1].y : 0;

        // Update line color based on trend
        setLineColor(newPoint.y >= previousY ? "#00ff00" : "#ff0000"); // Green if up, red if down

        return [...prevData.slice(-9), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

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
          marginBottom: "20px",
        }}
      >
        AI Global Trend Detector
      </h2>
      <p
        style={{
          color: "#bbbbbb",
          textAlign: "center",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        This chart visualizes random trend data updated in real-time. The X-axis represents seconds elapsed, while the Y-axis shows the trend value.
      </p>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        style={{ parent: { maxWidth: "100%" } }}
      >
        <VictoryAxis
          label="Seconds Elapsed"
          style={{
            axis: { stroke: "#ffffff" },
            axisLabel: { fontSize: 12, fill: "#ffffff", padding: 30 },
            tickLabels: { fontSize: 10, fill: "#ffffff" },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Trend Value"
          style={{
            axis: { stroke: "#ffffff" },
            axisLabel: { fontSize: 12, fill: "#ffffff", padding: 40 },
            tickLabels: { fontSize: 10, fill: "#ffffff" },
          }}
        />
        <VictoryLine
          data={trendData}
          x="x"
          y="y"
          style={{
            data: {
              stroke: lineColor,
              strokeWidth: 3,
            },
          }}
          animate={{ duration: 500, onLoad: { duration: 1000 } }}
          labels={({ datum }) => `${datum.y.toFixed(2)}`}
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: 10, fill: "#ffffff" }}
              flyoutStyle={{ fill: "#333", stroke: lineColor }}
            />
          }
        />
      </VictoryChart>
      <p
        style={{
          color: "#ffffff",
          textAlign: "center",
          marginTop: "10px",
          fontSize: "14px",
          fontStyle: "italic",
        }}
      >
        "Stay ahead of the trends with real-time data visualization."
      </p>
    </div>
  );
};

export default LiveTrendVisualizer;
