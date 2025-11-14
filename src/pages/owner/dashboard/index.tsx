import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import OwnerDashboardSkeleton from "@/components/skeleton/dashboard/owner-dashboard-skeleton";
import type { DashboardStats } from "@/types/owner-dashboard";
import { ownerApi } from "@/lib/api/owner-api";
import { Activity } from "lucide-react";
import DashboardHeader from "@/components/dashboard/owner/dashboard-header";
import DashboardStatsGrid from "@/components/dashboard/owner/dashboard-stat-grid";
import DashboardPerformanceMetrics from "@/components/dashboard/owner/dashboard-performance-metrics";
import DashboardMainGrid from "@/components/dashboard/owner/dashboard-main-grid";
import DashboardGrowthOverview from "@/components/dashboard/owner/dashboard-growth-overview";
import DashboardRegistrations from "@/components/dashboard/owner/dashboard-registrations";

export default function OwnerDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ownerApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(t("owner.dashboard.error.loading"));
      toast.error(t("owner.dashboard.error.loading"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Loading state
  if (loading) return <OwnerDashboardSkeleton />;

  // Error state
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">
          {t("owner.dashboard.error.title")}
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
      <DashboardHeader user={user} />
      <DashboardStatsGrid stats={stats} />
      <DashboardPerformanceMetrics metrics={stats.performanceMetrics} />
      <DashboardMainGrid
        recentActivity={stats.recentActivity}
        schoolDistribution={stats.schoolDistribution}
        topSchools={stats.topSchools}
      />
      <DashboardGrowthOverview months={stats.monthlyGrowth} />
      {stats.recentRegistrations?.length > 0 && (
        <DashboardRegistrations registrations={stats.recentRegistrations} />
      )}
    </div>
  );
}
