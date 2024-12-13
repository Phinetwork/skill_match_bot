// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Ensure this path is correct based on your project structure
// Importing social media icons from React Icons
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} <a href="https://skyriz.org" className="footer-link" target="_blank" rel="noopener noreferrer">Skyriz</a>. All rights reserved.
      </p>
      
      {/* Optional: Social Media Links */}
      <div className="social-links">
        <a href="https://twitter.com/skyriz" aria-label="Skyriz Twitter" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://facebook.com/skyriz" aria-label="Skyriz Facebook" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a href="https://instagram.com/skyriz" aria-label="Skyriz Instagram" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com/company/skyriz" aria-label="Skyriz LinkedIn" target="_blank" rel="noopener noreferrer">
          <FaLinkedinIn />
        </a>
        {/* Add more social links as needed */}
      </div>
    </footer>
  );
};

export default Footer;
