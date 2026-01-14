
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteAuth } from '../contexts/WebsiteAuthContext';

function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useWebsiteAuth();
  const [localError, setLocalError] = useState('');

  const handleKeycloakLogin = async () => {
    setLocalError('');
    const result = await login();
    if (!result.success) {
      setLocalError(result.error || 'Login failed');
    }
  };

  const divStyle = { 
    padding: "40px", 
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    color: "#667eea",
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
    backgroundColor: "#667eea",
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
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <div style={divStyle}>
      <div style={mainCardStyle}>
        <div style={brandLogoStyle}>prodify</div>
        <h2 style={titleStyle}>Welcome Back</h2>
        <p style={subtitleStyle}>Sign in to your account</p>

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
          onClick={handleKeycloakLogin}
          disabled={loading}
          style={keycloakButtonStyle}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#5a6fd6';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#667eea';
          }}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Sign in with Keycloak
            </>
          )}
        </button>

        <p style={{ marginTop: "25px", fontSize: "14px", color: "#666" }}>
          Don't have an account?{' '}
          <span style={linkStyle} onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>

        <p style={{ marginTop: "15px", fontSize: "12px", color: "#999" }}>
          By signing in, you agree to our{' '}
          <a href="#" style={{ color: "#667eea" }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: "#667eea" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

