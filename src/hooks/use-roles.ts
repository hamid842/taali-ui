import { useAuth } from "./use-auth";

export const useRoles = () => {
  const { user } = useAuth();

  const hasRole = (roles: string | string[]): boolean => {
    if (!user?.role) return false;

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    return requiredRoles.includes(user.role);
  };

  const canManageClasses = (): boolean => {
    return hasRole(["OWNER", "ADMIN", "SUPERVISOR"]);
  };

  const canManageTeachers = (): boolean => {
    return hasRole(["OWNER", "ADMIN", "SUPERVISOR"]);
  };

  return {
    hasRole,
    canManageClasses,
    canManageTeachers,
    user,
  };
};
