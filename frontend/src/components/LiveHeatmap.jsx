import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = Array.from({ length: 50 }, () => ({
  x: Math.floor(Math.random() * 10),
  y: Math.floor(Math.random() * 10),
  z: Math.random() * 100,
}));

const getColor = (value) => {
  if (value > 75) return "#ff0000"; // High intensity
  if (value > 50) return "#ffa500"; // Medium intensity
  if (value > 25) return "#ffff00"; // Low intensity
  return "#00ff00"; // Very low intensity
};

const LiveHeatmap = () => {
  return (
    <div className="heatmap-container">
      <h2>Live Heatmap</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="Longitude" />
          <YAxis type="number" dataKey="y" name="Latitude" />
          <ZAxis type="number" dataKey="z" range={[0, 100]} name="Intensity" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
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
