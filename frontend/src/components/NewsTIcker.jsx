import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Example API - Replace with a real economic news API
        const response = await axios.get(
          "https://api.marketaux.com/v1/entity/stats/intraday?group_by=symbol&sort=sentiment_avg&sort_order=desc&published_on=2024-12-10&api_token=IW9AujCPqHBiwJL13Xd4eQHfI2zUmYOwOEGW6F5p", 
          {
            params: {
              api_token: "IW9AujCPqHBiwJL13Xd4eQHfI2zUmYOwOEGW6F5p", // Replace with your API key
              language: "en",
              categories: "economy,markets",
            },
          }
        );

        const fetchedNews = response.data.data.map((item) => item.title);
        setNews(fetchedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews(["Unable to fetch news at the moment. Please try again later."]);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (news.length > 0 ? (prevIndex + 1) % news.length : 0));
    }, 5000); // Change news every 5 seconds

    return () => clearInterval(interval);
  }, [news]);

  return (
    <div style={{
      background: "#1e1e1e",
      color: "#ffffff",
      padding: "10px 20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      overflow: "hidden",
      whiteSpace: "nowrap",
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Economic News & Trends</h2>
      <marquee behavior="scroll" direction="left" style={{ fontSize: "1.2rem" }}>
        {news.length > 0 ? news[currentIndex] : "Loading latest economic trends..."}
      </marquee>
    </div>
  );
};

export default NewsTicker;
