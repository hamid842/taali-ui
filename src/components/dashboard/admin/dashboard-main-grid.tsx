import { useLanguage } from "@/hooks/use-language";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
  GradeDistribution,
  ClassSchedule,
  PerformanceMetrics,
  AdminActivityItem,
} from "@/types/admin-dashboard";
import ActivityItem from "./admin-activity-item";
import type { Teacher } from "@/types/teacher";
import type { Student } from "@/types/student";

interface AdminDashboardMainGridProps {
  recentActivity: AdminActivityItem[];
  studentDistribution: GradeDistribution[];
  recentStudents?: Student[];
  recentTeachers?: Teacher[];
  upcomingClasses: ClassSchedule[];
  performanceMetrics?: PerformanceMetrics;
}

export default function AdminDashboardMainGrid({
  recentActivity,
  studentDistribution,
  upcomingClasses,
}: AdminDashboardMainGridProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Recent Activity */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>{t("admin.dashboard.recentActivity")}</CardTitle>
          <CardDescription>
            {t("admin.dashboard.recentActivityDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                {t("admin.dashboard.noActivity")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        {/* Student Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dashboard.studentDistribution")}</CardTitle>
            <CardDescription>
              {t("admin.dashboard.studentDistributionDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentDistribution.map((item, index) => (
                <div
                  key={item.gradeLevel}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                      }}
                    />
                    <span className="text-sm font-medium">
                      {item.gradeLevel}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dashboard.upcomingClasses")}</CardTitle>
            <CardDescription>
              {t("admin.dashboard.upcomingClassesDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.slice(0, 3).map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {classItem.className}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {classItem.teacherName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(classItem.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {classItem.room}
                  </Badge>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <BookOpen className="h-6 w-6 mx-auto mb-2" />
                  {t("admin.dashboard.noUpcomingClasses")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dashboard.quickActions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/students")}
                className="justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                {t("students.manage")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/teachers")}
                className="justify-start"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                {t("teachers.manage")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/classes")}
                className="justify-start"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t("classes.manage")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/attendance")}
                className="justify-start"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {t("attendance.manage")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
