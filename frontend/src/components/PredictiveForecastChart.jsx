import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const PredictiveForecastChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure two digits
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two digits
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentDate = getCurrentDate();
      try {
        const response = await axios.get(
          `https://api.polygon.io/v1/open-close/SPY/${currentDate}?adjusted=true&apiKey=Ecn37sRvNngNI1FqfCyQCx3FJoUWuuqh`
        );

        const data = response.data;

        if (!data || !data.close) {
          throw new Error("Invalid API response");
        }

        const labels = ["Open", "High", "Low", "Close"];
        const prices = [data.open, data.high, data.low, data.close];

        setChartData({
          labels,
          datasets: [
            {
              label: "SPY Prices",
              data: prices,
              borderColor: "#007BFF",
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              fill: true,
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
