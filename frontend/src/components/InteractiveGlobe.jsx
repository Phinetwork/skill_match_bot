import React, { useEffect, useState } from "react";
import Globe from "react-globe.gl";

const InteractiveGlobe = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    // Generate random data points for visualization
    const generateData = () => {
      return Array.from({ length: 50 }, () => ({
        lat: -90 + Math.random() * 180, // Latitude range: -90 to 90
        lng: -180 + Math.random() * 360, // Longitude range: -180 to 180
        size: Math.random() * 10 + 1, // Size of the marker
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
        label: `Data Point - ${Math.floor(Math.random() * 100)}`, // Label for tooltip
      }));
    };

    setPoints(generateData());
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
      />
    </div>
  );
};

export default InteractiveGlobe;
