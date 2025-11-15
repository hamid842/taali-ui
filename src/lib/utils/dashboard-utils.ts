import type { SchoolClass } from "@/types/class";
import type { MonthlyGrowth } from "@/types/owner-dashboard";

// Common interfaces that can be shared
export interface BaseActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export interface BaseStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

export interface PerformanceMetrics {
  averageStudentsPerSchool: number;
  averageTeachersPerSchool: number;
  averageClassesPerSchool: number;
  studentTeacherRatio: number;
  capacityUtilization: number;
}

// Shared helper functions
export const dashboardUtils = {
  // Calculate performance metrics (shared between owner and admin)
  calculatePerformanceMetrics: (
    totalStudents: number,
    totalTeachers: number,
    totalClasses: number,
    totalCapacity: number,
    schoolCount?: number
  ): PerformanceMetrics => {
    const capacityUtilization =
      totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;

    // Always return numbers, use 0 as default when schoolCount is not provided
    const avgStudents =
      schoolCount && schoolCount > 0
        ? Math.round(totalStudents / schoolCount)
        : 0;
    const avgTeachers =
      schoolCount && schoolCount > 0
        ? Math.round(totalTeachers / schoolCount)
        : 0;
    const avgClasses =
      schoolCount && schoolCount > 0
        ? Math.round(totalClasses / schoolCount)
        : 0;

    return {
      averageStudentsPerSchool: avgStudents,
      averageTeachersPerSchool: avgTeachers,
      averageClassesPerSchool: avgClasses,
      studentTeacherRatio:
        totalTeachers > 0
          ? Number((totalStudents / totalTeachers).toFixed(1))
          : 0,
      capacityUtilization: Number(capacityUtilization.toFixed(1)),
    };
  },

  // Calculate capacity utilization (shared)
  calculateCapacityUtilization: (classes: SchoolClass[]): number => {
    const totalCapacity = classes.reduce(
      (sum, classItem) => sum + (classItem.capacity || 0),
      0
    );
    return totalCapacity;
  },

  // Generate monthly growth data (shared)
  generateMonthlyGrowth: (
    baseData: {
      studentCount: number;
      teacherCount: number;
      classCount: number;
    }[]
  ): MonthlyGrowth[] => {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      const baseStudents = Math.max(
        10,
        baseData.reduce((sum, data) => sum + data.studentCount, 0) -
          (5 - i) * 50
      );
      const baseTeachers = Math.max(
        2,
        baseData.reduce((sum, data) => sum + data.teacherCount, 0) -
          (5 - i) * 10
      );
      const baseClasses = Math.max(
        1,
        baseData.reduce((sum, data) => sum + data.classCount, 0) - (5 - i) * 5
      );

      const growthFactor = 1 + i * 0.1;

      months.push({
        month: monthName,
        students: Math.floor(baseStudents * growthFactor),
        teachers: Math.floor(baseTeachers * growthFactor),
        classes: Math.floor(baseClasses * growthFactor),
      });
    }

    return months;
  },

  // Format numbers with localization (shared)
  formatNumber: (num: number): string => {
    return num.toLocaleString();
  },

  // Calculate percentages (shared)
  calculatePercentage: (part: number, total: number): number => {
    return total > 0 ? Number(((part / total) * 100).toFixed(1)) : 0;
  },

  // Get time ago string (shared)
  getTimeAgo: (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  },
};
