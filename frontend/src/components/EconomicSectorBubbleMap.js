import React, { useState, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./EconomicSectorBubbleMap.css";

const EconomicSectorBubbleMap = () => {
  const [data, setData] = useState([]);

  // Generate random data for sectors
  const generateData = () => {
    const sectors = [
      "Technology", "Healthcare", "Finance", "Energy", "Consumer Goods", 
      "Utilities", "Real Estate", "Industrials", "Materials", "Communication Services"
    ];
    return sectors.map((sector) => ({
      sector,
      growth: Math.floor(Math.random() * 100), // X-axis: Growth
      risk: Math.floor(Math.random() * 100),   // Y-axis: Risk
      size: Math.floor(Math.random() * 50) + 20, // Bubble size
    }));
  };

  // Update data dynamically every 5 seconds
  useEffect(() => {
    setData(generateData());
    const interval = setInterval(() => {
      setData(generateData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="economic-sector-bubble-map">
      <h2>Economic Sector Performance</h2>
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          style={{ backgroundColor: "#1e293b", borderRadius: "10px", padding: "20px" }}
        >
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="growth"
            name="Growth (%)"
            tick={{ fill: "#00d4ff" }}
            label={{ value: "Growth (%)", position: "insideBottomRight", fill: "#00d4ff", offset: 10 }}
          />
          <YAxis
            type="number"
            dataKey="risk"
            name="Risk (%)"
            tick={{ fill: "#00d4ff" }}
            label={{ value: "Risk (%)", angle: -90, position: "insideLeft", fill: "#00d4ff", offset: -10 }}
          />
          <ZAxis dataKey="size" range={[100, 400]} name="Size" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{ backgroundColor: "#1e3c72", borderRadius: "10px", color: "#f0f8ff" }}
          />
          <Scatter
            name="Economic Sectors"
            data={data}
            fill="#00d4ff"
            fillOpacity={0.7}
            stroke="#00509e"
            strokeWidth={2}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EconomicSectorBubbleMap;
