import { useAuth } from "@/hooks/use-auth";
import type { UserRoleType } from "@/types/role";
import { Navigate } from "react-router-dom";
import { FullPageSpinner } from "../common/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRoleType[];
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackPath = "/unauthorized",
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <FullPageSpinner text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
