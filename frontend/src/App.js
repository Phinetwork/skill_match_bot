import React from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OnboardingForm from "./components/OnboardingForm";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./auth/AuthContext";
import logo from "./assets/logo.png";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div className="app-container" style={styles.appContainer}>
      <Header />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const Home = () => {
  React.useEffect(() => {
    document.title = "Skyriz - Home";
  }, []);

  return (
    <div style={styles.homeContent}>
      <img src={logo} alt="Skyriz Logo" style={styles.logo} />
      <h1 style={styles.heading}>Welcome to Skyriz</h1>
      <p style={styles.paragraph}>
        Unlock personalized side hustle opportunities, master profitable skills, and build success-driven habits with an AI-powered platform that adapts to you.
      </p>
      <Link to="/register" style={styles.link}>
        Get Started
      </Link>
    </div>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    flex: 1, // Ensures main content takes up available space
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    background: "linear-gradient(135deg, #00274d, #00509e)",
    boxSizing: "border-box",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "1.5rem",
    color: "#f0f8ff",
    background: "linear-gradient(135deg, #00274d, #00509e)",
  },
  homeContent: {
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    padding: "10px",
  },
  logo: {
    height: "100px",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#f0f8ff",
    marginBottom: "20px",
  },
  paragraph: {
    fontSize: "1.2rem",
    color: "#e6f7ff",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  link: {
    display: "inline-block",
    padding: "15px 30px",
    backgroundColor: "#00aaff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default App;
