import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
      // user is not authenticated
      return <Navigate to="/login" />;
    } 
    return children;
  };