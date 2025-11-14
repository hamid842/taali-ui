import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptySchools() {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  return (
    <SidebarMenu>
      <SidebarMenuItem onClick={() => navigate("/owner/schools/create")}>
        <SidebarMenuButton
          size="lg"
          className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Plus className="size-4" />
          </div>
          <div
            className={cn(
              "grid flex-1 text-sm leading-tight",
              dir === "ltr" ? "text-left" : "text-right"
            )}
          >
            <span className="truncate font-medium">
              {t("owner.dashboard.schoolSwitcher.emptyTitle")}
            </span>
            <span className="truncate text-xs">
              {t("owner.dashboard.schoolSwitcher.emptyDesc")}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
