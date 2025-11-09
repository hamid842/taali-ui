import { apiClient, apiConfig } from "./api-config";
import type {
  SchoolClass,
  SchoolClassDetail,
  CreateSchoolClassRequest,
  UpdateSchoolClassRequest,
} from "@/types/class";

export const classApi = {
  // Get all classes for a school
  getClassesBySchool: async (schoolId: string): Promise<SchoolClass[]> => {
    return apiClient.get<SchoolClass[]>(
      apiConfig.endpoints.classes.getBySchool(schoolId)
    );
  },

  // Get active classes for a school
  getActiveClassesBySchool: async (
    schoolId: string
  ): Promise<SchoolClass[]> => {
    return apiClient.get<SchoolClass[]>(
      apiConfig.endpoints.classes.getActiveBySchool(schoolId)
    );
  },

  // Get class by ID
  getClassById: async (id: string): Promise<SchoolClassDetail> => {
    return apiClient.get<SchoolClassDetail>(
      apiConfig.endpoints.classes.getById(id)
    );
  },

  // Create new class
  createClass: async (data: CreateSchoolClassRequest): Promise<SchoolClass> => {
    return apiClient.post<SchoolClass>(
      apiConfig.endpoints.classes.create,
      data
    );
  },

  // Update class
  updateClass: async (
    id: string,
    data: UpdateSchoolClassRequest
  ): Promise<SchoolClass> => {
    return apiClient.put<SchoolClass>(
      apiConfig.endpoints.classes.update(id),
      data
    );
  },

  // Delete class
  deleteClass: async (id: string): Promise<void> => {
    return apiClient.delete(apiConfig.endpoints.classes.delete(id));
  },

  // Add student to class
  addStudent: async (
    classId: string,
    studentId: string
  ): Promise<SchoolClass> => {
    return apiClient.post<SchoolClass>(
      apiConfig.endpoints.classes.addStudent(classId, studentId),
      {}
    );
  },

  // Remove student from class
  removeStudent: async (
    classId: string,
    studentId: string
  ): Promise<SchoolClass> => {
    return apiClient.delete<SchoolClass>(
      apiConfig.endpoints.classes.removeStudent(classId, studentId)
    );
  },
};
