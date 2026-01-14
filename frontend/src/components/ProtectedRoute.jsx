
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated - redirect to welcome/login
  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const hasRequiredRole = user?.role === requiredRole || 
                           (requiredRole === 'staff' && ['admin', 'manager', 'employee'].includes(user?.role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return isAuthenticated ? children : <Navigate to="/welcome" replace />;
}

export default ProtectedRoute;
