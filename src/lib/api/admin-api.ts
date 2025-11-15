import { studentApi } from "./student-api";
import { teacherApi } from "./teacher-api";
import { classApi } from "./class-api";
import { dashboardUtils } from "@/lib/utils/dashboard-utils";
import { activityUtils } from "@/lib/utils/activity-utils";
import type { ISchool } from "@/types/school";
import type { ActivityItem } from "@/types/owner-dashboard";
import type {
  AdminDashboardStats,
  AttendanceSummary,
  ClassSchedule,
  GradeDistribution,
  UpcomingEvent,
} from "@/types/admin-dashboard";

export const adminApi = {
  // Get comprehensive dashboard statistics for a specific school
  getDashboardStats: async (schoolId: number): Promise<AdminDashboardStats> => {
    try {
      const [studentsResponse, teachers, classes, gradeLevels] =
        await Promise.all([
          studentApi.getBySchool(schoolId, { size: 10, page: 0 }),
          teacherApi.getBySchool(schoolId),
          classApi.getClassesBySchool(schoolId),
          studentApi.getGradeLevels(schoolId),
        ]);

      const totalStudents = studentsResponse.pagination.totalElements;
      const totalTeachers = teachers.length;
      const totalClasses = classes.length;

      // Use shared utility for capacity calculation
      const totalCapacity =
        dashboardUtils.calculateCapacityUtilization(classes);

      // Use shared utility for performance metrics
      const performanceMetrics = dashboardUtils.calculatePerformanceMetrics(
        totalStudents,
        totalTeachers,
        totalClasses,
        totalCapacity,
        1 // Single school for admin
      );

      // Generate recent activity using shared utility with custom messages
      const recentActivity = activityUtils.generateRecentActivity(
        [{ id: schoolId, name: "Current School" } as ISchool],
        [
          "student_registered",
          "teacher_added",
          "class_created",
          "attendance_taken",
        ],
        {
          student_registered: (activity: ActivityItem) =>
            `New student registered: ${activity.itemName}`,
          teacher_added: (activity: ActivityItem) =>
            `New teacher added: ${activity.itemName}`,
          class_created: (activity: ActivityItem) =>
            `New class created: ${activity.itemName}`,
          attendance_taken: (activity: ActivityItem) =>
            `Attendance taken for ${activity.className || "class"}`,
        }
      );

      // Admin-specific calculations
      const studentDistribution = await calculateStudentDistribution(
        schoolId,
        gradeLevels,
        totalStudents
      );
      const attendanceSummary = await calculateAttendanceSummary(schoolId);
      const upcomingClasses = await getUpcomingClasses(schoolId);

      // Get recent students and teachers
      const recentStudents = studentsResponse.items.slice(0, 5);
      const recentTeachers = teachers.slice(0, 5);

      // For now, we'll use a mock school object - you'll need to fetch the actual school
      const school = await getSchoolById(schoolId);

      return {
        school,
        totalStudents,
        totalTeachers,
        totalClasses,
        recentStudents,
        recentTeachers,
        upcomingClasses,
        studentDistribution,
        attendanceSummary,
        recentActivity,
        performanceMetrics,
      };
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      throw new Error("Failed to load admin dashboard data");
    }
  },

  // Get upcoming events for the school
  getUpcomingEvents: async (schoolId: number): Promise<UpcomingEvent[]> => {
    return generateUpcomingEvents(schoolId);
  },

  // Get quick stats for header (simpler version)
  getQuickStats: async (schoolId: number) => {
    const [students, teachers, classes] = await Promise.all([
      studentApi.getBySchool(schoolId, { size: 1 }),
      teacherApi.getBySchool(schoolId),
      classApi.getClassesBySchool(schoolId),
    ]);

    return {
      studentCount: students.pagination.totalElements,
      teacherCount: teachers.length,
      classCount: classes.length,
    };
  },

  // Get student distribution by grade level
  getStudentDistribution: async (
    schoolId: number
  ): Promise<GradeDistribution[]> => {
    const gradeLevels = await studentApi.getGradeLevels(schoolId);
    const studentsResponse = await studentApi.getBySchool(schoolId, {
      size: 1,
    });
    return calculateStudentDistribution(
      schoolId,
      gradeLevels,
      studentsResponse.pagination.totalElements
    );
  },
};

