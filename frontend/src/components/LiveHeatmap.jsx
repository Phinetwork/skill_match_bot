import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const generateRandomData = () => {
  return Array.from({ length: 50 }, () => ({
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
    z: Math.random() * 100,
  }));
};

const getColor = (value) => {
  if (value > 75) return "#ff0000"; // High intensity
  if (value > 50) return "#ffa500"; // Medium intensity
  if (value > 25) return "#ffff00"; // Low intensity
  return "#00ff00"; // Very low intensity
};

const LiveHeatmap = () => {
  const [data, setData] = useState(generateRandomData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateRandomData());
    }, 2000); // Update data every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="heatmap-container" style={{ padding: "20px", background: "#1e1e1e", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis type="number" dataKey="x" name="Longitude" stroke="#ffffff" />
          <YAxis type="number" dataKey="y" name="Latitude" stroke="#ffffff" />
          <ZAxis type="number" dataKey="z" range={[0, 100]} name="Intensity" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#333", borderRadius: "5px", color: "#fff" }} />
          <Scatter name="Heat Points" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveHeatmap;
