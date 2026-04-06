import { Navigate } from "react-router-dom";

import { getAuthToken, getStoredUser } from "../utils/auth";

const ProtectedRoute = ({ children, role }) => {
  const user = getStoredUser();
  const token = getAuthToken();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
