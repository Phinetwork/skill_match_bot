import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryAxis } from "victory";
import axios from "axios";

const LiveTrendVisualizer = () => {
  const [trendData, setTrendData] = useState([]);
  const [lineColor, setLineColor] = useState("#00ff00"); // Default green color for upward trend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://yahoo-finance166.p.rapidapi.com/api/market/get-world-indices",
          {
            headers: {
              "x-rapidapi-host": "yahoo-finance166.p.rapidapi.com",
              "x-rapidapi-key": "52dd3cb0d2msh8a5d0daa5ff2079p1c6689jsna0d2f66f3083",
            },
            params: {
              region: "US",
              language: "en-US",
            },
          }
        );

        const indices = response.data.finance.result[0].quotes; // Extract the indices data
        const liveData = indices.map((index, i) => ({
          x: i + 1, // Sequential number
          y: index.regularMarketPrice.raw, // Use market price
          name: index.shortName, // Use index name
        }));

        const latestValue = liveData[liveData.length - 1]?.y || 0;
        const secondLatestValue = liveData[liveData.length - 2]?.y || 0;
        const rateOfChange = latestValue - secondLatestValue;

        // Predict 3 future values based on the rate of change
        const predictions = Array.from({ length: 3 }, (_, i) => ({
          x: liveData.length + i + 1,
          y: latestValue + rateOfChange * (i + 1),
        }));

        setTrendData([...liveData, ...predictions]);
        setLineColor(rateOfChange >= 0 ? "#00ff00" : "#ff0000"); // Green if up, red if down
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 86400000); // Refresh once a day
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p style={{ color: "#ffffff", textAlign: "center" }}>Loading real-time data...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

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
        World Indices Live Trends & Predictions
      </h2>
      <p
        style={{
          color: "#bbbbbb",
          textAlign: "center",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        Visualizing real-time trends of global indices with predictive insights.
      </p>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        style={{ parent: { maxWidth: "100%" } }}
      >
        <VictoryAxis
          label="Indices"
          style={{
            axis: { stroke: "#ffffff" },
            axisLabel: { fontSize: 12, fill: "#ffffff", padding: 30 },
            tickLabels: { fontSize: 10, fill: "#ffffff" },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Market Price ($)"
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
        "Track live trends and predict the future of global indices."
      </p>
    </div>
  );
};

export default LiveTrendVisualizer;
