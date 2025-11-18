import { useAuth } from "@/hooks/use-auth";
import type { UserRoleType } from "@/types/role";
import { Navigate } from "react-router-dom";
import { FullPageSpinner } from "../common/loading-spinner";
import { useLanguage } from "@/hooks/use-language";

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
  const { t } = useLanguage();
  const { user, isLoading, isAuthenticated, isInitialized } = useAuth();

  // Wait until auth is fully initialized
  if (!isInitialized || isLoading) {
    return <FullPageSpinner text={t("loading.checkAuth")} />;
  }

  if (isLoading) {
    return <FullPageSpinner text={t("loading.checkAuth")} />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role!)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
