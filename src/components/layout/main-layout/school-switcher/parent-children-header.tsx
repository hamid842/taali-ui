import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useParentDashboard } from "@/hooks/use-parent-dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Users, Loader2 } from "lucide-react";
import type { SchoolSummary } from "@/types/class";
import SchoolTitle from "@/components/common/school-title";

export default function ParentChildrenHeader() {
  const { t } = useLanguage();
  const { user, setCurrentSchool } = useAuth();
  const { myChildren, isLoading } = useParentDashboard();

  // Extract unique schools from children data
  const schools =
    myChildren.data?.reduce((acc, child) => {
      if (child.school && !acc.find((s) => s.id === child.school?.id)) {
        acc.push(child.school);
      }
      return acc;
    }, [] as SchoolSummary[]) || [];

  const children = myChildren.data || [];

  const handleSchoolChange = (schoolId: string) => {
    const school = schools.find((s) => s.id === parseInt(schoolId));
    if (school) {
      setCurrentSchool(school);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">{t("common.loading")}</span>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="text-sm">{t("parent.children.noChildren")}</span>
      </div>
    );
  }

  // If only one school, show school title
  if (schools.length === 1) {
    return <SchoolTitle school={schools[0]} />;
  }

  // If multiple schools, show switcher
  if (schools.length > 1) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <Select
          value={user?.currentSchool?.id?.toString()}
          onValueChange={handleSchoolChange}
        >
          <SelectTrigger className="w-full border-0 bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground">
            <SelectValue placeholder={t("parent.selectSchool")} />
          </SelectTrigger>
          <SelectContent>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id.toString()}>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>{school.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Fallback: Show children count
  return (
    <div className="flex items-center space-x-3">
      <Users className="h-5 w-5 text-muted-foreground" />
      <div>
        <div className="font-semibold text-sm">
          {t("parent.children.title")}
        </div>
        <div className="text-xs text-muted-foreground">
          {children.length} {t("parent.children.title")}
        </div>
      </div>
    </div>
  );
}
