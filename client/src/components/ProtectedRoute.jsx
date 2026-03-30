import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;