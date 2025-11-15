import { schoolApi } from "./school-api";
import { studentApi } from "./student-api";
import { teacherApi } from "./teacher-api";
import { classApi } from "./class-api";
import type {
  ActivityItem,
  DashboardStats,
  RecentRegistration,
  SchoolDataItem,
  SchoolDistribution,
  SchoolPerformance,
  TopSchool,
} from "@/types/owner-dashboard";
import { dashboardUtils } from "@/lib/utils/dashboard-utils";
import { activityUtils } from "@/lib/utils/activity-utils";
import type { ISchool } from "@/types/school";
import type { StudentListResponse } from "@/types/student";
import type { Teacher } from "@/types/teacher";
import type { ClassResponse } from "@/types/class";

export const ownerApi = {
  // Get comprehensive dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const schools = await schoolApi.getMySchools();

      const schoolPromises = schools.map(async (school) => {
        try {
          const [studentsResponse, teachers, classes] = await Promise.all([
            studentApi.getBySchool(school.id, { size: 1 }),
            teacherApi.getBySchool(school.id),
            classApi.getClassesBySchool(school.id),
          ]);

          return {
            school,
            studentCount: studentsResponse.pagination.totalElements,
            teacherCount: teachers.length,
            classCount: classes.length,
            classes,
          };
        } catch (error) {
          console.error(`Error fetching data for school ${school.id}:`, error);
          return {
            school,
            studentCount: 0,
            teacherCount: 0,
            classCount: 0,
            classes: [],
          };
        }
      });

      const schoolData = await Promise.all(schoolPromises);

      // Calculate totals using shared utility
      const totalStudents = schoolData.reduce(
        (sum, data) => sum + data.studentCount,
        0
      );
      const totalTeachers = schoolData.reduce(
        (sum, data) => sum + data.teacherCount,
        0
      );
      const totalClasses = schoolData.reduce(
        (sum, data) => sum + data.classCount,
        0
      );

      // Calculate capacity using shared utility
      const totalCapacity = dashboardUtils.calculateCapacityUtilization(
        schoolData.flatMap((data) => data.classes)
      );

      // Calculate performance metrics using shared utility
      const performanceMetrics = dashboardUtils.calculatePerformanceMetrics(
        totalStudents,
        totalTeachers,
        totalClasses,
        totalCapacity,
        schools.length 
      );

      // Prepare top schools
      const topSchools: TopSchool[] = schoolData
        .map((data) => ({
          id: data.school.id,
          name: data.school.name,
          studentCount: data.studentCount,
          teacherCount: data.teacherCount,
          classCount: data.classCount,
          growth: Math.floor(Math.random() * 20) + 5,
        }))
        .sort((a, b) => b.studentCount - a.studentCount)
        .slice(0, 5);

      // Get school distribution
      const schoolDistribution = calculateSchoolDistribution(schools);

      // Generate recent activity using shared utility
      const recentActivity = activityUtils.generateRecentActivity(schools, [
        "school_created",
        "student_registered",
        "teacher_added",
        "class_created",
      ]);

      // Get recent registrations
      const recentRegistrations = await generateRecentRegistrations(schoolData);

      // Get monthly growth data using shared utility
      const monthlyGrowth = dashboardUtils.generateMonthlyGrowth(schoolData);

      return {
        totalSchools: schools.length,
        totalStudents,
        totalTeachers,
        totalClasses,
        activeSchools: schools.length,
        recentActivity,
        schoolDistribution,
        monthlyGrowth,
        topSchools,
        recentRegistrations,
        performanceMetrics,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to load dashboard data");
    }
  },

  // Get recent schools (last 5 created)
  getRecentSchools: async (): Promise<ISchool[]> => {
    const schools = await schoolApi.getMySchools();
    return schools
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  },

  // Get detailed performance data for a specific school
  getSchoolPerformance: async (
    schoolId: number
  ): Promise<SchoolPerformance> => {
    try {
      const [school, students, teachers, classes] = await Promise.all([
        schoolApi.getSchoolById(schoolId.toString()),
        studentApi.getBySchool(schoolId, { size: 1 }),
        teacherApi.getBySchool(schoolId),
        classApi.getClassesBySchool(schoolId),
      ]);

      const totalCapacity =
        dashboardUtils.calculateCapacityUtilization(classes);

      // Use shared utility for consistency
      const performanceMetrics = dashboardUtils.calculatePerformanceMetrics(
        students.pagination.totalElements,
        teachers.length,
        classes.length,
        totalCapacity,
        1 // Single school for admin-like view
      );

      const recentActivity = await generateSchoolActivity(
        school,
        students,
        teachers,
        classes
      );

      return {
        schoolId: school.id,
        schoolName: school.name,
        studentCount: students.pagination.totalElements,
        teacherCount: teachers.length,
        classCount: classes.length,
        studentTeacherRatio: performanceMetrics.studentTeacherRatio,
        capacityUtilization: performanceMetrics.capacityUtilization,
        recentActivity,
      };
    } catch (error) {
      console.error(
        `Error fetching performance for school ${schoolId}:`,
        error
      );
      throw error;
    }
  },

  // Get performance comparison across all schools
  getSchoolsPerformance: async (): Promise<SchoolPerformance[]> => {
    const schools = await schoolApi.getMySchools();

    const performancePromises = schools.map((school) =>
      ownerApi.getSchoolPerformance(school.id)
    );

    return Promise.all(performancePromises);
  },
};

