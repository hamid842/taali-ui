import { useLanguage } from "@/hooks/use-language";
import { Users, BookOpen, Clock, TrendingUp } from "lucide-react";
import type { TeacherDashboardStats } from "@/types/teacher-dashboard";
import StatCard from "@/components/common/dashboard-stat-card";

interface TeacherStatsGridProps {
  stats: TeacherDashboardStats;
}

export default function TeacherStatsGrid({ stats }: TeacherStatsGridProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t("teacher.dashboard.stats.totalStudents")}
        value={stats.totalStudents.toLocaleString()}
        description={t("teacher.dashboard.stats.acrossAllClasses")}
        icon={<Users className="h-4 w-4" />}
      />
      <StatCard
        title={t("teacher.dashboard.stats.totalClasses")}
        value={stats.totalClasses.toString()}
        description={t("teacher.dashboard.stats.assignedClasses")}
        icon={<BookOpen className="h-4 w-4" />}
      />
      <StatCard
        title={t("teacher.dashboard.stats.upcomingClasses")}
        value={stats.upcomingClasses.toString()}
        description={t("teacher.dashboard.stats.today")}
        icon={<Clock className="h-4 w-4" />}
      />
      <StatCard
        title={t("teacher.dashboard.stats.attendanceRate")}
        value={`${stats.attendanceRate}%`}
        description={t("teacher.dashboard.stats.overallAttendance")}
        icon={<TrendingUp className="h-4 w-4" />}
        trend={{ value: 2.5, isPositive: stats.attendanceRate > 85 }}
      />
    </div>
  );
}
