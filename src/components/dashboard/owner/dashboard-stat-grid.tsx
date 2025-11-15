import StatCard from "@/components/common/dashboard-stat-card";
import { Building2, Users, GraduationCap, BookOpen } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { DashboardStats } from "@/types/owner-dashboard";

export default function DashboardStatsGrid({
  stats,
}: {
  stats: DashboardStats;
}) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("owner.dashboard.stats.totalSchools")}
        value={stats.totalSchools}
        description={t("owner.dashboard.stats.activeSchools", {
          count: stats.activeSchools,
        })}
        icon={<Building2 className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
      />

      <StatCard
        title={t("owner.dashboard.stats.totalStudents")}
        value={stats.totalStudents.toLocaleString()}
        description={t("owner.dashboard.stats.acrossAllSchools")}
        icon={<Users className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
      />

      <StatCard
        title={t("owner.dashboard.stats.totalTeachers")}
        value={stats.totalTeachers.toLocaleString()}
        description={t("owner.dashboard.stats.acrossAllSchools")}
        icon={<GraduationCap className="h-4 w-4" />}
        trend={{ value: 5, isPositive: true }}
      />

      <StatCard
        title={t("owner.dashboard.stats.totalClasses")}
        value={stats.totalClasses}
        description={t("owner.dashboard.stats.activeClasses")}
        icon={<BookOpen className="h-4 w-4" />}
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
