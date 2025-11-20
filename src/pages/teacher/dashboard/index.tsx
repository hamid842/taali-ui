import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, FileText, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
  TeacherDashboardStats,
  TeacherClassDetail,
  UpcomingClass,
  TeacherActivity,
  TeacherClass,
} from "@/types/teacher-dashboard";
import { teacherDashboardApi } from "@/lib/api/teacher-dashboard-api";
import TeacherStatsGrid from "@/components/dashboard/teacher/teacher-stats-grid";
import TeacherTodaySchedule from "@/components/dashboard/teacher/teacher-today-schedule";
import TeacherRecentActivity from "@/components/dashboard/teacher/teacher-recent-activity";
import TeacherClassesList from "@/components/dashboard/teacher/teacher-classes-list";

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<UpcomingClass[]>([]);
  const [recentActivity, setRecentActivity] = useState<TeacherActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const teacherId = user!.id;

      const [statsData, classesData, scheduleData, activityData] =
        await Promise.all([
          teacherDashboardApi.getDashboardStats(teacherId),
          teacherDashboardApi.getTeacherClasses(teacherId),
          teacherDashboardApi.getTodaySchedule(teacherId),
          teacherDashboardApi.getRecentActivity(teacherId),
        ]);

      setStats(statsData);
      setClasses(classesData);
      setTodaySchedule(scheduleData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error loading teacher dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [loadDashboardData, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t("teacher.dashboard.welcome")}, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            {t("teacher.dashboard.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/teacher/my-classes")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {t("teacher.dashboard.viewAllClasses")}
          </Button>
          <Button onClick={() => navigate("/teacher/attendance")}>
            <Users className="h-4 w-4 mr-2" />
            {t("teacher.dashboard.takeAttendance")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && <TeacherStatsGrid stats={stats} />}

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-1">
          <TeacherTodaySchedule
            schedule={todaySchedule}
            onClassClick={(classId) => navigate(`/teacher/classes/${classId}`)}
          />
        </div>

        {/* My Classes */}
        <div className="lg:col-span-1">
          <TeacherClassesList
            classes={classes}
            onClassClick={(classId) => navigate(`/teacher/classes/${classId}`)}
          />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <TeacherRecentActivity
            activities={recentActivity}
            onActivityClick={(activity) => {
              if (activity.classId) {
                navigate(`/teacher/classes/${activity.classId}`);
              }
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("teacher.dashboard.quickActions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/teacher/attendance")}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">{t("teacher.attendance.take")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/teacher/grading")}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">{t("teacher.grading.enter")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/teacher/assignments")}
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">{t("teacher.assignments.create")}</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/teacher/messages")}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">{t("teacher.messages.send")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
