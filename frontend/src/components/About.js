import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-heading">About Skyriz</h1>
        <p className="about-text">
          Welcome to <span className="highlight">Skyriz</span>, your
          personal guide to discovering exciting side hustles, developing
          valuable skills, and forming habits for success. Whether you're
          looking to supplement your income, turn your passion into a business,
          or grow personally and professionally, we've got you covered.
        </p>

        <h2 className="about-subheading">What We Do</h2>
        <p className="about-text">
          At Skyriz, we use advanced AI technology to match your
          unique skills and interests with side hustle opportunities tailored
          just for you. Our platform doesn’t just stop there – we also provide
          you with recommendations for skills to develop and habits to adopt,
          ensuring your long-term success and growth.
        </p>

        <h2 className="about-subheading">Our Mission</h2>
        <p className="about-text">
          Our mission is simple: to empower individuals to reach their fullest
          potential by providing personalized recommendations that drive
          growth, productivity, and success. We believe that everyone has the
          potential to achieve greatness, and we’re here to help you unlock
          yours.
        </p>

        <h2 className="about-subheading">Why Choose Us?</h2>
        <ul className="about-list">
          <li>
            <span className="list-icon">✔</span> Tailored recommendations for
            your unique skills and interests.
          </li>
          <li>
            <span className="list-icon">✔</span> Easy-to-use platform powered by
            cutting-edge AI technology.
          </li>
          <li>
            <span className="list-icon">✔</span> A comprehensive approach to
            personal and professional growth.
          </li>
          <li>
            <span className="list-icon">✔</span> Accessible anytime, anywhere –
            on desktop or mobile.
          </li>
        </ul>

        <h2 className="about-subheading">Get Started Today</h2>
        <p className="about-text">
          Ready to take the next step in your journey? Click the "Get Started"
          button on the homepage and see how Skyriz can transform your
          skills, interests, and habits into meaningful opportunities.
        </p>
      </div>
    </div>
  );
};

export default About;
