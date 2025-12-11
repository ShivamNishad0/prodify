
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

/**
 * ⚛️ Signup Component (Two-Column Layout with Form Fields)
 * * This component allows a user to input data, manages the state, 
 * and simulates a sign-up/login process upon submission.
 */

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // 📝 State to manage form input values
  const [formData, setFormData] = useState({
    name: '',
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
   * Handles the form submission with real backend registration:
   * 1. Prevents default form submit.
   * 2. Calls backend API for user registration.
   * 3. Sets authentication state via AuthContext.
   * 4. Redirects the user to the root path ("/").
   */
  const handleSignup = async (e) => {
    e.preventDefault(); // Stop default form submit behavior
    
    setLoading(true);
    setError('');

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate("/"); // Redirect to dashboard/home page
    } else {
      setError(result.error);
    }
    setLoading(false);
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


  return (
    <div style={divStyle}>
      <div style={mainCardStyle}>

        {/* 🎨 Left Column: Signup Design/Branding */}
        <div style={leftColumnStyle}>
            <div style={brandLogoStyle}>prodify</div>
            
            <div>
                <h1>Start Your Journey</h1>
                <p>Join millions of users and unlock the potential of your productivity. Setting up your account is fast and easy.</p>
            </div>

            <p style={{fontSize: "12px", opacity: 0.8}}>© 2025 prodify. All rights reserved.</p>
        </div>

        {/* 🔐 Right Column: Signup Form */}
        <div style={rightColumnStyle}>
            <h2 style={{color:"#3cb2a8", marginBottom:"10px"}}>Create an Account</h2>

            <p style={{marginBottom: "30px", fontSize: "14px", color: "#666"}}>
                Enter your details to get started.
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
            <form onSubmit={handleSignup}>
                {/* Name Input */}
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="John Doe"
                    required
                />

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
                    placeholder="Must be at least 8 characters"
                    required
                />

                {/* Submit Button */}
                <button 
                    type="submit" 
                    style={buttonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    Create Account
                </button>
                <p style={{textAlign: "center", marginTop: "20px", fontSize: "14px"}}>
                    Already a member? <a href="/login" style={{color: "#3cb2a8", textDecoration: "none"}}>Log In</a>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;