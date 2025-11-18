import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/hooks/use-language";
import SchoolSwitcher from "./school-switcher/school-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarSkeleton from "@/components/skeleton/layout/sidebar-skeleton";
import type { MenuItemDto } from "@/types/menu";
import { useEffect, useState } from "react";
import CollapsibleMenuItem from "./collapsible-menu-item";
import { useAppStore } from "@/stores/app-store";
import SchoolTitle from "@/components/common/school-title";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { UserRole } from "@/types/role";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const {
    menuItems,
    isMenuLoading,
    user,
    currentRoleContext,
    resetRoleContext,
  } = useAuth();
  const location = useLocation();
  const { currentSchool, setCurrentSchool } = useAppStore();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Get sidebar state
  const { state } = useSidebar();

  // Close all menus when sidebar collapses
  useEffect(() => {
    if (state === "collapsed") {
      setExpandedItem(null);
    }
  }, [state]);

  // Toggle expand/collapse for menu items
  const toggleExpanded = (itemId: number) => {
    setExpandedItem((prev) => (prev === itemId ? null : itemId));
  };

  // Auto-expand active item's parent on mount and when location changes
  useEffect(() => {
    const findActiveParentId = (
      items: MenuItemDto[],
      targetPath: string
    ): number | null => {
      for (const item of items) {
        if (item.route === targetPath) {
          return null; // The active item itself doesn't need to be expanded
        }
        if (item.children && item.children.length > 0) {
          const childHasActive = item.children.some(
            (child) =>
              child.route === targetPath ||
              (child.children && findActiveParentId(child.children, targetPath))
          );
          if (childHasActive) {
            return item.id;
          }
        }
      }
      return null;
    };

    const activeParentId = findActiveParentId(menuItems, location.pathname);
    if (activeParentId) {
      setExpandedItem(activeParentId);
    }
  }, [location.pathname, menuItems]);

  // Recursive function to render menu items
  const renderMenuItems = (items: MenuItemDto[], level = 0) => {
    return items.map((item) => {
      const isActive = item.route && location.pathname === item.route;
      const isExpanded = expandedItem === item.id;

      return (
        <CollapsibleMenuItem
          key={item.id}
          item={item}
          level={level}
          isExpanded={isExpanded}
          onToggle={toggleExpanded}
          isActive={Boolean(isActive)}
          dir={dir}
        />
      );
    });
  };

  // Check if we should show the "Back to Owner Panel" button
  const shouldShowOwnerSwitch =
    user?.role === UserRole.OWNER &&
    currentRoleContext === UserRole.SCHOOL_MANAGER;

  // Handle switching back to owner context
  const handleBackToOwnerPanel = () => {
    setCurrentSchool(null);
    resetRoleContext();
    navigate("/owner/dashboard");
  };

  // Show skeleton while loading
  if (isMenuLoading) {
    return <SidebarSkeleton />;
  }

  // Show empty state if no menu items
  if (menuItems.length === 0) {
    return (
      <Sidebar
        side={dir === "rtl" ? "right" : "left"}
        dir={dir}
        collapsible="icon"
      >
        <SidebarHeader>
          <div className="px-2 py-1 text-sm text-muted-foreground">
            No menu available
          </div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar
      side={dir === "rtl" ? "right" : "left"}
      dir={dir}
      collapsible="icon"
    >
      <SidebarHeader>
        {user?.role === "OWNER" ? (
          <SchoolSwitcher />
        ) : (
          <SchoolTitle school={currentSchool} />
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(menuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Add Footer with Back to Owner Panel button */}
      {shouldShowOwnerSwitch && (
        <SidebarFooter>
          <div className="border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full mt-2 justify-start gap-2 h-auto py-2 px-3 text-sm transition-all",
                state === "collapsed" && "px-2"
              )}
              onClick={handleBackToOwnerPanel}
            >
              <LayoutDashboard className="size-4 shrink-0" />
              <span
                className={cn(
                  "flex-1 transition-opacity duration-200",
                  state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                )}
              >
                {t("common.backToOwnerPanel")}
              </span>
            </Button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
