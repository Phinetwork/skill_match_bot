import React from "react";
import Tree from "react-d3-tree";

const decisionTreeData = {
  name: "AI Decision",
  attributes: { description: "Root decision point for AI operations" },
  children: [
    {
      name: "Input Data",
      attributes: { description: "Raw input processed by AI" },
      children: [
        {
          name: "Preprocessing",
          attributes: { description: "Preparing data for model ingestion" },
          children: [
            { name: "Normalization", attributes: { description: "Scaling data to a common range" } },
            { name: "Feature Extraction", attributes: { description: "Identifying key data attributes" } },
          ],
        },
        {
          name: "Model Selection",
          attributes: { description: "Choosing the best AI model" },
          children: [
            { name: "Linear Regression", attributes: { description: "Simple prediction model" } },
            { name: "Neural Network", attributes: { description: "Complex layered model" } },
          ],
        },
      ],
    },
    {
      name: "Output",
      attributes: { description: "Results generated by AI" },
      children: [
        { name: "Prediction", attributes: { description: "Forecasting based on data" } },
        { name: "Confidence Score", attributes: { description: "Reliability of prediction" } },
      ],
    },
  ],
};

const containerStyles = {
  width: "100%",
  height: "500px",
  border: "1px solid #ddd",
  borderRadius: "15px",
  padding: "20px",
  background: "linear-gradient(to bottom right, #1c1c3c, #343454)",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.5)",
  position: "relative",
  overflow: "hidden",
};

const titleStyles = {
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "1.8rem",
  color: "#fff",
  marginBottom: "15px",
  textShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)",
};

const AI_DecisionTreeVisualizer = () => {
  const handleNodeClick = (nodeData) => {
    alert(`Node: ${nodeData.name}\nDescription: ${nodeData.attributes.description}`);
  };

  return (
    <div style={containerStyles}>
      <h2 style={titleStyles}>AI Decision Tree Visualizer</h2>
      <Tree
        data={decisionTreeData}
        translate={{ x: 300, y: 250 }}
        orientation="vertical"
        zoomable
        scaleExtent={{ min: 0.5, max: 2 }}
        nodeSize={{ x: 200, y: 150 }}
        onClick={handleNodeClick}
        styles={{
          links: {
            stroke: "#007BFF",
            strokeWidth: 2,
            transition: "stroke 0.3s, stroke-width 0.3s",
          },
          nodes: {
            node: {
              circle: { fill: "#007BFF", stroke: "#0056b3", strokeWidth: 2 },
              name: { fill: "#fff", fontSize: "1rem", fontFamily: "Roboto, sans-serif" },
              attributes: { fill: "#ccc", fontSize: "0.8rem", fontFamily: "Roboto, sans-serif" },
            },
            leafNode: {
              circle: { fill: "#28A745", stroke: "#1e7e34", strokeWidth: 2 },
              name: { fill: "#fff", fontSize: "1rem", fontFamily: "Roboto, sans-serif" },
              attributes: { fill: "#ccc", fontSize: "0.8rem", fontFamily: "Roboto, sans-serif" },
            },
          },
        }}
      />
    </div>
  );
};

export default AI_DecisionTreeVisualizer;
