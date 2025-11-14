import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Building2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
  SchoolDistribution,
  TopSchool,
  ActivityItem,
} from "@/types/owner-dashboard";
import DashboardActivityItem from "./dashboard-activity-item";

type DashboardMainGridProps = {
  recentActivity: ActivityItem[];
  schoolDistribution: SchoolDistribution[];
  topSchools: TopSchool[];
};

export default function DashboardMainGrid({
  recentActivity,
  schoolDistribution,
  topSchools,
}: DashboardMainGridProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Recent Activity */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>{t("owner.dashboard.recentActivity")}</CardTitle>
          <CardDescription>
            {t("owner.dashboard.recentActivityDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.map((a) => (
              <DashboardActivityItem key={a.id} activity={a} />
            ))}

            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                {t("owner.dashboard.noActivity")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* School distribution & top schools */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>{t("owner.dashboard.schoolDistribution")}</CardTitle>
          <CardDescription>
            {t("owner.dashboard.schoolDistributionDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Distribution */}
          <div className="space-y-4">
            {schoolDistribution.map((item, idx) => (
              <div
                key={item.gradeLevel}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: `hsl(${idx * 40}, 70%, 50%)` }}
                  />
                  <span className="text-sm font-medium">{item.gradeLevel}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>

          {/* Top schools */}
          {topSchools?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">
                {t("owner.dashboard.topSchools")}
              </h4>
              <div className="space-y-2">
                {topSchools.slice(0, 3).map((school, idx) => (
                  <div
                    key={school.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="h-6 w-6 flex items-center justify-center p-0"
                      >
                        {idx + 1}
                      </Badge>
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {school.name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {school.studentCount} {t("common.students")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">
              {t("owner.dashboard.quickActions")}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/owner/schools")}
                className="justify-start"
              >
                <Building2 className="h-4 w-4 mr-2" />
                {t("schools.manage")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/owner/users")}
                className="justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                {t("users.manage")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
