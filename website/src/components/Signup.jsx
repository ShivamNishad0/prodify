
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteAuth } from '../contexts/WebsiteAuthContext';

function Signup() {
  const navigate = useNavigate();
  const { register, loading, error } = useWebsiteAuth();
  const [localError, setLocalError] = useState('');

  const handleKeycloakRegister = async () => {
    setLocalError('');
    const result = await register();
    if (!result.success) {
      setLocalError(result.error || 'Registration failed');
    }
  };

  const divStyle = { 
    padding: "40px", 
    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    minHeight: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
  };

  const mainCardStyle = {
    background: "white", 
    width: "100%", 
    maxWidth: "450px", 
    padding: "40px", 
    borderRadius: "20px", 
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)", 
    textAlign: "center",
  };

  const brandLogoStyle = {
    fontSize: "32px",
    fontWeight: "900",
    color: "#11998e",
    marginBottom: "10px",
  };

  const titleStyle = {
    color: "#333",
    marginBottom: "10px",
    fontSize: "28px",
  };

  const subtitleStyle = {
    color: "#666",
    marginBottom: "30px",
    fontSize: "16px",
  };

  const keycloakButtonStyle = {
    width: "100%",
    padding: "16px",
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#11998e",
    border: "none",
    borderRadius: "12px",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const linkStyle = {
    color: "#11998e",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <div style={divStyle}>
      <div style={mainCardStyle}>
        <div style={brandLogoStyle}>prodify</div>
        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Join our community today</p>

        {(error || localError) && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #ffcdd2'
          }}>
            {error || localError}
          </div>
        )}

        <button
          onClick={handleKeycloakRegister}
          disabled={loading}
          style={keycloakButtonStyle}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#0e8775';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#11998e';
          }}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Sign up with Keycloak
            </>
          )}
        </button>

        <p style={{ marginTop: "25px", fontSize: "14px", color: "#666" }}>
          Already have an account?{' '}
          <span style={linkStyle} onClick={() => navigate('/login')}>
            Sign In
          </span>
        </p>

        <p style={{ marginTop: "15px", fontSize: "12px", color: "#999" }}>
          By signing up, you agree to our{' '}
          <a href="#" style={{ color: "#11998e" }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: "#11998e" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;

