import React from "react";
import "./Services.css"; // Add a CSS file for styling the Services page

const Services = () => {
  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Explore how Skyriz can help you achieve your goals.</p>
      </div>
      <div className="services-content">
        <div className="service-card">
          <h2>Side Hustle Matching</h2>
          <p>
            Discover the perfect side hustle tailored to your skills and interests.
            Our platform uses advanced AI to provide you with personalized
            recommendations that align with your goals.
          </p>
        </div>
        <div className="service-card">
          <h2>Skill Development</h2>
          <p>
            Gain insights into the most in-demand skills in your field. We offer
            a curated list of skills to help you grow personally and
            professionally.
          </p>
        </div>
        <div className="service-card">
          <h2>Habit Recommendations</h2>
          <p>
            Build productive habits that lead to long-term success. Our platform
            suggests habits to help you stay consistent and achieve your goals
            faster.
          </p>
        </div>
        <div className="service-card">
          <h2>Career Growth Insights</h2>
          <p>
            Stay ahead of industry trends with our insights and resources. We
            provide tools to help you grow your career and unlock new
            opportunities.
          </p>
        </div>
        <div className="service-card">
          <h2>Community Support</h2>
          <p>
            Join a network of like-minded individuals. Our platform fosters a
            supportive community where you can connect, learn, and grow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
