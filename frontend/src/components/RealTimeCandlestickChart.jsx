import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const RealTimeCandlestickChart = () => {
  const [series, setSeries] = useState([
    {
      data: [
        { x: new Date(), y: [10, 20, 5, 15] },
        { x: new Date(), y: [15, 25, 10, 20] },
      ],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prevSeries) => [
        {
          data: [
            ...prevSeries[0].data.slice(-9),
            { x: new Date(), y: [Math.random() * 50, Math.random() * 70, Math.random() * 30, Math.random() * 60] },
          ],
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Real-Time Candlestick Chart</h2>
      <Chart
        options={{
          chart: {
            type: "candlestick",
            animations: { enabled: true },
          },
          xaxis: { type: "datetime" },
        }}
        series={series}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default RealTimeCandlestickChart;
