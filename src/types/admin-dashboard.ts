import type { ISchool } from "./school";
import type { Student } from "./student";
import type { Teacher } from "./teacher";

export interface AdminDashboardStats {
  school: ISchool;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  recentStudents: Student[];
  recentTeachers: Teacher[];
  upcomingClasses: ClassSchedule[];
  studentDistribution: GradeDistribution[];
  attendanceSummary: AttendanceSummary;
  recentActivity: AdminActivityItem[];
  performanceMetrics: PerformanceMetrics;
}

export interface GradeDistribution {
  gradeLevel: string;
  count: number;
  percentage: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  total: number;
  attendanceRate: number;
}

export interface AdminActivityItem {
  id: number;
  type:
    | "student_registered"
    | "teacher_added"
    | "class_created"
    | "attendance_taken"
    | "assignment_created";
  description: string;
  timestamp: string;
  userName?: string;
  className?: string;
}

export interface ClassSchedule {
  id: number;
  className: string;
  startTime: string;
  endTime: string;
  teacherName: string;
  room?: string;
}

export interface PerformanceMetrics {
  averageStudentsPerSchool: number;
  averageTeachersPerSchool: number;
  averageClassesPerSchool: number;
  studentTeacherRatio: number;
  capacityUtilization: number;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  type: "class" | "meeting" | "exam" | "event";
  startTime: string;
  endTime: string;
  className?: string;
  teacherName?: string;
  room?: string;
}
