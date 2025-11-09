import { apiClient, apiConfig } from "./api-config";
import type {
  ClassSchedule,
  CreateClassScheduleRequest,
  UpdateClassScheduleRequest,
} from "@/types/schedule";

export const scheduleApi = {
  // Get schedules for a class
  getByClass: async (classId: string): Promise<ClassSchedule[]> => {
    return apiClient.get<ClassSchedule[]>(
      apiConfig.endpoints.schedules.getByClass(classId)
    );
  },

  // Get schedules for a class by day
  getByClassAndDay: async (
    classId: string,
    dayOfWeek: string
  ): Promise<ClassSchedule[]> => {
    return apiClient.get<ClassSchedule[]>(
      apiConfig.endpoints.schedules.getByClassAndDay(classId, dayOfWeek)
    );
  },

  // Get schedules for a teacher
  getByTeacher: async (teacherId: string): Promise<ClassSchedule[]> => {
    return apiClient.get<ClassSchedule[]>(
      apiConfig.endpoints.schedules.getByTeacher(teacherId)
    );
  },

  // Create new schedule
  createSchedule: async (
    data: CreateClassScheduleRequest
  ): Promise<ClassSchedule> => {
    return apiClient.post<ClassSchedule>(
      apiConfig.endpoints.schedules.create,
      data
    );
  },

  // Update schedule
  updateSchedule: async (
    id: string,
    data: UpdateClassScheduleRequest
  ): Promise<ClassSchedule> => {
    return apiClient.put<ClassSchedule>(
      apiConfig.endpoints.schedules.update(id),
      data
    );
  },

  // Delete schedule
  deleteSchedule: async (id: string): Promise<void> => {
    return apiClient.delete(apiConfig.endpoints.schedules.delete(id));
  },
};
