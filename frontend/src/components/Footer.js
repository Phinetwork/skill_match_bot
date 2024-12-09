// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Add CSS for styling the footer

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
