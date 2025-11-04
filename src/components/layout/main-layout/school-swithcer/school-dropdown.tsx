import { useState, type ElementType } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import SchoolImage from "./school-image";
import { Building, ChevronsUpDown, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { School } from "@/types/school";

export default function SchoolDropdown({ schools }: { schools: School[] }) {
  const { t, dir } = useLanguage();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const [activeSchool, setActiveSchool] = useState<School | null>(null);

  // Get logo component (you can enhance this to use actual images)
  const getLogoComponent = (): ElementType => {
    // If you have school images, you can use them here
    // For now, we'll use a building icon as default
    return Building;
  };

  // Get the active school's logo component
  const ActiveLogo = activeSchool ? getLogoComponent() : Building;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {activeSchool?.image ? (
              <SchoolImage school={activeSchool} />
            ) : (
              <ActiveLogo className="size-4" />
            )}
          </div>
          <div
            className={cn(
              "grid flex-1 text-sm leading-tight",
              dir === "rtl" ? "text-right" : "text-left"
            )}
            dir={dir}
          >
            <span className="truncate font-medium">
              {activeSchool?.name || t("dashboard.schoolSwitcher.selectSchool")}
            </span>
            <span className="truncate text-xs">{activeSchool?.code || ""}</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        side={isMobile ? "bottom" : "right"}
        sideOffset={4}
      >
        <DropdownMenuLabel dir={dir} className="text-muted-foreground text-xs">
          {t("dashboard.schoolSwitcher.title") || "Your Schools"}
        </DropdownMenuLabel>
        {schools.map((school, index) => {
          const SchoolLogo = getLogoComponent();
          return (
            <DropdownMenuItem
              key={school.id}
              onClick={() => setActiveSchool(school)}
              className="gap-4 p-2"
              dir={dir}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {school.image ? (
                      <SchoolImage school={school} />
                    ) : (
                      <SchoolLogo className="size-3.5 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{school.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {school.code}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenuShortcut className="flex-1">
                {index + 1}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 p-2"
          dir={dir}
          onClick={() => navigate("/owner/schools/create")}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <Plus className="size-4" />
          </div>
          <div className="text-muted-foreground font-medium">
            {t("school.create") || "Add School"}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
