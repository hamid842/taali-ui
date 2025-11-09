import {
  Sidebar,
  SidebarContent,
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
import { useLocation } from "react-router-dom";
import SidebarSkeleton from "@/components/skeleton/layout/sidebar-skeleton";
import type { MenuItemDto } from "@/types/menu";
import { useEffect, useState } from "react";
import CollapsibleMenuItem from "./collapsible-menu-item";
import { useAppStore } from "@/stores/app-store";
import SchoolTitle from "@/components/common/school-title";

export default function AppSidebar() {
  const { dir } = useLanguage();
  const { menuItems, isMenuLoading } = useAuth();
  const location = useLocation();
  const { role, currentSchool } = useAppStore();
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
        {role === "OWNER" ? (
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
    </Sidebar>
  );
}
