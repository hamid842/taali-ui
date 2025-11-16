import { useCallback } from "react";
import { useLanguage } from "./use-language";
import { RoleConfig, UserRole, type UserRoleType } from "@/types/role";
import { useNavigate } from "react-router-dom";

export function useRoleRedirect() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getDashboardPath = useCallback(
    (role: UserRoleType, schoolId?: number): string => {
      const basePath = RoleConfig[role].dashboardPath;

      // If we have a schoolId and the role should have school context, modify the path
      if (schoolId && (role === UserRole.SCHOOL_MANAGER || role === UserRole.OWNER)) {
        return `/school/${schoolId}${basePath}`;
      }

      return basePath;
    },
    []
  );

  const redirectToDashboard = useCallback(
    (role: UserRoleType, schoolId?: number) => {
      const path = getDashboardPath(role, schoolId);
      navigate(path, { replace: true });
    },
    [getDashboardPath, navigate]
  );

  const getRoleLabel = useCallback(
    (role: UserRoleType): string => {
      const translationKey = RoleConfig[role].translationKey;
      return t(translationKey);
    },
    [t]
  );

  const getRolePermissions = useCallback(
    (role: UserRoleType): readonly string[] => {
      return RoleConfig[role].permissions;
    },
    []
  );

  return {
    getDashboardPath,
    redirectToDashboard,
    getRoleLabel,
    getRolePermissions,
  };
}
