import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protects private routes and redirects unauthenticated visitors to /login.
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
