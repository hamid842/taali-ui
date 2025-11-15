import type { Teacher, TeacherDetailResponse, TeacherListResponse } from "@/types/teacher";
import { apiClient, apiConfig } from "./api-config";

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

  assignClass: async (teacherId: number, classIds: number[]): Promise<void> => {
    return apiClient.post(apiConfig.endpoints.teachers.assignClass(teacherId), {
      classIds,
    });
  },
};
