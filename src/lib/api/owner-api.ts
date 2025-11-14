import { schoolApi } from "./school-api";
import { studentApi } from "./student-api";
import { teacherApi } from "./teacher-api";
import { classApi } from "./class-api";
import type { ISchool } from "@/types/school";
import type {
  ActivityItem,
  DashboardStats,
  MonthlyGrowth,
  PerformanceMetrics,
  RecentRegistration,
  SchoolDataItem,
  SchoolDistribution,
  SchoolPerformance,
  TopSchool,
} from "@/types/owner-dashboard";
import type { StudentListResponse } from "@/types/student";
import type { Teacher } from "@/types/teacher";
import type { ClassResponse } from "@/types/class";

export const ownerApi = {
  // Get comprehensive dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const schools = await schoolApi.getMySchools();

      // Fetch data for all schools in parallel
      const schoolPromises = schools.map(async (school) => {
        try {
          const [studentsResponse, teachers, classes] = await Promise.all([
            studentApi.getBySchool(school.id, { size: 1 }), // Just get count
            teacherApi.getBySchool(school.id),
            classApi.getClassesBySchool(school.id),
          ]);

          return {
            school,
            studentCount: studentsResponse.pagination.totalElements,
            teacherCount: teachers.length,
            classCount: classes.length,
            classes, // We need class details for capacity calculation
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

      // Calculate totals
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

      // Calculate capacity utilization
      const totalCapacity = schoolData.reduce((sum, data) => {
        const schoolCapacity = data.classes.reduce(
          (classSum, classItem) => classSum + (classItem.capacity || 0),
          0
        );
        return sum + schoolCapacity;
      }, 0);

      const capacityUtilization =
        totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;

      // Prepare top schools (sorted by student count)
      const topSchools: TopSchool[] = schoolData
        .map((data) => ({
          id: data.school.id,
          name: data.school.name,
          studentCount: data.studentCount,
          teacherCount: data.teacherCount,
          classCount: data.classCount,
          growth: Math.floor(Math.random() * 20) + 5, // Simulated growth percentage
        }))
        .sort((a, b) => b.studentCount - a.studentCount)
        .slice(0, 5);

      // Get school distribution by type/level
      const schoolDistribution = calculateSchoolDistribution(schools);

      // Get recent activity (simulated - you can replace with actual activity logs)
      const recentActivity = await generateRecentActivity(schools);

      // Get recent registrations (last 7 days)
      const recentRegistrations = await generateRecentRegistrations(schoolData);

      // Get monthly growth data (last 6 months)
      const monthlyGrowth = generateMonthlyGrowth(schoolData);

      // Calculate performance metrics
      const performanceMetrics: PerformanceMetrics = {
        averageStudentsPerSchool:
          schools.length > 0 ? Math.round(totalStudents / schools.length) : 0,
        averageTeachersPerSchool:
          schools.length > 0 ? Math.round(totalTeachers / schools.length) : 0,
        averageClassesPerSchool:
          schools.length > 0 ? Math.round(totalClasses / schools.length) : 0,
        studentTeacherRatio:
          totalTeachers > 0
            ? Number((totalStudents / totalTeachers).toFixed(1))
            : 0,
        capacityUtilization: Number(capacityUtilization.toFixed(1)),
      };

      return {
        totalSchools: schools.length,
        totalStudents,
        totalTeachers,
        totalClasses,
        activeSchools: schools.length, // Assuming all are active
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
        studentApi.getBySchool(schoolId, { size: 10, page: 0 }),
      ]);

      // Calculate capacity utilization for this school
      const totalCapacity = classes.reduce(
        (sum, classItem) => sum + (classItem.capacity || 0),
        0
      );
      const capacityUtilization =
        totalCapacity > 0
          ? (students.pagination.totalElements / totalCapacity) * 100
          : 0;

      // Generate recent activity for this school
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
        studentTeacherRatio:
          teachers.length > 0
            ? Number(
                (students.pagination.totalElements / teachers.length).toFixed(1)
              )
            : 0,
        capacityUtilization: Number(capacityUtilization.toFixed(1)),
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

  // Get growth analytics for the last 12 months
  getGrowthAnalytics: async (): Promise<MonthlyGrowth[]> => {
    // This would typically come from a dedicated analytics endpoint
    // For now, we'll generate simulated data
    return generateMonthlyGrowth([]);
  },
};

// Helper function to calculate school distribution
function calculateSchoolDistribution(schools: ISchool[]): SchoolDistribution[] {
  // Group schools by type or level (you might need to adjust based on your school model)
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
    percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
  }));
}

// Helper function to generate recent activity
async function generateRecentActivity(
  schools: ISchool[]
): Promise<ActivityItem[]> {
  const activities: ActivityItem[] = [];
  const activityTypes: ActivityItem["type"][] = [
    "school_created",
    "student_registered",
    "teacher_added",
    "class_created",
  ];

  // Generate activities for the last 30 days
  for (let i = 0; i < 15; i++) {
    const school = schools[Math.floor(Math.random() * schools.length)];
    const activityType =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(
      Date.now() - daysAgo * 24 * 60 * 60 * 1000
    ).toISOString();

    let description = "";
    let itemName = "";

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

  // Sort by timestamp (newest first)
  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10); // Return only last 10 activities
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

// Helper function to generate monthly growth data
function generateMonthlyGrowth(schoolData: SchoolDataItem[]): MonthlyGrowth[] {
  const months = [];
  const currentDate = new Date();

  // Generate data for the last 6 months
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

    // Simulate growth (in a real app, this would come from historical data)
    const baseSchools = Math.max(1, schoolData.length - (5 - i));
    const baseStudents = Math.max(
      10,
      schoolData.reduce((sum, data) => sum + data.studentCount, 0) -
        (5 - i) * 50
    );
    const baseTeachers = Math.max(
      2,
      schoolData.reduce((sum, data) => sum + data.teacherCount, 0) -
        (5 - i) * 10
    );
    const baseClasses = Math.max(
      1,
      schoolData.reduce((sum, data) => sum + data.classCount, 0) - (5 - i) * 5
    );

    const growthFactor = 1 + i * 0.1; // Increasing growth over months

    months.push({
      month: monthName,
      schools: Math.floor(baseSchools * growthFactor),
      students: Math.floor(baseStudents * growthFactor),
      teachers: Math.floor(baseTeachers * growthFactor),
      classes: Math.floor(baseClasses * growthFactor),
    });
  }

  return months;
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
      type: "student_registered",
      description: `${students.pagination.totalElements} students currently enrolled`,
      timestamp: now.toISOString(),
      schoolName: school.name,
    });
  }

  // Add teacher activity
  if (teachers.length > 0) {
    activities.push({
      id: 2,
      type: "teacher_added",
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
      type: "class_created",
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