// Helper function to calculate school distribution
function calculateSchoolDistribution(schools: ISchool[]): SchoolDistribution[] {
  const distribution: { [key: string]: number } = {};

  schools.forEach((school) => {
    // Use school type, level, or other classification
    const type = school.type || "General";
    distribution[type] = (distribution[type] || 0) + 1;
  });

  const total = schools.length;

  return Object.entries(distribution).map(([gradeLevel, count]) => ({
    gradeLevel,
    count,
    // Use shared utility for consistency
    percentage: dashboardUtils.calculatePercentage(count, total),
  }));
}

// Helper function to generate recent registrations
async function generateRecentRegistrations(
  schoolData: SchoolDataItem[]
): Promise<RecentRegistration[]> {
  const registrations: RecentRegistration[] = [];
  const registrationTypes: RecentRegistration["type"][] = [
    "student",
    "teacher",
    "class",
  ];

  // Generate registrations for the last 7 days
  for (let i = 0; i < 8; i++) {
    const data = schoolData[Math.floor(Math.random() * schoolData.length)];
    const type =
      registrationTypes[Math.floor(Math.random() * registrationTypes.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const timestamp = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    let name = "";
    switch (type) {
      case "student":
        name = `Student ${Math.floor(Math.random() * 1000) + 1}`;
        break;
      case "teacher":
        name = `Teacher ${Math.floor(Math.random() * 100) + 1}`;
        break;
      case "class":
        name = `Class ${Math.floor(Math.random() * 50) + 1}`;
        break;
    }

    registrations.push({
      id: i + 1,
      type,
      name,
      schoolName: data.school.name,
      timestamp,
      schoolId: data.school.id,
    });
  }

  // Sort by timestamp (newest first)
  return registrations.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Helper function to generate school-specific activity
async function generateSchoolActivity(
  school: ISchool,
  students: StudentListResponse,
  teachers: Teacher[],
  classes: ClassResponse[]
): Promise<ActivityItem[]> {
  const activities: ActivityItem[] = [];
  const now = new Date();

  // Add some recent student registrations
  if (students.pagination.totalElements > 0) {
    activities.push({
      id: 1,
      type: "student_registered" as const,
      description: `${students.pagination.totalElements} students currently enrolled`,
      timestamp: now.toISOString(),
      schoolName: school.name,
    });
  }

  // Add teacher activity
  if (teachers.length > 0) {
    activities.push({
      id: 2,
      type: "teacher_added" as const,
      description: `${teachers.length} teachers currently teaching`,
      timestamp: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      schoolName: school.name,
    });
  }

  // Add class activity
  if (classes.length > 0) {
    activities.push({
      id: 3,
      type: "class_created" as const,
      description: `${classes.length} active classes`,
      timestamp: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      schoolName: school.name,
    });
  }

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
