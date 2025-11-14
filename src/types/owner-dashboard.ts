import type { SchoolClass } from "./class";
import type { ISchool } from "./school";
import type { Student } from "./student";

export interface DashboardStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeSchools: number;
  pendingSchools?: number;
  recentActivity: ActivityItem[];
  schoolDistribution: SchoolDistribution[];
  monthlyGrowth: MonthlyGrowth[];
  topSchools: TopSchool[];
  recentRegistrations: RecentRegistration[];
  performanceMetrics: PerformanceMetrics;
}

export interface ActivityItem {
  id: number;
  type:
    | "school_created"
    | "user_added"
    | "school_updated"
    | "student_registered"
    | "teacher_added"
    | "class_created";
  description: string;
  timestamp: string;
  schoolName?: string;
  userName?: string;
  itemName?: string;
}

export interface SchoolDistribution {
  gradeLevel: string;
  count: number;
  percentage: number;
}

export interface MonthlyGrowth {
  month: string;
  schools: number;
  students: number;
  teachers: number;
  classes: number;
}

export interface TopSchool {
  id: number;
  name: string;
  studentCount: number;
  teacherCount: number;
  classCount: number;
  growth: number;
}

export interface RecentRegistration {
  id: number;
  type: "student" | "teacher" | "class";
  name: string;
  schoolName: string;
  timestamp: string;
  schoolId: number;
}

export interface PerformanceMetrics {
  averageStudentsPerSchool: number;
  averageTeachersPerSchool: number;
  averageClassesPerSchool: number;
  studentTeacherRatio: number;
  capacityUtilization: number;
}

export interface SchoolPerformance {
  schoolId: number;
  schoolName: string;
  studentCount: number;
  teacherCount: number;
  classCount: number;
  studentTeacherRatio: number;
  capacityUtilization: number;
  recentActivity: ActivityItem[];
}

export interface SchoolDataItem {
  school: ISchool;
  studentCount: number;
  teacherCount: number;
  classCount: number;
  classes: SchoolClass[]; 
  students?: Student[]; 
}