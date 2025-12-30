
import React from 'react';
import { useNavigate } from "react-router-dom";

/**
 * ⚛️ Signup Component (Two-Column Layout with Admin-Only Notice)
 * * This component now shows that account creation is admin-only.
 */

function Signup() {
  const navigate = useNavigate();
  
  // Redirect to login page
  const handleGoToLogin = () => {
    navigate("/login");
  };

  // --- Inline Styles (Retained from the original two-column layout) ---

  const divStyle = { 
    padding: "40px", 
    background:"rgba(101, 98, 98, 0.23)", 
    height:"100vh", 
    display:"flex", 
    justifyContent:"center", 
    alignItems:"center", 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
    margin:"-10px",
  };

  const mainCardStyle = {
    background: "white", 
    width: "1200px", 
    minHeight: "600px", 
    padding: "0", 
    borderRadius: "20px", 
    boxShadow: "0 8px 32px 0 rgba(60, 178, 168, 0.2)", 
    display: "flex", 
    overflow: "hidden", 
  };

  const leftColumnStyle = {
    flex: 1, 
    background: "#3cb2a8", 
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", 
    color: "white",
  };

  const rightColumnStyle = {
    width: "400px", 
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
  };
  
  const brandLogoStyle = {
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "40px",
  };

  const buttonStyle = {
    width: "100%", // Full width for form
    padding: "15px",
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#3cb2a8",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };
  
  // Hover effect simulation
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "#2a8a81";
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#3cb2a8";
  };

  const warningIconStyle = {
    fontSize: "48px",
    marginBottom: "20px",
    color: "#ff9800"
  };

  return (
    <div style={divStyle}>
      <div style={mainCardStyle}>

        {/* 🎨 Left Column: Signup Design/Branding */}
        <div style={leftColumnStyle}>
            <div style={brandLogoStyle}>prodify</div>
            
            <div>
                <h1>Account Creation</h1>
                <p>Account creation is now restricted to administrators only for enhanced security and proper access control.</p>
            </div>

            <p style={{fontSize: "12px", opacity: 0.8}}>© 2025 prodify. All rights reserved.</p>
        </div>

        {/* 🔐 Right Column: Admin-Only Notice */}
        <div style={rightColumnStyle}>
            <div style={warningIconStyle}>⚠️</div>
            
            <h2 style={{color:"#3cb2a8", marginBottom:"10px"}}>Admin-Only Access</h2>

            <p style={{marginBottom: "30px", fontSize: "14px", color: "#666", lineHeight: "1.6"}}>
                Public registration has been disabled. Only administrators can create new user accounts in the system.
            </p>
            
            <div style={{
              backgroundColor: '#fff3e0',
              color: '#e65100',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '30px',
              fontSize: '14px',
              border: '1px solid #ffcc02'
            }}>
              <strong>Need an account?</strong><br/>
              Please contact your system administrator to request account creation.
            </div>
            
            {/* Login Button */}
            <button 
                style={buttonStyle}
                onClick={handleGoToLogin}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                Go to Login
            </button>
            
            <p style={{textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666"}}>
                Already have credentials? <a href="/login" style={{color: "#3cb2a8", textDecoration: "none"}}>Login here</a>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;