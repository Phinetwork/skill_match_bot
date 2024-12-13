import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import './PredictiveForecastChart.css';

const PredictiveForecastChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://finnhub.io/api/v1/quote?symbol=SPY&token=ctdo4f9r01qng9gf2tm0ctdo4f9r01qng9gf2tmg"
        );

        const data = response.data;

        if (!data || !data.c) {
          throw new Error("Invalid API response");
        }

        const labels = ["Open", "High", "Low", "Current"];
        const prices = [data.o, data.h, data.l, data.c];

        // Calculate predictions based on a simple mock rate of change
        const lastValue = data.c;
        const secondLastValue = (data.o + data.l) / 2; 
        const rateOfChange = lastValue - secondLastValue;

        const futureLabels = ["Day +1", "Day +2", "Day +3"];
        const futureValues = futureLabels.map((_, i) => lastValue + rateOfChange * (i + 1));

        setChartData({
          labels: [...labels, ...futureLabels],
          datasets: [
            {
              label: "Historical & Current SPY Prices",
              data: [...prices, null, null, null], // Keep future slots null to separate datasets visually
              borderColor: "#00afff",
              backgroundColor: "rgba(0, 175, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Predicted Prices",
              data: [null, null, null, data.c, ...futureValues],
              borderColor: "#ff9900",
              backgroundColor: "rgba(255, 153, 0, 0.2)",
              fill: true,
              tension: 0.4,
              borderDash: [5, 5], // Dashed line for predictions
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
    return <p className="chart-loading">Loading...</p>;
  }

  if (error) {
    return <p className="chart-error">{error}</p>;
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">Predictive Forecast Chart</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
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
                  if (value === null) return ""; 
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
