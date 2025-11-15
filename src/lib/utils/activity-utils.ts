import type { ActivityItem } from "@/types/owner-dashboard";
import type { ISchool } from "@/types/school";

export interface ActivityConfig {
  getIcon: (type: string) => string;
  getText: (activity: ActivityItem) => string;
  getColor: (type: string) => string;
}

export const activityUtils = {
  // Generate recent activity (shared logic)
  generateRecentActivity: (
    schools: ISchool[],
    activityTypes: ActivityItem["type"][],
    customMessages?: Record<string, (activity: ActivityItem) => string>
  ): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    for (let i = 0; i < Math.min(15, schools.length * 2); i++) {
      const school = schools[Math.floor(Math.random() * schools.length)];
      const activityType =
        activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date(
        Date.now() - daysAgo * 24 * 60 * 60 * 1000
      ).toISOString();

      let description = "";
      let itemName = "";

      // Use custom message if provided, otherwise use default
      if (customMessages && customMessages[activityType]) {
        description = customMessages[activityType]({ school, itemName });
      } else {
        switch (activityType) {
          case "school_created":
            description = `New school registered: ${school.name}`;
            break;
          case "student_registered":
            itemName = `Student ${Math.floor(Math.random() * 1000) + 1}`;
            description = `New student registered: ${itemName}`;
            break;
          case "teacher_added":
            itemName = `Teacher ${Math.floor(Math.random() * 100) + 1}`;
            description = `New teacher added: ${itemName}`;
            break;
          case "class_created":
            itemName = `Class ${Math.floor(Math.random() * 50) + 1}`;
            description = `New class created: ${itemName}`;
            break;
          default:
            description = `Activity: ${activityType}`;
        }
      }

      activities.push({
        id: i + 1,
        type: activityType,
        description,
        timestamp,
        schoolName: school.name,
        itemName,
      });
    }

    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  },

  // Get activity icon (shared)
  getActivityIcon: (type: string): string => {
    const iconMap: Record<string, string> = {
      school_created: "School",
      user_added: "UserCheck",
      school_updated: "Activity",
      student_registered: "Users",
      teacher_added: "GraduationCap",
      class_created: "BookOpen",
      attendance_taken: "UserCheck",
      assignment_created: "TrendingUp",
    };
    return iconMap[type] || "Activity";
  },

  // Get activity color (shared)
  getActivityColor: (type: string): string => {
    const colorMap: Record<string, string> = {
      school_created: "text-green-500",
      user_added: "text-blue-500",
      school_updated: "text-orange-500",
      student_registered: "text-purple-500",
      teacher_added: "text-indigo-500",
      class_created: "text-amber-500",
      attendance_taken: "text-green-500",
      assignment_created: "text-blue-500",
    };
    return colorMap[type] || "text-gray-500";
  },
};
