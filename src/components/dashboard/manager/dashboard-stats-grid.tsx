import { useLanguage } from "@/hooks/use-language";
import { Users, GraduationCap, BookOpen, UserCheck } from "lucide-react";
import type { AdminDashboardStats } from "@/types/admin-dashboard";
import StatCard from "@/components/common/dashboard-stat-card";

interface AdminDashboardStatsGridProps {
  stats: AdminDashboardStats;
}

export default function AdminDashboardStatsGrid({
  stats,
}: AdminDashboardStatsGridProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("manager.dashboard.stats.totalStudents")}
        value={stats.totalStudents.toLocaleString()}
        description={t("manager.dashboard.stats.activeStudents")}
        icon={<Users className="h-4 w-4" />}
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title={t("manager.dashboard.stats.totalTeachers")}
        value={stats.totalTeachers.toLocaleString()}
        description={t("manager.dashboard.stats.activeTeachers")}
        icon={<GraduationCap className="h-4 w-4" />}
        trend={{ value: 2, isPositive: true }}
      />
      <StatCard
        title={t("manager.dashboard.stats.totalClasses")}
        value={stats.totalClasses}
        description={t("manager.dashboard.stats.activeClasses")}
        icon={<BookOpen className="h-4 w-4" />}
        trend={{ value: 3, isPositive: true }}
      />
      <StatCard
        title={t("manager.dashboard.stats.attendanceRate")}
        value={`${stats.attendanceSummary.attendanceRate}%`}
        description={t("manager.dashboard.stats.todayAttendance")}
        icon={<UserCheck className="h-4 w-4" />}
        trend={{ value: 2.5, isPositive: true }}
      />
    </div>
  );
}
