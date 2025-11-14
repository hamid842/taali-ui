import { useLanguage } from "@/hooks/use-language";
import type { ActivityItem } from "@/types/owner-dashboard";
import {
  Activity,
  BookOpen,
  GraduationCap,
  School,
  UserCheck,
  Users,
} from "lucide-react";

export default function DashboardActivityItem({ activity }: { activity: ActivityItem }) {
  const { t } = useLanguage();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "school_created":
        return <School className="h-4 w-4 text-green-500" />;
      case "user_added":
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case "school_updated":
        return <Activity className="h-4 w-4 text-orange-500" />;
      case "student_registered":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "teacher_added":
        return <GraduationCap className="h-4 w-4 text-indigo-500" />;
      case "class_created":
        return <BookOpen className="h-4 w-4 text-amber-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "school_created":
        return t("owner.dashboard.activity.schoolCreated", {
          school: activity.schoolName,
        });
      case "user_added":
        return t("owner.dashboard.activity.userAdded", {
          user: activity.userName,
        });
      case "school_updated":
        return t("owner.dashboard.activity.schoolUpdated", {
          school: activity.schoolName,
        });
      case "student_registered":
        return t("owner.dashboard.activity.studentRegistered", {
          student: activity.itemName,
          school: activity.schoolName,
        });
      case "teacher_added":
        return t("owner.dashboard.activity.teacherAdded", {
          teacher: activity.itemName,
          school: activity.schoolName,
        });
      case "class_created":
        return t("owner.dashboard.activity.classCreated", {
          class: activity.itemName,
          school: activity.schoolName,
        });
      default:
        return activity.description;
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
          {getActivityText(activity)}
        </p>
        <p className="text-sm text-muted-foreground">
          {new Date(activity.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
