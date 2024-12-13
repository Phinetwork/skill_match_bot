import React, { useEffect, useState } from "react";
import Globe from "react-globe.gl";

const InteractiveGlobe = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async (location) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } else {
          return { lat: 0, lng: 0 }; // Default to (0,0) if no coordinates found
        }
      } catch (error) {
        console.error(`Error fetching coordinates for ${location}:`, error);
        return { lat: 0, lng: 0 };
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://search.worldbank.org/api/v3/wds?format=json&qterm=economic+indicators&fl=count,docdt,display_title,url,repnme&fct=count_exact&rows=50"
        );
        const data = await response.json();

        if (data && data.documents) {
          const mappedPoints = await Promise.all(
            Object.values(data.documents).map(async (item) => {
              const coordinates = await fetchCoordinates(item.count || "World");
              return {
                lat: coordinates.lat,
                lng: coordinates.lng,
                size: Math.random() * 1.5 + 1, // Randomize size for visibility
                color: "#33FF57", // Default color for all points
                label: `${item.display_title || "Unknown Title"}`
              };
            })
          );

          setPoints(mappedPoints);
        } else {
          console.error("Unexpected API response structure.", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
          alert(`Clicked on: ${point.label}`);
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
