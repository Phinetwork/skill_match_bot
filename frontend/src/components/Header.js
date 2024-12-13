import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext"; // Updated to use the 'auth' folder
import "./Header.css";
import logo from "../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu after logout
    navigate("/"); // Redirect to the homepage or login page after logout
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <img src={logo} alt="Skill Match Bot Logo" />
            </Link>
          ) : (
            <Link to="/">
              <img src={logo} alt="Skill Match Bot Logo" />
            </Link>
          )}
        </div>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          <ul>
            {/* Links visible only to logged-out users */}
            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" onClick={() => setIsMenuOpen(false)}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="https://skyriz.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Development Community
                  </a>
                </li>
                <li>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* Links visible only to logged-in users */}
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/onboarding" onClick={() => setIsMenuOpen(false)}>
                    SkillMatch AI
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="logout-btn"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "inherit",
                      fontSize: "inherit",
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
