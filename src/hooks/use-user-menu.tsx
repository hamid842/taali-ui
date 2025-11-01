// hooks/use-user-menu.ts
import { useMemo } from "react";
import { useLanguage } from "./use-language";
import { useAuth } from "./use-auth";
import type { MenuItemDto } from "@/types/menu";
import { apiClient, apiConfig } from "@/lib/api-config";

export function useUserMenu() {
  const { user } = useAuth();
  const { t, currentLanguage } = useLanguage();

  const menuItems = useMemo((): MenuItemDto[] => {
    if (!user?.role) return [];

    // In a real implementation, you'd fetch from API
    // For now, we'll use a mock or static data that matches your backend structure
    return getMenuForRole(user.role);
  }, [user?.role,currentLanguage]);

  const fetchUserMenu = async (role: string): Promise<MenuItemDto[]> => {
    try {
      const response = await apiClient.get<MenuItemDto[]>(
        `${apiConfig.endpoints.menu.getUserMenu}?role=${role}`,
        currentLanguage
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch user menu:", error);
      return [];
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.role) return false;

    // Check if any menu item requires this permission and user has access
    const checkMenuPermissions = (items: MenuItemDto[]): boolean => {
      for (const item of items) {
        if (item.requiredPermission === permission) {
          return true;
        }
        if (item.children.length > 0) {
          if (checkMenuPermissions(item.children)) {
            return true;
          }
        }
      }
      return false;
    };

    return checkMenuPermissions(menuItems);
  };

  return {
    menuItems,
    fetchUserMenu,
    hasPermission,
    userRole: user?.role,
  };
}

// Temporary function until we integrate with actual API
function getMenuForRole(role: string): MenuItemDto[] {
  // This should match the structure from your backend MenuItemDto
  const menuConfig: Record<string, MenuItemDto[]> = {
    OWNER: [
      {
        id: 1,
        titleKey: "menu.dashboard",
        title: "Dashboard",
        icon: "home",
        route: "/owner/dashboard",
        path: "/owner/dashboard",
        orderIndex: 0,
        children: [],
        allowedRoles: ["OWNER"],
        isRootItem: true,
        hasChildren: false,
      },
      {
        id: 2,
        titleKey: "menu.school_management",
        title: "School Management",
        icon: "building",
        route: null,
        path: null,
        orderIndex: 1,
        allowedRoles: ["OWNER"],
        isRootItem: true,
        hasChildren: true,
        children: [
          {
            id: 3,
            titleKey: "menu.create_school",
            title: "Create School",
            icon: "plus",
            route: "/owner/schools/create",
            path: "/owner/schools/create",
            orderIndex: 0,
            children: [],
            allowedRoles: ["OWNER"],
            requiredPermission: "school:create",
            parentId: 2,
            isRootItem: false,
            hasChildren: false,
          },
          {
            id: 4,
            titleKey: "menu.list_schools",
            title: "List Schools",
            icon: "list",
            route: "/owner/schools",
            path: "/owner/schools",
            orderIndex: 1,
            children: [],
            allowedRoles: ["OWNER"],
            requiredPermission: "school:read",
            parentId: 2,
            isRootItem: false,
            hasChildren: false,
          },
        ],
      },
      {
        id: 5,
        titleKey: "menu.user_management",
        title: "User Management",
        icon: "users",
        route: null,
        path: null,
        orderIndex: 2,
        allowedRoles: ["OWNER"],
        isRootItem: true,
        hasChildren: true,
        children: [
          {
            id: 6,
            titleKey: "menu.create_user",
            title: "Create User",
            icon: "user-plus",
            route: "/owner/users/create",
            path: "/owner/users/create",
            orderIndex: 0,
            children: [],
            allowedRoles: ["OWNER"],
            requiredPermission: "user:create",
            parentId: 5,
            isRootItem: false,
            hasChildren: false,
          },
          {
            id: 7,
            titleKey: "menu.list_users",
            title: "List Users",
            icon: "users",
            route: "/owner/users",
            path: "/owner/users",
            orderIndex: 1,
            children: [],
            allowedRoles: ["OWNER"],
            requiredPermission: "user:read",
            parentId: 5,
            isRootItem: false,
            hasChildren: false,
          },
        ],
      },
      {
        id: 8,
        titleKey: "menu.finance",
        title: "Finance",
        icon: "dollar-sign",
        route: "/owner/finance",
        path: "/owner/finance",
        orderIndex: 3,
        children: [],
        allowedRoles: ["OWNER"],
        requiredPermission: "finance:read",
        isRootItem: true,
        hasChildren: false,
      },
      {
        id: 9,
        titleKey: "menu.settings",
        title: "Settings",
        icon: "settings",
        route: "/owner/settings",
        path: "/owner/settings",
        orderIndex: 4,
        children: [],
        allowedRoles: ["OWNER"],
        isRootItem: true,
        hasChildren: false,
      },
    ],
    ADMIN: [
      // Admin menu items from your backend
    ],
    // Add other roles as needed
  };

  return menuConfig[role] || [];
}
