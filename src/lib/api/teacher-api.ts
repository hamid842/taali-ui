import type {
  Teacher,
  TeacherDetailResponse,
  TeacherListResponse,
} from "@/types/teacher";
import { apiClient, apiConfig } from "./api-config";
import type { TeacherActivity, TeacherClassDetail, TeacherDashboardStats, UpcomingClass } from "@/types/teacher-dashboard";
import type { SchoolClass } from "@/types/class";

export const teacherApi = {
  getBySchool: async (schoolId: number): Promise<TeacherListResponse[]> => {
    return apiClient.get<TeacherListResponse[]>(
      apiConfig.endpoints.teachers.getBySchool(schoolId)
    );
  },

  getById: async (id: number): Promise<TeacherDetailResponse> => {
    return apiClient.get<TeacherDetailResponse>(
      apiConfig.endpoints.teachers.getById(id)
    );
  },

  create: async (
    teacherData: Omit<Teacher, "id" | "createdAt" | "updatedAt">
  ): Promise<Teacher> => {
    return apiClient.post<Teacher>(
      apiConfig.endpoints.teachers.create,
      teacherData
    );
  },

  update: async (
    id: number,
    teacherData: Partial<Teacher>
  ): Promise<Teacher> => {
    return apiClient.put<Teacher>(
      apiConfig.endpoints.teachers.update(id),
      teacherData
    );
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(apiConfig.endpoints.teachers.delete(id));
  },

  updateStatus: async (id: number, isActive: boolean): Promise<Teacher> => {
    return apiClient.patch<Teacher>(
      apiConfig.endpoints.teachers.updateStatus(id),
      { isActive }
    );
  },

  search: async (schoolId: number, searchTerm: string): Promise<Teacher[]> => {
    return apiClient.get<Teacher[]>(
      `${
        apiConfig.endpoints.teachers.search
      }?schoolId=${schoolId}&search=${encodeURIComponent(searchTerm)}`
    );
  },

  getBySubject: async (
    schoolId: number,
    subject: string
  ): Promise<Teacher[]> => {
    return apiClient.get<Teacher[]>(
      `${
        apiConfig.endpoints.teachers.getBySubject
      }?schoolId=${schoolId}&subject=${encodeURIComponent(subject)}`
    );
  },

  assignClasses: async (
    teacherId: number,
    classIds: number[]
  ): Promise<void> => {
    return apiClient.post<void>(
      apiConfig.endpoints.teachers.assignClass(teacherId),
      { classIds }
    );
  },

  // NEW METHODS:

  getActiveBySchool: async (
    schoolId: number
  ): Promise<TeacherListResponse[]> => {
    return apiClient.get<TeacherListResponse[]>(
      apiConfig.endpoints.teachers.getActiveBySchool(schoolId)
    );
  },

  getDashboardStats: async (id: number): Promise<TeacherDashboardStats> => {
    return apiClient.get<TeacherDashboardStats>(
      apiConfig.endpoints.teachers.getDashboardStats(id)
    );
  },

  getTeacherClasses: async (id: number): Promise<SchoolClass[]> => {
    return apiClient.get<SchoolClass[]>(
      apiConfig.endpoints.teachers.getTeacherClasses(id)
    );
  },

  getTeacherClassesWithDetails: async (
    id: number
  ): Promise<TeacherClassDetail[]> => {
    return apiClient.get<TeacherClassDetail[]>(
      apiConfig.endpoints.teachers.getTeacherClasses(id)
    );
  },

  getUpcomingClasses: async (id: number): Promise<UpcomingClass[]> => {
    return apiClient.get<UpcomingClass[]>(
      apiConfig.endpoints.teachers.getUpcomingClasses(id)
    );
  },

  getTodaySchedule: async (id: number): Promise<UpcomingClass[]> => {
    return apiClient.get<UpcomingClass[]>(
      apiConfig.endpoints.teachers.getTodaySchedule(id)
    );
  },

  getRecentActivity: async (id: number): Promise<TeacherActivity[]> => {
    return apiClient.get<TeacherActivity[]>(
      apiConfig.endpoints.teachers.getRecentActivity(id)
    );
  },
};
