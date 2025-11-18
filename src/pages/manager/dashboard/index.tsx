import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin-api";
import { School } from "lucide-react";
import type { AdminDashboardStats } from "@/types/admin-dashboard";
import AdminDashboardSkeleton from "@/components/skeleton/dashboard/admin-dashboard-skeleton";
import DashboardStatsGrid from "@/components/dashboard/manager/dashboard-stats-grid";
import DashboardHeader from "@/components/dashboard/manager/dashboard-header";
import { useAppStore } from "@/stores/app-store";
import DashboardAttendance from "@/components/dashboard/manager/dashboard-attendance";
import DashboardMainGrid from "@/components/dashboard/manager/dashboard-main-grid";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { currentSchool } = useAppStore();

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      if (!currentSchool?.id) {
        throw new Error("No school assigned to admin");
      }

      const data = await adminApi.getDashboardStats(currentSchool?.id);
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      setError(t("manager.dashboard.error.loading"));
      toast.error(t("manager.dashboard.error.loading"));
    } finally {
      setLoading(false);
    }
  }, [t, currentSchool?.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Loading state
  if (loading) return <AdminDashboardSkeleton />;

  // Error state
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">
          {t("manager.dashboard.error.title")}
        </h3>
        <p className="text-muted-foreground mt-2">{error}</p>
        <button className="btn mt-4" onClick={loadDashboardData}>
          {t("common.retry")}
        </button>
      </div>
    );

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} school={currentSchool} />
      <DashboardStatsGrid stats={stats} />
      <DashboardAttendance attendance={stats.attendanceSummary} />
      <DashboardMainGrid
        recentActivity={stats.recentActivity}
        studentDistribution={stats.studentDistribution}
        recentStudents={stats.recentStudents}
        recentTeachers={stats.recentTeachers}
        upcomingClasses={stats.upcomingClasses}
        performanceMetrics={stats.performanceMetrics}
      />
    </div>
  );
}
