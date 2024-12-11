// src/components/Footer.js
import React, { useContext } from 'react';
import './Footer.css'; // Add CSS for styling the footer

const Footer = ({ isLoggedIn, userProgress, userActivity }) => {
  return (
    <footer className="footer">
      {isLoggedIn ? (
        <div className="footer-logged-in">
          <div className="progress-container">
            <h4>Your Progress</h4>
            <div className="circular-progress">
              <svg className="progress-ring" width="100" height="100">
                <circle
                  className="progress-ring-circle"
                  stroke="gold"
                  strokeWidth="4"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${(1 - userProgress / 100) * 2 * Math.PI * 45}`,
                  }}
                />
              </svg>
              <span className="progress-percent">{userProgress}%</span>
            </div>
            <p>Goal Completion</p>
          </div>
          <div className="activity-feed">
            <h4>Recent Activity</h4>
            <ul>
              {userActivity.slice(0, 3).map((activity, index) => (
                <li key={index} className="activity-item">
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="footer-logged-out">
          <h4>Unlock Your Potential</h4>
          <p>Log in to track your progress, earn badges, and find your perfect side hustle!</p>
          <button className="login-button">Log In</button>
        </div>
      )}
      <p>&copy; {new Date().getFullYear()} Skill Match Bot. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
