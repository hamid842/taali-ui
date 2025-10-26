import type { AuthContextType, User } from "@/contexts/auth-context";
import AuthContext from "@/contexts/auth-context";
import { useEffect, useState, type ReactNode } from "react";

// Mock permissions for each role (you can expand this)
const rolePermissions = {
  ADMIN: ["all"],
  SUPERVISOR: ["view_reports", "manage_teachers", "view_students"],
  TEACHER: ["manage_classes", "manage_attendance", "manage_grades"],
  STUDENT: ["view_schedule", "submit_assignments", "view_grades"],
  PARENT: ["view_child_progress", "view_attendance", "make_payments"],
  CANTEEN_OPERATOR: ["manage_menu", "manage_orders", "view_inventory"],
  FINANCE_TEAM: ["manage_fees", "view_payments", "financial_reports"],
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        // Use the stored user data directly
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
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
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const login = (token: string, userData: User, refreshToken?: string) => {
    // Store auth data
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    // Set user state immediately
    setUser(userData);
    // Note: isLoading and isInitialized don't change here since this is sync
  };

  const register = async (userData: unknown) => {
    setIsLoading(true);
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Call logout endpoint to invalidate token on server
    // fetch("/auth/logout", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    //   },
    // }).catch(console.error);

    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("refresh_token");

    setUser(null);

    // Redirect to login page
    window.location.href = "/login";
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

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isInitialized,
    login,
    register,
    logout,
    updateUser,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
