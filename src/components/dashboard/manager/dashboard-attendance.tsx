import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttendanceSummary } from "@/types/admin-dashboard";

interface AdminDashboardAttendanceProps {
  attendance: AttendanceSummary;
}

export default function DashboardAttendance({
  attendance,
}: AdminDashboardAttendanceProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600">
            {t("admin.dashboard.attendance.present")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendance.present}</div>
          <p className="text-xs text-muted-foreground">
            {t("admin.dashboard.attendance.students")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-600">
            {t("admin.dashboard.attendance.absent")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendance.absent}</div>
          <p className="text-xs text-muted-foreground">
            {t("admin.dashboard.attendance.students")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-600">
            {t("admin.dashboard.attendance.late")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendance.late}</div>
          <p className="text-xs text-muted-foreground">
            {t("admin.dashboard.attendance.students")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">
            {t("admin.dashboard.attendance.total")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendance.total}</div>
          <p className="text-xs text-muted-foreground">
            {t("admin.dashboard.attendance.students")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
