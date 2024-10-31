import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { toast } from "react-hot-toast";

const PrivateRoute = ({ children, requiredRole }) => {
  const { token, user } = useSelector((state) => state.auth); 
  const location = useLocation();
  
  // State to manage access decision
  const hasAccess = token && user?.role === requiredRole;

  useEffect(() => {
    if (token && !hasAccess) {
      // Show toast message for unauthorized access
      toast.error("Access denied: You do not have the required permissions.");
    }
  }, [hasAccess, token]); // Run effect only when token or hasAccess changes

  if (hasAccess) {
    return children; 
  } else if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />; 
  }

  // Render null if we are not redirecting yet
  return null;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string, // Add requiredRole as a prop
};

export default PrivateRoute;
