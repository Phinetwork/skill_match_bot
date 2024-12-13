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
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=R3OLRU46W8XZFG9R`
        );

        const timeSeries = response.data["Time Series (Daily)"];

        if (!timeSeries) {
          throw new Error("Invalid API response");
        }

        // Get the last 30 days of data
        const labels = Object.keys(timeSeries).slice(0, 30).reverse();
        const data = labels.map((date) => parseFloat(timeSeries[date]["4. close"]));

        // Calculate predictions based on the rate of change
        const lastValue = data[data.length - 1];
        const secondLastValue = data[data.length - 2];
        const rateOfChange = lastValue - secondLastValue;

        const futureDates = [];
        const futureValues = [];
        let currentDate = new Date(labels[labels.length - 1]);

        for (let i = 1; i <= 3; i++) {
          currentDate.setDate(currentDate.getDate() + 1);
          futureDates.push(currentDate.toLocaleDateString());
          futureValues.push(lastValue + rateOfChange * i);
        }

        // Combine historical and predictive data
        setChartData({
          labels: [...labels, ...futureDates],
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
              data: [...data, ...futureValues],
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
