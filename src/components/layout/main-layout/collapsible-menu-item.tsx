import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getIconComponent } from "@/constants/icons";
import { cn } from "@/lib/utils";
import type { MenuItemDto } from "@/types/menu";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface CollapsibleMenuItemProps {
  item: MenuItemDto;
  level: number;
  isExpanded: boolean;
  onToggle: (itemId: number) => void;
  isActive: boolean;
  dir: "ltr" | "rtl";
}

export default function CollapsibleMenuItem({
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
              "h-3 w-3 transition-transform duration-300 ease-in-out",
              isExpanded ? "rotate-180" : "rotate-0"
            )}
          />
        </SidebarMenuButton>

        {/* Animated children container */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
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
                  isExpanded={false} // Children don't control their own expansion
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

  // Leaf item (no children) - unchanged
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
