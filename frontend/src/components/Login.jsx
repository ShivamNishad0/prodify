
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

/**
 * ⚛️ Login Component (Two-Column Layout with Form Fields)
 * * This component includes input fields for a basic login form, manages input 
 * state, and simulates a login process upon submission.
 */

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // 📝 State to manage form input values
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 📝 Handler for updating state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handles the form submission with real backend authentication:
   * 1. Prevents default form submit.
   * 2. Calls backend API for authentication.
   * 3. Sets authentication state via AuthContext.
   * 4. Redirects the user to the root path ("/").
   */

  const handleLogin = async (e) => {
    e.preventDefault(); // Stop default form submit behavior
    
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check user role and redirect accordingly
      if (result.user && result.user.role === 'admin') {
        navigate("/"); // Redirect admin to dashboard
      } else {
        navigate("/"); // Redirect staff to dashboard
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };



  // --- Inline Styles (Consistent with Signup/Two-Column Design) ---

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
  
  // Hover effect simulation
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = "#2a8a81";
  };
  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#3cb2a8";
  };


  return (
    <div style={divStyle}>
      <div style={mainCardStyle}>

        {/* 🎨 Left Column: Login Design/Branding */}
        <div style={leftColumnStyle}>
            <div style={brandLogoStyle}>prodify</div>
            
            <div>
                <h1>Modern Login Experience</h1>
                <p>Access your productivity tools instantly. Enter your credentials to continue.</p>
            </div>

            <p style={{fontSize: "12px", opacity: 0.8}}>© 2025 prodify. All rights reserved.</p>
        </div>

        {/* 🔐 Right Column: Login Form */}
        <div style={rightColumnStyle}>
            <h2 style={{color:"#3cb2a8", marginBottom:"10px"}}>Welcome Back</h2>

            <p style={{marginBottom: "30px", fontSize: "14px", color: "#666"}}>
                Sign in to your prodify account.
            </p>
            
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
            
            {/* Form wrapped to handle submission */}
            <form onSubmit={handleLogin}>
                {/* Email Input */}
                <label htmlFor="email">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="you@example.com"
                    required
                />

                {/* Password Input */}
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter your password"
                    required
                />
                

                <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: "14px",
                        color: "#3cb2a8",
                        textDecoration: "none",
                        cursor: "pointer",
                        padding: 0,
                        textAlign: "left"
                    }}
                >
                    Forgot Password?
                </button>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    style={buttonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    disabled={loading}
                >
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
                <p style={{textAlign: "center", marginTop: "20px", fontSize: "14px"}}>
                    Don't have an account? <a href="/signup" style={{color: "#3cb2a8", textDecoration: "none"}}>Sign Up</a>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Login;