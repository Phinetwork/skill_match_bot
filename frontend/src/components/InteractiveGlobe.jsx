import React, { useEffect, useState } from "react";
import Globe from "react-globe.gl";

const InteractiveGlobe = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    // Fetch real-world data points (e.g., population, GDP, or events)
    const fetchData = async () => {
      const data = await fetch("https://search.worldbank.org/api/v3/wds?format=json&qterm=economic+indicators&fl=count,docdt,display_title,url,repnme&fct=count_exact&rows=50") // Replace with a real API
        .then((response) => response.json())
        .catch((error) => console.error("Error fetching data:", error));

      if (data && data.points) {
        setPoints(
          data.points.map((point) => ({
            lat: point.latitude,
            lng: point.longitude,
            size: point.metric / 100, // Adjust size based on a metric
            color: point.metric > 50 ? "#FF5733" : "#33FF57", // Conditional coloring
            label: `${point.name} - Metric: ${point.metric}`, // Tooltip information
          }))
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        height: "600px",
        border: "1px solid #ddd",
        borderRadius: "15px",
        overflow: "hidden",
      }}
    >
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        pointsData={points}
        pointAltitude={(point) => point.size / 10}
        pointColor={(point) => point.color}
        pointLabel={(point) => `${point.label}`}
        pointRadius={(point) => point.size / 50}
        showAtmosphere={true}
        atmosphereColor="#3A9BFF"
        atmosphereAltitude={0.25}
        onPointClick={(point) => {
          alert(`Clicked on: ${point.label}`); // Interaction feedback
        }}
        htmlElementsData={points}
        htmlElement={(point) => {
          const el = document.createElement("div");
          el.innerHTML = `<div style='background-color: ${point.color}; padding: 5px; border-radius: 5px;'>${point.label}</div>`;
          return el;
        }}
      />
    </div>
  );
};

export default InteractiveGlobe;
