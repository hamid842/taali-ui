import { useCallback } from "react";
import { useLanguage } from "./use-language";
import { RoleConfig, type UserRoleType } from "@/types/role";

export function useRoleRedirect() {
  const { t } = useLanguage();

  const getDashboardPath = useCallback((role: UserRoleType): string => {
    return RoleConfig[role].dashboardPath;
  }, []);

  const redirectToDashboard = useCallback(
    (role: UserRoleType) => {
      const path = getDashboardPath(role);
      window.location.href = path;
    },
    [getDashboardPath]
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
