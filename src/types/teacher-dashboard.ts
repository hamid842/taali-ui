export interface TeacherDashboardStats {
  totalStudents: number;
  totalClasses: number;
  upcomingClasses: number;
  attendanceRate: number;
  averageGrade?: number;
}

export interface TeacherClassDetail {
  id: number;
  className: string;
  subject: string;
  gradeLevel: string;
  studentCount: number;
  schedule: string;
  room: string;
  isActive: boolean;
  mainTeacher?: boolean;
  classCode?: string;
  description?: string;
}

export interface UpcomingClass {
  id: number;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  studentCount: number;
}

export interface TeacherActivity {
  id: number;
  type: "attendance" | "grading" | "assignment" | "message";
  title: string;
  description: string;
  timestamp: string;
  classId?: number;
}

// For the class list with additional details
export interface TeacherClassWithDetails extends TeacherClassDetail {
  recentAttendance?: number;
  nextAssignment?: string;
  lastActivity?: string;
}

// For the schedule with additional context
export interface ScheduleWithContext extends UpcomingClass {
  isNow: boolean;
  timeUntil: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}
