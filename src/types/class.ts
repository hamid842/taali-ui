import type { DayOfWeek } from "./schedule";

export interface SchoolClass {
  id: number;
  name: string;
  gradeLevel?: string;
  academicYear: string;
  capacity: number;
  isActive: boolean;
  school?: SchoolSummary;
  mainTeacher?: TeacherSummary;
  studentCount: number;
  teacherCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolClassDetail extends SchoolClass {
  students: StudentSummary[];
  teachers: TeacherSummary[];
  schedules: ClassSchedule[];
}

export interface CreateSchoolClassRequest {
  name: string;
  gradeLevel?: string;
  academicYear: string;
  capacity: number;
  schoolId: number;
  mainTeacherId?: number;
  studentIds: number[];
  teacherIds: number[];
}

export interface UpdateSchoolClassRequest {
  name?: string;
  gradeLevel?: string;
  academicYear?: string;
  capacity?: number;
  isActive?: boolean;
  mainTeacherId?: number;
  studentIds?: number[];
  teacherIds?: number[];
}

export interface ClassSchedule {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacher?: TeacherSummary;
  roomNumber?: string;
  classId: number;
}

export interface SchoolSummary {
  id: number;
  name: string;
  code?: string;
}

export interface TeacherSummary {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subjectSpecialization?: string;
}

export interface StudentSummary {
  id: number;
  firstName: string;
  lastName: string;
  studentCode?: string;
  birthDate?: string;
  gender?: string;
}
