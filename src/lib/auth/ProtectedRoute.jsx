import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@shared/stores";
import { PUBLIC_ROUTES } from "./publicRoutes";

export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
