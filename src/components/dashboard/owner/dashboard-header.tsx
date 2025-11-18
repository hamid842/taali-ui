import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "@/types/auth";

export default function DashboardHeader({ user }: { user: LoginResponse | null }) {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div
        className={cn("space-y-1", dir === "rtl" ? "text-right" : "text-left")}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          {t("owner.dashboard.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("owner.dashboard.description", { name: user?.firstName })}
        </p>
      </div>

      <Button onClick={() => navigate("/owner/schools/create")}>
        <Plus className="h-4 w-4 mr-2" />
        {t("owner.addSchool.create")}
      </Button>
    </div>
  );
}
