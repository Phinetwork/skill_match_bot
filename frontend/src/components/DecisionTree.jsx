import React from "react";
import Tree from "react-d3-tree";

const decisionTreeData = {
  name: "AI Decision",
  children: [
    {
      name: "Input Data",
      children: [
        {
          name: "Preprocessing",
          children: [
            { name: "Normalization" },
            { name: "Feature Extraction" },
          ],
        },
        {
          name: "Model Selection",
          children: [
            { name: "Linear Regression" },
            { name: "Neural Network" },
          ],
        },
      ],
    },
    {
      name: "Output",
      children: [
        { name: "Prediction" },
        { name: "Confidence Score" },
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
  background: "linear-gradient(to bottom right, #f0f4f8, #e8edf3)",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
  position: "relative",
  overflow: "hidden",
};

const titleStyles = {
  textAlign: "center",
  fontFamily: "Roboto, sans-serif",
  fontSize: "1.8rem",
  color: "#333",
  marginBottom: "15px",
  textShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
};

const linkStyles = {
  links: {
    stroke: "#007BFF",
    strokeWidth: 2,
    transition: "stroke 0.3s, stroke-width 0.3s",
  },
  hoveredLinks: {
    stroke: "#0056b3",
    strokeWidth: 3,
  },
};

const nodeStyles = {
  node: { circle: { fill: "#007BFF", stroke: "#0056b3", strokeWidth: 2 } },
  leafNode: { circle: { fill: "#28A745", stroke: "#1e7e34", strokeWidth: 2 } },
  hoveredNode: { circle: { fill: "#0056b3", stroke: "#003f73" } },
  hoveredLeafNode: { circle: { fill: "#1e7e34", stroke: "#155d27" } },
};

const tooltipStyles = {
  backgroundColor: "#fff",
  color: "#333",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  fontFamily: "Roboto, sans-serif",
  fontSize: "0.9rem",
};

const AI_DecisionTreeVisualizer = () => {
  return (
    <div style={containerStyles}>
      <h2 style={titleStyles}>AI Decision Tree Visualizer</h2>
      <Tree
        data={decisionTreeData}
        translate={{ x: 250, y: 250 }}
        orientation="vertical"
        styles={{
          links: linkStyles.links,
          nodes: {
            node: nodeStyles.node,
            leafNode: nodeStyles.leafNode,
          },
        }}
      />
    </div>
  );
};

export default AI_DecisionTreeVisualizer;
