import React, { useEffect, useState } from "react";
import Globe from "react-globe.gl";
import "./InteractiveGlobe.css"; // Import the CSS file

const countryCoordinates = {
  "Afghanistan": { "lat": 34.533333, "lng": 69.166667 },
  "Albania": { "lat": 41.3275, "lng": 19.818889 },
  "Algeria": { "lat": 36.753889, "lng": 3.058889 },
  "Andorra": { "lat": 42.506317, "lng": 1.521835 },
  "Angola": { "lat": -8.838333, "lng": 13.234444 },
  "Antigua and Barbuda": { "lat": 17.119444, "lng": -61.843056 },
  "Argentina": { "lat": -34.603722, "lng": -58.381592 },
  "Armenia": { "lat": 40.179186, "lng": 44.499103 },
  "Australia": { "lat": -35.282, "lng": 149.128684 },
  "Austria": { "lat": 48.208333, "lng": 16.373056 },
  "Azerbaijan": { "lat": 40.409264, "lng": 49.867092 },
  "Bahamas": { "lat": 25.044333, "lng": -77.350400 },
  "Bahrain": { "lat": 26.2235, "lng": 50.5876 },
  "Bangladesh": { "lat": 23.7104, "lng": 90.40744 },
  "Barbados": { "lat": 13.106, "lng": -59.632 },
  "Belarus": { "lat": 53.904541, "lng": 27.561523 },
  "Belgium": { "lat": 50.850346, "lng": 4.351721 },
  "Belize": { "lat": 17.25, "lng": -88.766667 },
  "Benin": { "lat": 6.496857, "lng": 2.628852 },
  "Bhutan": { "lat": 27.471222, "lng": 89.636889 },
  "Bolivia": { "lat": -16.489689, "lng": -68.119294 },
  "Bosnia and Herzegovina": { "lat": 43.856259, "lng": 18.413076 },
  "Botswana": { "lat": -24.628208, "lng": 25.923147 },
  "Brazil": { "lat": -15.793889, "lng": -47.882778 },
  "Brunei": { "lat": 4.9031, "lng": 114.9398 },
  "Bulgaria": { "lat": 42.6977, "lng": 23.3219 },
  "Burkina Faso": { "lat": 12.371428, "lng": -1.519660 },
  "Burundi": { "lat": -3.375, "lng": 29.36 },
  "Cabo Verde": { "lat": 14.933050, "lng": -23.513327 },
  "Cambodia": { "lat": 11.544873, "lng": 104.892167 },
  "Cameroon": { "lat": 3.848033, "lng": 11.502075 },
  "Canada": { "lat": 45.421530, "lng": -75.697193 },
  "Central African Republic": { "lat": 4.394674, "lng": 18.558189 },
  "Chad": { "lat": 12.134845, "lng": 15.055741 },
  "Chile": { "lat": -33.448890, "lng": -70.669265 },
  "China": { "lat": 39.904211, "lng": 116.407395 },
  "Colombia": { "lat": 4.7110, "lng": -74.0721 },
  "Comoros": { "lat": -11.698956, "lng": 43.255058 },
  "Costa Rica": { "lat": 9.934739, "lng": -84.087502 },
  "Côte d'Ivoire": { "lat": 6.827623, "lng": -5.289343 },
  "Croatia": { "lat": 45.815399, "lng": 15.966568 },
  "Cuba": { "lat": 23.135305, "lng": -82.358963 },
  "Cyprus": { "lat": 35.185566, "lng": 33.382276 },
  "Czech Republic": { "lat": 50.075538, "lng": 14.437800 },
  "Democratic Republic of the Congo": { "lat": -4.3175, "lng": 15.3139 },
  "Denmark": { "lat": 55.676098, "lng": 12.568337 },
  "Djibouti": { "lat": 11.572077, "lng": 43.145647 },
  "Dominica": { "lat": 15.309168, "lng": -61.379355 },
  "Dominican Republic": { "lat": 18.476389, "lng": -69.893333 },
  "Ecuador": { "lat": -0.180653, "lng": -78.467838 },
  "Egypt": { "lat": 30.044420, "lng": 31.235712 },
  "El Salvador": { "lat": 13.692940, "lng": -89.218191 },
  "Equatorial Guinea": { "lat": 3.750412, "lng": 8.737104 },
  "Eritrea": { "lat": 15.322877, "lng": 38.925052 },
  "Estonia": { "lat": 59.4370, "lng": 24.7536 },
  "Eswatini": { "lat": -26.305448, "lng": 31.136672 },
  "Ethiopia": { "lat": 8.980603, "lng": 38.757761 },
  "Federated States of Micronesia": { "lat": 6.916667, "lng": 158.15 },
  "Fiji": { "lat": -18.1248, "lng": 178.4501 },
  "Finland": { "lat": 60.1699, "lng": 24.9384 },
  "France": { "lat": 48.856613, "lng": 2.352222 },
  "Gabon": { "lat": 0.416198, "lng": 9.467268 },
  "Gambia": { "lat": 13.454876, "lng": -16.579032 },
  "Georgia": { "lat": 41.7151, "lng": 44.8271 },
  "Germany": { "lat": 52.520007, "lng": 13.404954 },
  "Ghana": { "lat": 5.603717, "lng": -0.186964 },
  "Greece": { "lat": 37.983810, "lng": 23.727539 },
  "Grenada": { "lat": 12.056098, "lng": -61.748800 },
  "Guatemala": { "lat": 14.634915, "lng": -90.506882 },
  "Guinea": { "lat": 9.509167, "lng": -13.712222 },
  "Guinea-Bissau": { "lat": 11.863333, "lng": -15.597222 },
  "Guyana": { "lat": 6.804606, "lng": -58.155271 },
  "Haiti": { "lat": 18.594395, "lng": -72.307433 },
  "Honduras": { "lat": 14.072275, "lng": -87.192136 },
  "Hungary": { "lat": 47.497913, "lng": 19.040236 },
  "Iceland": { "lat": 64.1466, "lng": -21.9426 },
  "India": { "lat": 28.613939, "lng": 77.209021 },
  "Indonesia": { "lat": -6.208763, "lng": 106.845599 },
  "Iran": { "lat": 35.689198, "lng": 51.388974 },
  "Iraq": { "lat": 33.312805, "lng": 44.361488 },
  "Ireland": { "lat": 53.349805, "lng": -6.260310 },
  "Israel": { "lat": 31.768319, "lng": 35.213710 },
  "Italy": { "lat": 41.902784, "lng": 12.496366 },
  "Jamaica": { "lat": 18.0180, "lng": -76.7436 },
  "Japan": { "lat": 35.689487, "lng": 139.691711 },
  "Jordan": { "lat": 31.953949, "lng": 35.910635 },
  "Kazakhstan": { "lat": 51.1605, "lng": 71.4704 },
  "Kenya": { "lat": -1.292066, "lng": 36.821945 },
  "Kiribati": { "lat": 1.3278, "lng": 173.0089 },
  "Kosovo": { "lat": 42.662914, "lng": 21.165503 },
  "Kuwait": { "lat": 29.375859, "lng": 47.977405 },
  "Kyrgyzstan": { "lat": 42.874621, "lng": 74.569761 },
  "Laos": { "lat": 17.975706, "lng": 102.633103 },
  "Latvia": { "lat": 56.949649, "lng": 24.105186 },
  "Lebanon": { "lat": 33.893791, "lng": 35.501778 },
  "Lesotho": { "lat": -29.316667, "lng": 27.483333 },
  "Liberia": { "lat": 6.310556, "lng": -10.804722 },
  "Libya": { "lat": 32.887209, "lng": 13.191338 },
  "Liechtenstein": { "lat": 47.141511, "lng": 9.52154 },
  "Lithuania": { "lat": 54.687157, "lng": 25.279652 },
  "Luxembourg": { "lat": 49.6116, "lng": 6.1319 },
  "Madagascar": { "lat": -18.879190, "lng": 47.507905 },
  "Malawi": { "lat": -13.962612, "lng": 33.774119 },
  "Malaysia": { "lat": 3.139003, "lng": 101.686855 },
  "Maldives": { "lat": 4.175496, "lng": 73.509347 },
  "Mali": { "lat": 12.639232, "lng": -8.002889 },
  "Malta": { "lat": 35.897778, "lng": 14.5125 },
  "Marshall Islands": { "lat": 7.0897, "lng": 171.3805 },
  "Mauritania": { "lat": 18.0790, "lng": -15.9650 },
  "Mauritius": { "lat": -20.160891, "lng": 57.501222 },
  "Mexico": { "lat": 19.432608, "lng": -99.133209 },
  "Moldova": { "lat": 47.0105, "lng": 28.8638 },
  "Monaco": { "lat": 43.738417, "lng": 7.424616 },
  "Mongolia": { "lat": 47.916667, "lng": 106.916667 },
  "Montenegro": { "lat": 42.430420, "lng": 19.259364 },
  "Morocco": { "lat": 34.024, "lng": -6.822 },
  "Mozambique": { "lat": -25.9686, "lng": 32.5804 },
  "Myanmar": { "lat": 19.763306, "lng": 96.078510 },
  "Namibia": { "lat": -22.560881, "lng": 17.065755 },
  "Nauru": { "lat": -0.5477, "lng": 166.9209 },
  "Nepal": { "lat": 27.717245, "lng": 85.323960 },
  "Netherlands": { "lat": 52.3676, "lng": 4.9041 },
  "New Zealand": { "lat": -41.28664, "lng": 174.77557 },
  "Nicaragua": { "lat": 12.114993, "lng": -86.236174 },
  "Niger": { "lat": 13.511598, "lng": 2.125385 },
  "Nigeria": { "lat": 9.076479, "lng": 7.398574 },
  "North Korea": { "lat": 39.039219, "lng": 125.762524 },
  "North Macedonia": { "lat": 41.9965, "lng": 21.4314 },
  "Norway": { "lat": 59.913869, "lng": 10.752245 },
  "Oman": { "lat": 23.5880, "lng": 58.3829 },
  "Pakistan": { "lat": 33.729388, "lng": 73.093146 },
  "Palau": { "lat": 7.5000, "lng": 134.6243 },
  "Panama": { "lat": 8.983333, "lng": -79.516667 },
  "Papua New Guinea": { "lat": -9.4438, "lng": 147.1803 },
  "Paraguay": { "lat": -25.282, "lng": -57.6359 },
  "Peru": { "lat": -12.046374, "lng": -77.042793 },
  "Philippines": { "lat": 14.599512, "lng": 120.984222 },
  "Poland": { "lat": 52.229676, "lng": 21.012229 },
  "Portugal": { "lat": 38.722252, "lng": -9.139337 },
  "Qatar": { "lat": 25.285447, "lng": 51.531040 },
  "Republic of the Congo": { "lat": -4.263360, "lng": 15.242885 },
  "Romania": { "lat": 44.426767, "lng": 26.102538 },
  "Russia": { "lat": 55.755826, "lng": 37.617300 },
  "Rwanda": { "lat": -1.944072, "lng": 30.061885 },
  "Saint Kitts and Nevis": { "lat": 17.302606, "lng": -62.717692 },
  "Saint Lucia": { "lat": 14.010109, "lng": -60.987469 },
  "Saint Vincent and the Grenadines": { "lat": 13.160025, "lng": -61.224816 },
  "Samoa": { "lat": -13.8333, "lng": -171.7667 },
  "San Marino": { "lat": 43.935591, "lng": 12.447998 },
  "Sao Tome and Principe": { "lat": 0.33654, "lng": 6.72732 },
  "Saudi Arabia": { "lat": 24.713552, "lng": 46.675296 },
  "Senegal": { "lat": 14.716677, "lng": -17.467686 },
  "Serbia": { "lat": 44.7866, "lng": 20.4489 },
  "Seychelles": { "lat": -4.619143, "lng": 55.451315 },
  "Sierra Leone": { "lat": 8.465676, "lng": -13.231722 },
  "Singapore": { "lat": 1.352083, "lng": 103.819836 },
  "Slovakia": { "lat": 48.148598, "lng": 17.107748 },
  "Slovenia": { "lat": 46.056946, "lng": 14.505751 },
  "Solomon Islands": { "lat": -9.428, "lng": 159.949 },
  "Somalia": { "lat": 2.046934, "lng": 45.318161 },
  "South Africa": { "lat": -25.746111, "lng": 28.188056 },
  "South Korea": { "lat": 37.566535, "lng": 126.977969 },
  "South Sudan": { "lat": 4.859363, "lng": 31.571251 },
  "Spain": { "lat": 40.416775, "lng": -3.703790 },
  "Sri Lanka": { "lat": 6.927079, "lng": 79.861244 },
  "Sudan": { "lat": 15.500654, "lng": 32.559899 },
  "Suriname": { "lat": 5.852036, "lng": -55.203828 },
  "Sweden": { "lat": 59.329323, "lng": 18.068581 },
  "Switzerland": { "lat": 46.947974, "lng": 7.447447 },
  "Syria": { "lat": 33.513807, "lng": 36.276528 },
  "Taiwan": { "lat": 25.032969, "lng": 121.565418 },
  "Tajikistan": { "lat": 38.559772, "lng": 68.787038 },
  "Tanzania": { "lat": -6.792354, "lng": 39.208328 },
  "Thailand": { "lat": 13.756331, "lng": 100.501765 },
  "Timor-Leste": { "lat": -8.556856, "lng": 125.560314 },
  "Togo": { "lat": 6.131944, "lng": 1.222778 },
  "Tonga": { "lat": -21.139342, "lng": -175.201808 },
  "Trinidad and Tobago": { "lat": 10.6520, "lng": -61.5167 },
  "Tunisia": { "lat": 36.806389, "lng": 10.181667 },
  "Turkey": { "lat": 39.92077, "lng": 32.85411 },
  "Turkmenistan": { "lat": 37.960077, "lng": 58.326063 },
  "Tuvalu": { "lat": -8.5243, "lng": 179.1942 },
  "Uganda": { "lat": 0.347596, "lng": 32.582520 },
  "Ukraine": { "lat": 50.4501, "lng": 30.5234 },
  "United Arab Emirates": { "lat": 24.453884, "lng": 54.377343 },
  "United Kingdom": { "lat": 51.507351, "lng": -0.127758 },
  "United States of America": { "lat": 38.907192, "lng": -77.036871 },
  "Uruguay": { "lat": -34.901112, "lng": -56.164532 },
  "Uzbekistan": { "lat": 41.311158, "lng": 69.279737 },
  "Vanuatu": { "lat": -17.733251, "lng": 168.327325 },
  "Vatican City": { "lat": 41.902916, "lng": 12.453389 },
  "Venezuela": { "lat": 10.491016, "lng": -66.902496 },
  "Vietnam": { "lat": 21.027763, "lng": 105.834160 },
  "Yemen": { "lat": 15.369445, "lng": 44.191007 },
  "Zambia": { "lat": -15.387526, "lng": 28.322817 },
  "Zimbabwe": { "lat": -17.825165, "lng": 31.03351 }
};

const InteractiveGlobe = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://search.worldbank.org/api/v3/wds?format=json&qterm=economic+indicators&fl=count,docdt,display_title,pdfurl"
        );
        const data = await response.json();

        if (data && data.documents) {
          const transformedPoints = Object.values(data.documents)
            .filter((doc) => doc.count && countryCoordinates[doc.count]) 
            .map((doc) => {
              const { lat, lng } = countryCoordinates[doc.count];
              return {
                lat,
                lng,
                size: 5,
                color: "#33FF57",
                label: `${doc.display_title} (${doc.count})`,
                url: doc.pdfurl,
              };
            });

          setPoints(transformedPoints);
        }
      } catch (error) {
        console.error("Error fetching World Bank data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="globe-container">
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
          if (point.url) window.open(point.url, "_blank");
        }}
        htmlElementsData={points}
        htmlElement={(point) => {
          const el = document.createElement("div");
          el.className = "globe-tooltip";
          el.innerHTML = `
            <div class="tooltip-content">
              <strong>${point.label}</strong>
            </div>`;
          return el;
        }}
      />
    </div>
  );
};

export default InteractiveGlobe;
