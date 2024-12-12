import React, { useState, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const generateData = () => {
  return Array.from({ length: 50 }, (_, index) => ({
    id: `Node-${index + 1}`,
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
    z: Math.random() * 100,
    info: `This is Node-${index + 1}. Decision Pathway: ${Math.floor(Math.random() * 10)}, Computational Depth: ${Math.floor(Math.random() * 10)}, Relevance Index: ${(Math.random() * 100).toFixed(2)}`,
  }));
};

const getColor = (value) => {
  if (value > 75) return "#ff4c4c"; // High intensity (red)
  if (value > 50) return "#ffa726"; // Medium intensity (orange)
  if (value > 25) return "#fff176"; // Low intensity (yellow)
  return "#66bb6a"; // Very low intensity (green)
};

const LiveHeatmap = () => {
  const [data, setData] = useState(generateData());
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData());
    }, 3000); // Update data every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const closeNodeInfo = () => {
    setSelectedNode(null);
  };

  return (
    <div
      className="heatmap-container"
      style={{
        background: "linear-gradient(to bottom right, #1c1c3c, #343454)",
        color: "#fff",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "15px",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "1.8rem",
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
        }}
      >
        Dynamic Neural Network
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart onClick={(e) => handleNodeClick(e.activePayload?.[0]?.payload)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            type="number"
            dataKey="x"
            name="Decision Pathway"
            tick={{ fill: "#aaa" }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Computational Depth"
            tick={{ fill: "#aaa" }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
          />
          <ZAxis
            type="number"
            dataKey="z"
            range={[0, 100]}
            name="Node Relevance Index"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e1e2e",
              border: "1px solid #444",
              borderRadius: "8px",
              color: "#fff",
            }}
            cursor={{ strokeDasharray: "3 3", stroke: "#999" }}
          />
          <Scatter name="Node ID" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p
        style={{
          textAlign: "center",
          marginTop: "15px",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "1rem",
          color: "#bbb",
        }}
      >
        Each point represents a neural node's decision pathway, computational depth, and relevance index.
      </p>
      {selectedNode && (
        <div
          style={{
            background: "#1e1e2e",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            marginTop: "20px",
            maxWidth: "300px",
            position: "fixed",
            left: "10%",
            right: "10%",
            top: "30%",
            color: "#fff",
            zIndex: 1000,
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#ff4c4c",
              border: "none",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={closeNodeInfo}
          >
            X
          </button>
          <h3>Node Information</h3>
          <p><strong>ID:</strong> {selectedNode.id}</p>
          <p><strong>Decision Pathway:</strong> {selectedNode.x}</p>
          <p><strong>Computational Depth:</strong> {selectedNode.y}</p>
          <p><strong>Relevance Index:</strong> {selectedNode.z.toFixed(2)}</p>
          <p><strong>Details:</strong> {selectedNode.info}</p>
        </div>
      )}
    </div>
  );
};

export default LiveHeatmap;