// Helper functions
async function calculateStudentDistribution(
  schoolId: number,
  gradeLevels: string[],
  totalStudents: number
): Promise<GradeDistribution[]> {
  const distribution: GradeDistribution[] = [];

  // For each grade level, get the count of students
  for (const gradeLevel of gradeLevels) {
    try {
      const students = await studentApi.getBySchool(schoolId, {
        gradeLevel,
        size: 1,
      });
      distribution.push({
        gradeLevel,
        count: students.pagination.totalElements,
        percentage: dashboardUtils.calculatePercentage(
          students.pagination.totalElements,
          totalStudents
        ),
      });
    } catch (error) {
      console.error(
        `Error fetching students for grade level ${gradeLevel}:`,
        error
      );
      distribution.push({
        gradeLevel,
        count: 0,
        percentage: 0,
      });
    }
  }

  return distribution;
}

async function getUpcomingClasses(schoolId: number): Promise<ClassSchedule[]> {
  try {
    // This would typically fetch today's class schedule from your schedule API
    // For now, return mock data based on existing classes
    const classes = await classApi.getClassesBySchool(schoolId);

    return classes.slice(0, 3).map((classItem, index) => ({
      id: classItem.id,
      className: classItem.name,
      startTime: new Date(
        Date.now() + (index + 1) * 60 * 60 * 1000
      ).toISOString(), // Next 1, 2, 3 hours
      endTime: new Date(
        Date.now() + (index + 2) * 60 * 60 * 1000
      ).toISOString(),
      teacherName: classItem.mainTeacher
        ? `${classItem.mainTeacher.firstName} ${classItem.mainTeacher.lastName}`
        : "Teacher not assigned",
      room: `Room ${201 + index}`,
    }));
  } catch (error) {
    console.error("Error fetching upcoming classes:", error);
    return [];
  }
}

async function calculateAttendanceSummary(
  schoolId: number
): Promise<AttendanceSummary> {
  try {
    // This would typically fetch real attendance data from your attendance API
    // For now, return realistic mock data based on student count
    const studentsResponse = await studentApi.getBySchool(schoolId, {
      size: 1,
    });
    const totalStudents = studentsResponse.pagination.totalElements;

    // Generate realistic attendance numbers
    const present = Math.floor(totalStudents * 0.92); // 92% present
    const absent = Math.floor(totalStudents * 0.05); // 5% absent
    const late = Math.floor(totalStudents * 0.03); // 3% late

    return {
      present,
      absent,
      late,
      total: totalStudents,
      attendanceRate: Number(((present / totalStudents) * 100).toFixed(1)),
    };
  } catch (error) {
    console.error("Error calculating attendance summary:", error);
    // Return default values if there's an error
    return {
      present: 0,
      absent: 0,
      late: 0,
      total: 0,
      attendanceRate: 0,
    };
  }
}

async function generateUpcomingEvents(
  schoolId: number
): Promise<UpcomingEvent[]> {
  // Mock upcoming events - replace with real data from your events API
  const baseTime = new Date();

  return [
    {
      id: 1,
      title: "Mathematics Class",
      type: "class",
      startTime: new Date(
        baseTime.getTime() + 2 * 60 * 60 * 1000
      ).toISOString(),
      endTime: new Date(baseTime.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      className: "Grade 10 Mathematics",
      teacherName: "Mr. Johnson",
      room: "Room 201",
    },
    {
      id: 2,
      title: "Science Exam",
      type: "exam",
      startTime: new Date(
        baseTime.getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
      endTime: new Date(baseTime.getTime() + 26 * 60 * 60 * 1000).toISOString(),
      className: "Grade 9 Science",
      room: "Room 105",
    },
    {
      id: 3,
      title: "Staff Meeting",
      type: "meeting",
      startTime: new Date(
        baseTime.getTime() + 48 * 60 * 60 * 1000
      ).toISOString(),
      endTime: new Date(baseTime.getTime() + 50 * 60 * 60 * 1000).toISOString(),
      room: "Conference Room",
    },
    {
      id: 4,
      title: "Parent-Teacher Conference",
      type: "event",
      startTime: new Date(
        baseTime.getTime() + 72 * 60 * 60 * 1000
      ).toISOString(),
      endTime: new Date(baseTime.getTime() + 76 * 60 * 60 * 1000).toISOString(),
      room: "Main Hall",
    },
  ];
}

async function getSchoolById(schoolId: number): Promise<ISchool> {
  // This is a placeholder - you'll need to implement actual school fetching
  // You might want to create a schoolApi.getById method or similar
  return {
    id: schoolId,
    name: "School Name",
    code: `SCH${schoolId}`,
    status: "ACTIVE",
    ownerId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teacherCount: 0, // These will be populated by the actual data
    classCount: 0,
    studentCount: 0,
    canteenCount: 0,
  } as ISchool;
}
