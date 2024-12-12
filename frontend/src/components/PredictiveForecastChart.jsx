import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PredictiveForecastChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=QKGDOFMD8UDB86OD`
        );

        const timeSeries = response.data["Time Series (Daily)"];

        if (!timeSeries) {
          throw new Error("Invalid API response");
        }

        const labels = Object.keys(timeSeries).slice(0, 30).reverse(); // Last 30 days
        const data = labels.map((date) => parseFloat(timeSeries[date]["4. close"]));

        // Generate predictive data based on the last value (mock data)
        const predictiveData = data.map((value, index) =>
          value + Math.sin(index / 2) * 2 + Math.random() * 2 - 1 // Simulated trend
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Historical Data",
              data,
              borderColor: "#007BFF",
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Predictive Trend",
              data: predictiveData,
              borderColor: "#28A745",
              backgroundColor: "rgba(40, 167, 69, 0.2)",
              fill: true,
              borderDash: [5, 5],
              tension: 0.4,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1e1e2f",
        borderRadius: "15px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.5)",
        color: "#fff",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontFamily: "Roboto, sans-serif",
          fontSize: "1.8rem",
          color: "#fff",
          textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
        }}
      >
        Predictive Forecast Chart
      </h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#fff",
                font: { size: 14 },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw;
                  return `Value: $${value.toFixed(2)}`;
                },
              },
              backgroundColor: "#333",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#444",
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#aaa",
              },
              grid: {
                color: "#444",
              },
            },
            y: {
              ticks: {
                color: "#aaa",
                callback: (value) => `$${value}`,
              },
              grid: {
                color: "#444",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PredictiveForecastChart;
