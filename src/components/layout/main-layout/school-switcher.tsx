import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useSchools } from "@/hooks/use-schools";
import { cn } from "@/lib/utils";
import type { School } from "@/types/school";
import { Building, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";

export default function SchoolSwitcher() {
  const { t, dir } = useLanguage();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { data: schools, isLoading, error } = useSchools();
  const [activeSchool, setActiveSchool] = useState<School | null>(null);

  // Auto-select first school if available and none selected
  if (schools && schools.length > 0 && !activeSchool) {
    setActiveSchool(schools[0]);
  }

  // Get logo component (you can enhance this to use actual images)
  const getLogoComponent = (): ElementType => {
    // If you have school images, you can use them here
    // For now, we'll use a building icon as default
    return Building;
  };

  // Handle loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="justify-center" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="sr-only">
              {t("dashboard.schoolSwitcher.loading")}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Handle error state
  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="text-destructive" disabled>
            <Building className="h-4 w-4" />
            <span className="text-xs">
              {t("dashboard.schoolSwitcher.failed")}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Handle no schools state
  if (!schools || schools.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem onClick={() => navigate("/owner/add-school")}>
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
                {t("dashboard.schoolSwitcher.emptyTitle")}
              </span>
              <span className="truncate text-xs">
                {t("dashboard.schoolSwitcher.emptyDesc")}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Get the active school's logo component
  const ActiveLogo = activeSchool ? getLogoComponent() : Building;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeSchool?.image ? (
                  <img
                    src={activeSchool.image}
                    alt={activeSchool.name}
                    className="size-6 rounded-md object-cover"
                  />
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
                  {activeSchool?.name || "Select School"}
                </span>
                <span className="truncate text-xs">
                  {activeSchool?.code || ""}
                </span>
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
            <DropdownMenuLabel
              dir={dir}
              className="text-muted-foreground text-xs"
            >
              {t("dashboard.schoolSwitcher.title") || "Your Schools"}
            </DropdownMenuLabel>
            {schools.map((school, index) => {
              const SchoolLogo = getLogoComponent();
              return (
                <DropdownMenuItem
                  key={school.id}
                  onClick={() => setActiveSchool(school)}
                  className="gap-2 p-2"
                  dir={dir}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {school.image ? (
                      <img
                        src={school.image}
                        alt={school.name}
                        className="size-4 rounded-sm object-cover"
                      />
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
                  <DropdownMenuShortcut>{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              dir={dir}
              onClick={() => {
                // You can add create school functionality here
                // For example, navigate to create school page
                console.log("Create new school clicked");
              }}
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
