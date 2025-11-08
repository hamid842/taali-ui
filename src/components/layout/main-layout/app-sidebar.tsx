import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/hooks/use-language";
import SchoolSwitcher from "./school-switcher/school-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "react-router-dom";
import SidebarSkeleton from "@/components/skeleton/layout/sidebar-skeleton";
import type { MenuItemDto } from "@/types/menu";
import { useState } from "react";
import CollapsibleMenuItem from "./collapsible-menu-item";
import { useAppStore } from "@/stores/app-store";
import SchoolTitle from "@/components/common/school-title";

export default function AppSidebar() {
  const { dir } = useLanguage();
  const { menuItems, isMenuLoading } = useAuth();
  const location = useLocation();
  const { role, currentSchool } = useAppStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Toggle expand/collapse for menu items
  const toggleExpanded = (itemId: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Auto-expand parent items when a child is active
  const findAndExpandParents = (
    items: MenuItemDto[],
    targetPath: string
  ): number[] => {
    const parentIds: number[] = [];

    const findItem = (currentItems: MenuItemDto[], path: string): boolean => {
      for (const item of currentItems) {
        if (item.route === path) {
          return true;
        }
        if (item.children && item.children.length > 0) {
          if (findItem(item.children, path)) {
            parentIds.push(item.id);
            return true;
          }
        }
      }
      return false;
    };

    findItem(items, targetPath);
    return parentIds;
  };

  // Auto-expand active item's parents on mount and when location changes
  useState(() => {
    const activeParentIds = findAndExpandParents(menuItems, location.pathname);
    setExpandedItems((prev) => new Set([...prev, ...activeParentIds]));
  });

  // Recursive function to render menu items
  const renderMenuItems = (items: MenuItemDto[], level = 0) => {
    return items.map((item) => {
      const isActive = item.route && location.pathname === item.route;
      const isExpanded = expandedItems.has(item.id);

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
