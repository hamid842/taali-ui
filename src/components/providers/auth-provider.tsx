import type { AuthContextType, User } from "@/contexts/auth-context";
import AuthContext from "@/contexts/auth-context";
import { apiClient, apiConfig } from "@/lib/api/api-config";
import type { MenuItemDto } from "@/types/menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type ReactNode } from "react";

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
  fetchUserMenu: async (role: string): Promise<MenuItemDto[]> => {
    return apiClient.get<MenuItemDto[]>(
      `${apiConfig.endpoints.menu.getUserMenu}?role=${role}`
    );
  },
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
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
              queryKey: ["menu", parsedUser.role],
              queryFn: () => menuApi.fetchUserMenu(parsedUser.role),
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
    queryKey: ["menu", user?.role],
    queryFn: () => (user?.role ? menuApi.fetchUserMenu(user.role) : []),
    enabled: !!user?.role,
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
      await queryClient.invalidateQueries({ queryKey: ["menu", user.role] });
    }
  };

  const value: AuthContextType = {
    user,
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
    refetchMenu, // Expose the refetch function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
