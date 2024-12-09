import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
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
        <Link to="/"> {/* Use Link for routing */}
          <img src={logo} alt="Skill Match Bot Logo" />
        </Link>
      </div>
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        ☰
      </button>
      <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/">Home</Link> {/* Use Link for internal navigation */}
          </li>
          <li>
            <Link to="/about">About</Link> {/* Use Link for internal navigation */}
          </li>
          <li>
            <Link to="/services">Services</Link> {/* Use Link for internal navigation */}
          </li>
          <li>
            <Link to="/contact">Contact</Link> {/* Use Link for internal navigation */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
