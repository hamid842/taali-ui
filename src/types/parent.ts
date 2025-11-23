import type { SchoolSummary } from "./class";
import type { UserRoleType } from "./role";

export interface Parent {
  id?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  occupation?: string;
  notes?: string;
  isActive?: boolean;
}

export interface CreateParentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  occupation?: string;
  address?: string;
  schoolId?: number;
  role?: UserRoleType;
}

export interface DashboardStats {
  totalChildren: number;
  unreadNotifications: number;
  pendingPayments: number;
  overallAttendanceRate: number;
  upcomingEvents: number;
}

export interface Child {
  id: number;
  name: string;
  grade: string;
  className: string;
  schoolName: string;
  attendanceRate: number;
  averageGrade?: string;
  teacherName: string;
  profileImage?: string;
  school?: SchoolSummary;
}

export interface ChildDetail extends Child {
  birthDate?: string;
  emergencyContact?: string;
  medicalNotes?: string;
  enrollmentDate: string;
}
