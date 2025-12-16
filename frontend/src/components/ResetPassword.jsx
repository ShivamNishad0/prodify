import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

/**
 * ⚛️ ResetPassword Component
 * Allows users to reset their password using a token from email
 */

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validToken, setValidToken] = useState(true);

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
    minHeight: "500px", 
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

  const validateToken = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'temp' }), // Temporary password just to validate token
      });

      // If we get a specific error about invalid token, mark as invalid
      if (response.status === 400) {
        const data = await response.json();
        if (data.msg.includes('Invalid or expired')) {
          setValidToken(false);
          setError('This password reset link is invalid or has expired.');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setValidToken(false);
      setError('Invalid reset link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5001/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setPassword('');
        setConfirmPassword('');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.msg || 'An error occurred');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  if (!validToken) {
    return (
      <div style={divStyle}>
        <div style={mainCardStyle}>
          <div style={brandLogoStyle}>prodify</div>
          
          <h2 style={{color:"#c62828", textAlign:"center", marginBottom:"10px"}}>Invalid Link</h2>
          <p style={{textAlign: "center", marginBottom: "30px", fontSize: "14px", color: "#666"}}>
            This password reset link is invalid or has expired.
          </p>
          
          <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #ffcdd2',
              textAlign: 'center'
          }}>
            {error}
          </div>

          <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
          >
              Request New Reset Link
          </button>

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

  return (
    <div style={divStyle}>
      <div style={mainCardStyle}>
        <div style={brandLogoStyle}>prodify</div>
        
        <h2 style={{color:"#333", textAlign:"center", marginBottom:"10px"}}>Set New Password</h2>
        <p style={{textAlign: "center", marginBottom: "30px", fontSize: "14px", color: "#666"}}>
            Enter your new password below.
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
            <label htmlFor="password">New Password</label>
            <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="Enter new password"
                required
                disabled={loading}
                minLength="6"
            />

            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="Confirm new password"
                required
                disabled={loading}
                minLength="6"
            />

            <button 
                type="submit" 
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
