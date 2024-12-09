import React, { useState } from "react";
import "./Header.css"; // Add CSS for styling the header
import logo from "../assets/logo.png"; // Adjust path to your logo file

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="Skill Match Bot Logo" />
        </a>
      </div>
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        ☰
      </button>
      <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
