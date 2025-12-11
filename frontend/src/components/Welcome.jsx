import { Link } from "react-router-dom";
import { useState } from "react";

function Welcome() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const containerStyle = {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #3cb2a8 0%, #2a8d85 100%)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
    marginTop:"-10px",
    marginLeft:"-10px",
    marginBottom:"-10px",
    marginRight:"-10px",
    padding: 0,
  };

  const circleStyle = (size, top, bottom, left, right, delay) => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    top,
    bottom,
    left,
    right,
    animation: `float 20s infinite ease-in-out ${delay}s`,
  });

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 40px",
    position: "relative",
    zIndex: 10,
  };

  const logoStyle = {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    margin: 0,
  };

  const navStyle = {
    position: "absolute",
    left: "70%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "40px",
  };

  const linkStyle = (linkName) => ({
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
    position: "relative",
    padding: "5px 0",
    transition: "all 0.3s ease",
    transform: hoveredLink === linkName ? "translateY(-2px)" : "translateY(0)",
  });

  const linkUnderlineStyle = (linkName) => ({
    content: "",
    position: "absolute",
    bottom: "0",
    left: "0",
    width: hoveredLink === linkName ? "100%" : "0",
    height: "2px",
    background: "#fff",
    transition: "width 0.3s ease",
  });

  const authButtonsStyle = {
    display: "flex",
    gap: "15px",
  };

  const buttonStyle = (buttonName) => ({
    padding: "12px 28px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    background: "#fff",
    color: "#3cb2a8",
    boxShadow:
      hoveredButton === buttonName
        ? "0 6px 20px rgba(0, 0, 0, 0.3)"
        : "0 4px 15px rgba(0, 0, 0, 0.2)",
    transform:
      hoveredButton === buttonName ? "translateY(-3px)" : "translateY(0)",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
    position: "relative",
    overflow: "hidden",
  });

  const mainStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 5,
  };

  const h1Style = {
    fontSize: "72px",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "1.2",
    textShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
    margin: 0,
    animation: "fadeInUp 1s ease-out",
  };

  const subtitleStyle = {
    fontSize: "20px",
    marginTop: "20px",
    opacity: 0.95,
    fontWeight: "400",
    animation: "fadeInUp 1.2s ease-out",
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, 30px) scale(1.1); }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .nav-links {
              display: none !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Animated Background Circles */}
        <div style={circleStyle("300px", "-100px", null, null, "-100px", 0)} />
        <div style={circleStyle("200px", null, "-50px", "-50px", null, 5)} />
        <div style={circleStyle("150px", "50%", null, null, "10%", 10)} />
        <div style={circleStyle("300px", "-50px", "-50px", "-50px", null, 5)} />

        {/* Header */}
        <header style={headerStyle}>
          <h3 style={logoStyle}>prodify</h3>

          <nav style={navStyle} className="nav-links">
            <Link
              to="/"
              style={linkStyle("home")}
              onMouseEnter={() => setHoveredLink("home")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Home
              <span style={linkUnderlineStyle("home")} />
            </Link>
            <Link
              to="/about"
              style={linkStyle("about")}
              onMouseEnter={() => setHoveredLink("about")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              About
              <span style={linkUnderlineStyle("about")} />
            </Link>
            <Link
              to="/contact"
              style={linkStyle("contact")}
              onMouseEnter={() => setHoveredLink("contact")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Contact
              <span style={linkUnderlineStyle("contact")} />
            </Link>
          </nav>

          <div style={authButtonsStyle}>
            <Link
              to="/login"
              style={buttonStyle("signin")}
              onMouseEnter={() => setHoveredButton("signin")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={buttonStyle("signup")}
              onMouseEnter={() => setHoveredButton("signup")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main style={mainStyle}>
          <h1 style={h1Style}>
            Welcome to <br /> prodify
          </h1>
          <p style={subtitleStyle}>Boost your productivity with ease</p>
        </main>
      </div>
    </>
  );
}

export default Welcome;