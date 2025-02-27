import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  requiresAdmin?: boolean;
};

const ProtectedRoute = ({ requiresAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires admin but user is not admin, redirect to dashboard
  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;
