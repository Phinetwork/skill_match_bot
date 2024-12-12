import React, { useEffect, useState } from "react";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryAxis } from "victory";
import axios from "axios";

const LiveTrendVisualizer = () => {
  const [trendData, setTrendData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [lineColor, setLineColor] = useState("#00ff00"); // Default green color for upward trend
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=SPY&interval=1min&apikey=QKGDOFMD8UDB86OD`
        );
        const timeSeries = response.data["Time Series (1min)"];
        if (!timeSeries) {
          throw new Error("Invalid API response");
        }

        const liveData = Object.entries(timeSeries)
          .slice(0, 10) // Fetch the last 10 minutes
          .reverse()
          .map(([time, data], index) => ({
            x: index + 1, // Seconds as x-axis
            y: parseFloat(data["4. close"]), // Close price
          }));

        const latestValue = liveData[liveData.length - 1]?.y || 0;
        const secondLatestValue = liveData[liveData.length - 2]?.y || 0;
        const rateOfChange = latestValue - secondLatestValue;

        // Predict 3 future values
        const predictions = Array.from({ length: 3 }, (_, i) => ({
          x: liveData.length + i + 1,
          y: latestValue + rateOfChange * (i + 1),
        }));

        setTrendData(liveData);
        setPredictedData(predictions);
        setLineColor(rateOfChange >= 0 ? "#00ff00" : "#ff0000"); // Green if up, red if down
        setLoading(false);
      } catch (error) {
        console.error("Error fetching live data:", error);
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p style={{ color: "#ffffff", textAlign: "center" }}>Loading real-time data...</p>;
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
        Real-Time Market Trends & Predictions
      </h2>
      <p
        style={{
          color: "#bbbbbb",
          textAlign: "center",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        This chart visualizes real-time market data and predicts future trends based on the current rate of change.
      </p>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        style={{ parent: { maxWidth: "100%" } }}
      >
        <VictoryAxis
          label="Seconds (relative)"
          style={{
            axis: { stroke: "#ffffff" },
            axisLabel: { fontSize: 12, fill: "#ffffff", padding: 30 },
            tickLabels: { fontSize: 10, fill: "#ffffff" },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Price ($)"
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
        <VictoryLine
          data={predictedData}
          x="x"
          y="y"
          style={{
            data: {
              stroke: "#ffa500",
              strokeDasharray: "5,5",
              strokeWidth: 2,
            },
          }}
          labels={({ datum }) => `Predicted: $${datum.y.toFixed(2)}`}
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: 10, fill: "#ffffff" }}
              flyoutStyle={{ fill: "#333", stroke: "#ffa500" }}
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
        "Stay informed with real-time and predictive insights."
      </p>
    </div>
  );
};

export default LiveTrendVisualizer;
