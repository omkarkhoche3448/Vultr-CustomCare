import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth); 
  const location = useLocation();

  if (token) {
    return children; 
  } else {
    return <Navigate to="/signin" state={{ from: location }} replace />; 
  }
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
