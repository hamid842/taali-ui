import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import type { AdminActivityItem } from "@/types/admin-dashboard";

interface AdminActivityItemProps {
  activity: AdminActivityItem;
}

export default function AdminActivityItem({
  activity,
}: AdminActivityItemProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "student_registered":
        return <Users className="h-4 w-4 text-green-500" />;
      case "teacher_added":
        return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case "class_created":
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case "attendance_taken":
        return <UserCheck className="h-4 w-4 text-orange-500" />;
      case "assignment_created":
        return <TrendingUp className="h-4 w-4 text-indigo-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-4 py-3">
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          {getActivityIcon(activity.type)}
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">
          {activity.description}
        </p>
        <p className="text-sm text-muted-foreground">
          {new Date(activity.timestamp).toLocaleDateString()} •{" "}
          {new Date(activity.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
