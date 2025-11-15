import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";
import type { ISchool } from "@/types/school";

interface AdminDashboardHeaderProps {
  user: User | null;
  school: ISchool | null;
}

export default function AdminDashboardHeader({
  user,
  school,
}: AdminDashboardHeaderProps) {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div
        className={cn("space-y-1", dir === "rtl" ? "text-right" : "text-left")}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin.dashboard.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.dashboard.description", {
            name: user?.firstName,
            school: school?.name,
          })}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/students/create")}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.addStudent.create")}
        </Button>
        <Button onClick={() => navigate("/admin/teachers/create")}>
          <Plus className="h-4 w-4 mr-2" />
          {t("admin.addTeacher.create")}
        </Button>
      </div>
    </div>
  );
}
