import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  UserCheck,
  FileText,
  MessageSquare,
  Award,
} from "lucide-react";
import type { TeacherActivity } from "@/types/teacher-dashboard";

interface TeacherRecentActivityProps {
  activities: TeacherActivity[];
  onActivityClick?: (activity: TeacherActivity) => void;
}

export default function TeacherRecentActivity({
  activities,
  onActivityClick,
}: TeacherRecentActivityProps) {
  const { t } = useLanguage();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case "assignment":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "grading":
        return <Award className="h-4 w-4 text-purple-600" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case "attendance":
        return "default";
      case "assignment":
        return "secondary";
      case "grading":
        return "outline";
      case "message":
        return "default";
      default:
        return "outline";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return t("teacher.dashboard.minutesAgo", { minutes: diffMins });
    } else if (diffHours < 24) {
      return t("teacher.dashboard.hoursAgo", { hours: diffHours });
    } else {
      return t("teacher.dashboard.daysAgo", { days: diffDays });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t("teacher.dashboard.recentActivity")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2" />
            <p>{t("teacher.dashboard.noActivity")}</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => onActivityClick?.(activity)}
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <Badge
                    variant={getActivityBadgeVariant(activity.type)}
                    className="text-xs"
                  >
                    {activity.type}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-1">
                  {activity.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
