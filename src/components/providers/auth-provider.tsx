import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "@/contexts/auth-context";
import AuthContext from "@/contexts/auth-context";
import { apiClient, apiConfig } from "@/lib/api/api-config";
import type { MenuItemDto } from "@/types/menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Mock permissions for each role (you can expand this)
const rolePermissions = {
  OWNER: ["all"],
  ADMIN: ["all"],
  SUPERVISOR: ["view_reports", "manage_teachers", "view_students"],
  TEACHER: ["manage_classes", "manage_attendance", "manage_grades"],
  STUDENT: ["view_schedule", "submit_assignments", "view_grades"],
  PARENT: ["view_child_progress", "view_attendance", "make_payments"],
  CANTEEN_OPERATOR: ["manage_menu", "manage_orders", "view_inventory"],
  FINANCE_TEAM: ["manage_fees", "view_payments", "financial_reports"],
};

// Menu API (keep this since it's state-related)
const menuApi = {
  fetchUserMenu: async (
    role: string,
    schoolId?: number
  ): Promise<MenuItemDto[]> => {
    const params = new URLSearchParams({ role });
    if (schoolId) {
      params.append("schoolId", schoolId.toString());
    }

    return apiClient.get<MenuItemDto[]>(
      `${apiConfig.endpoints.menu.getUserMenu}?${params}`
    );
  },
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentRoleContext, setCurrentRoleContext] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("refresh_token");

    // Clear React Query cache
    queryClient.clear();

    // Reset state
    setUser(null);

    // Redirect to login page
    window.location.href = "/login";
  }, [queryClient]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Prefetch menu when user is authenticated
          if (parsedUser.role) {
            queryClient.prefetchQuery({
              queryKey: ["menu", parsedUser.role, parsedUser.schoolId],
              queryFn: () =>
                menuApi.fetchUserMenu(parsedUser.role, parsedUser.schoolId),
            });
          }
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          logout();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setIsInitialized(true);
    }
  }, [logout, queryClient]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // React Query for menu (state-related, so it stays)
  const menuQuery = useQuery({
    queryKey: ["menu", currentRoleContext || user?.role, user?.schoolId],
    queryFn: () => {
      const roleToUse = currentRoleContext || user?.role;
      return roleToUse ? menuApi.fetchUserMenu(roleToUse, user?.schoolId) : [];
    },
    enabled: !!(currentRoleContext || user?.role),
    staleTime: 5 * 60 * 1000,
  });

  // State setters only - no API calls!
  const login = (token: string, userData: User, refreshToken?: string) => {
    // Store auth data
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    // Set user state
    setUser(userData);

    // Invalidate and refetch menu
    if (userData.role) {
      queryClient.invalidateQueries({ queryKey: ["menu", userData.role] });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;

    const userRole = user.role as keyof typeof rolePermissions;
    const permissions = rolePermissions[userRole] || [];

    return permissions.includes("all") || permissions.includes(permission);
  };

  // Function to manually refetch menu (e.g., when language changes)
  const refetchMenu = async () => {
    if (user?.role) {
      await queryClient.invalidateQueries({
        queryKey: ["menu", user.role, user.schoolId],
      });
    }
  };

  // Update the updateSchoolContext function to handle role switching
  const updateSchoolContext = useCallback(
    (schoolId: number, roleContext?: string) => {
      if (user) {
        const updatedUser = { ...user, schoolId };
        setUser(updatedUser);
        localStorage.setItem("user_data", JSON.stringify(updatedUser));

        // If roleContext is provided, switch the role context
        if (roleContext) {
          setCurrentRoleContext(roleContext);
        }

        // Refetch menu with new context
        queryClient.invalidateQueries({
          queryKey: ["menu", roleContext || user.role, schoolId],
        });
      }
    },
    [user, queryClient]
  );

  // Add function to reset role context (when going back to owner dashboard)
  const resetRoleContext = useCallback(() => {
    setCurrentRoleContext(null);
    queryClient.invalidateQueries({
      queryKey: ["menu", user?.role, user?.schoolId],
    });
  }, [user, queryClient]);

  const value: AuthContextType = {
    user,
    currentRoleContext: currentRoleContext || user?.role,
    isLoading: menuQuery.isLoading, // Only menu loading now
    isAuthenticated: !!user,
    isInitialized,
    menuItems: menuQuery.data || [],
    isMenuLoading: menuQuery.isLoading,
    isMenuError: menuQuery.isError,
    login,
    logout,
    updateUser,
    checkPermission,
    refetchMenu,
    updateSchoolContext,
    resetRoleContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
