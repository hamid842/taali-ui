import type { TeacherSummary } from "./class";

export interface ClassSchedule {
  id: number;
  classId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  subjectName: string;
  teacher?: TeacherSummary;
  roomNumber?: string;
}

export interface CreateClassScheduleRequest {
  classId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectName: string;
  teacherId?: number;
  roomNumber?: string;
}

export interface UpdateClassScheduleRequest {
  dayOfWeek?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  subjectName?: string;
  teacherId?: number;
  roomNumber?: string;
}

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

