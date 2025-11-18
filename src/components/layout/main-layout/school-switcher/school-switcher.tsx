import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/hooks/use-language";
import { useSchools } from "@/hooks/use-schools";
import { Building } from "lucide-react";
import SchoolSwitcherSkeleton from "@/components/skeleton/layout/school-switcher-skeleton";
import EmptySchools from "./empty-schools";
import SchoolDropdown from "./school-dropdown";
import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";

export default function SchoolSwitcher() {
  const { t } = useLanguage();
  const { setOwnerHasSchool } = useAppStore();

  const { data: schools, isLoading, error } = useSchools();

  useEffect(() => {
    if (!isLoading && !error) {
      const hasSchool = !!schools && schools.length > 0;
      setOwnerHasSchool(hasSchool);
    }
  }, [isLoading, error, schools, setOwnerHasSchool]);

  // Handle loading state
  if (isLoading) {
    return <SchoolSwitcherSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="text-destructive" disabled>
            <Building className="h-4 w-4" />
            <span className="text-xs">
              {t("owner.dashboard.schoolSwitcher.failed")}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }


  // Handle no schools state
  if (!schools || schools.length === 0) {
    return <EmptySchools />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SchoolDropdown schools={schools} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
