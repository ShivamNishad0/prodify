import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

/**
 * ⚛️ ForgotPassword Component
 * Allows users to request a password reset via email
 */

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- Inline Styles ---
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
    width: "500px", 
    minHeight: "400px", 
    padding: "40px", 
    borderRadius: "20px", 
    boxShadow: "0 8px 32px 0 rgba(60, 178, 168, 0.2)", 
    display: "flex", 
    flexDirection: "column",
    justifyContent: "center",
  };

  const brandLogoStyle = {
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "20px",
    color: "#3cb2a8",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "8px 0 20px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxSizing: "border-box", 
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%", 
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

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: "14px",
    color: "#3cb2a8",
    textDecoration: "none",
    cursor: "pointer",
    padding: 0,
    textAlign: "center",
    marginTop: "20px",
  };

  // Hover effect simulation
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "#2a8a81";
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#3cb2a8";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.msg);
        setEmail('');
      } else {
        setError(data.msg || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={divStyle}>
      <div style={mainCardStyle}>
        <div style={brandLogoStyle}>prodify</div>
        
        <h2 style={{color:"#333", textAlign:"center", marginBottom:"10px"}}>Reset Password</h2>
        <p style={{textAlign: "center", marginBottom: "30px", fontSize: "14px", color: "#666"}}>
            Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {/* Success Message */}
        {message && (
            <div style={{
                backgroundColor: '#e8f5e8',
                color: '#2e7d32',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #c8e6c9',
                textAlign: 'center'
            }}>
                {message}
            </div>
        )}

        {/* Error Message */}
        {error && (
            <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                border: '1px solid #ffcdd2'
            }}>
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="you@example.com"
                required
                disabled={loading}
            />

            <button 
                type="submit" 
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>

        <button 
            type="button"
            onClick={() => navigate('/login')}
            style={linkButtonStyle}
        >
            Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
