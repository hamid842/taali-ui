import {
  AudioWaveform,
  Calendar,
  Command,
  GalleryVerticalEnd,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/hooks/use-language";
import SchoolSwitcher from "./school-switcher";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "react-router-dom";
import SidebarSkeleton from "@/components/skeleton/layout/sidebar-skeleton";
import type { MenuItemDto } from "@/types/menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Icon mapping for your menu items
const iconMap = {
  home: Home,
  inbox: Inbox,
  calendar: Calendar,
  search: Search,
  settings: Settings,
  building: GalleryVerticalEnd,
  users: AudioWaveform,
  command: Command,
  "dollar-sign": Command,
  "user-check": AudioWaveform,
  "graduation-cap": AudioWaveform,
  "family-restroom": AudioWaveform,
  "event-available": Calendar,
  assignment: Inbox,
  "book-open": Inbox,
  "clipboard-check": Inbox,
  "file-text": Inbox,
  "user-plus": AudioWaveform,
  "bar-chart": Settings,
  "credit-card": Inbox,
  "trending-down": Settings,
  utensils: Inbox,
  "shopping-cart": Inbox,
  package: Inbox,
  plus: Inbox,
  list: Inbox,
  bell: Inbox,
  book: Inbox,
  award: Inbox,
};

// Fallback icon if the icon name is not found
const FallbackIcon = Home;

// Collapsible menu item component for smooth animations
interface CollapsibleMenuItemProps {
  item: MenuItemDto;
  level: number;
  isExpanded: boolean;
  onToggle: (itemId: number) => void;
  isActive: boolean;
  dir: "ltr" | "rtl";
}

function CollapsibleMenuItem({
  item,
  level,
  isExpanded,
  onToggle,
  isActive,
  dir,
}: CollapsibleMenuItemProps) {
  const IconComponent = getIconComponent(item.icon);
  const hasChildren = item.children && item.children.length > 0;

  // For RTL, we need to adjust the margins and chevron direction
  const marginDirection = dir === "rtl" ? "mr-4" : "ml-4";
  const borderDirection = dir === "rtl" ? "border-r" : "border-l";

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => onToggle(item.id)}
          className={cn(
            "flex items-center justify-between w-full cursor-pointer transition-colors duration-200",
            isActive && "bg-accent",
            "hover:bg-accent/50"
          )}
        >
          <div className="flex items-center gap-2">
            <IconComponent className="h-4 w-4" />
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-500 ease-in-out",
              isExpanded ? "rotate-180" : "rotate-0"
            )}
          />
        </SidebarMenuButton>

        {/* Animated children container */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out",
            marginDirection,
            borderDirection,
            "border-border",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-1">
            <SidebarMenu>
              {item.children!.map((child) => (
                <CollapsibleMenuItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  isExpanded={isExpanded}
                  onToggle={onToggle}
                  isActive={
                    child.route ? location.pathname === child.route : false
                  }
                  dir={dir}
                />
              ))}
            </SidebarMenu>
          </div>
        </div>
      </SidebarMenuItem>
    );
  }

  // Leaf item (no children)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className="transition-colors duration-200 hover:bg-accent/50"
      >
        <Link to={item.route || "#"}>
          <IconComponent className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// Get icon component from string
function getIconComponent(iconName?: string) {
  if (!iconName) return FallbackIcon;

  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent || FallbackIcon;
}

export default function AppSidebar() {
  const { dir } = useLanguage();
  const { menuItems, isMenuLoading } = useAuth();
  const location = useLocation();
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
        <SchoolSwitcher />
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
