import { Routes, Route } from "react-router-dom";
import React from "react";
import { WebsiteAuthProvider } from "./contexts/WebsiteAuthContext";
import Navbar from "@shared/components/Navbar";
import Footer from "@shared/components/Footer";
import Offers from "./components/Offers";
import Headerforcategory from "./components/Headerforcategory";
import Topdeals from "./components/Topdeals";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

// Simple Home component for protected route
function Home() {
  return (
    <>
      <Navbar />
      <Headerforcategory />
      <Offers className="app-content" />
      <Topdeals />
      <Footer />
    </>
  );
}

function App() {
  return (
    <WebsiteAuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Auth callback route (for Keycloak redirect) */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </WebsiteAuthProvider>
  );
}

// Auth callback component to handle token from backend
function AuthCallback() {
  const [status, setStatus] = React.useState('Processing authentication...');

  React.useEffect(() => {
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      setStatus('Authentication failed. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login?error=' + error;
      }, 2000);
      return;
    }

    if (token) {
      // Store token and redirect to home
      localStorage.setItem('websiteToken', token);
      setStatus('Authentication successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      setStatus('Invalid authentication response. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p>{status}</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
