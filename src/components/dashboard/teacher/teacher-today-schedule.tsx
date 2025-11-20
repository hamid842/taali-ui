import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import type { UpcomingClass } from "@/types/teacher-dashboard";

interface TeacherTodayScheduleProps {
  schedule: UpcomingClass[];
  onClassClick?: (classId: number) => void;
}

export default function TeacherTodaySchedule({
  schedule,
  onClassClick,
}: TeacherTodayScheduleProps) {
  const { t } = useLanguage();

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilClass = (startTime: string) => {
    const now = new Date();
    const classTime = new Date(startTime);
    const diffMs = classTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    // Class ended more than 1 hour ago
    if (diffMins < -60) {
      return t("teacher.dashboard.completed");
    }

    // Class is currently in progress (started within last hour)
    if (diffMins < 0) return t("teacher.dashboard.inProgress");

    // Upcoming classes
    if (diffMins < 60)
      return t("teacher.dashboard.inMinutes", { minutes: diffMins });

    const hours = Math.floor(diffMins / 60);
    return t("teacher.dashboard.inHours", { hours });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("teacher.dashboard.todaySchedule")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2" />
            <p>{t("teacher.dashboard.noSchedule")}</p>
          </div>
        ) : (
          schedule.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => onClassClick?.(classItem.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">
                    {classItem.className}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {classItem.subject}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(classItem.startTime)} -{" "}
                    {formatTime(classItem.endTime)}
                  </span>
                  <span>{classItem.room}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {classItem.studentCount} {t("teacher.dashboard.students")}
                  </span>
                  <span className="text-xs font-medium text-blue-600">
                    {getTimeUntilClass(classItem.startTime)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
