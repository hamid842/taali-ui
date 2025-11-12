import { apiClient, apiConfig } from "./api-config";
import type {
  SchoolClass,
  SchoolClassDetail,
  CreateSchoolClassRequest,
  UpdateSchoolClassRequest,
} from "@/types/class";

export const classApi = {
  // Get all classes for a school
  getClassesBySchool: async (schoolId: number): Promise<SchoolClass[]> => {
    return apiClient.get<SchoolClass[]>(
      apiConfig.endpoints.classes.getBySchool(schoolId)
    );
  },

  // Get active classes for a school
  getActiveClassesBySchool: async (
    schoolId: number
  ): Promise<SchoolClass[]> => {
    return apiClient.get<SchoolClass[]>(
      apiConfig.endpoints.classes.getActiveBySchool(schoolId)
    );
  },

  // Get class by ID
  getClassById: async (id: number): Promise<SchoolClassDetail> => {
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
    id: number,
    data: UpdateSchoolClassRequest
  ): Promise<SchoolClass> => {
    return apiClient.put<SchoolClass>(
      apiConfig.endpoints.classes.update(id),
      data
    );
  },

  // Delete class
  deleteClass: async (id: number): Promise<void> => {
    return apiClient.delete(apiConfig.endpoints.classes.delete(id));
  },

  // Add student to class
  addStudent: async (
    classId: number,
    studentId: number
  ): Promise<SchoolClass> => {
    return apiClient.post<SchoolClass>(
      apiConfig.endpoints.classes.addStudent(classId, studentId),
      {}
    );
  },

  // Remove student from class
  removeStudent: async (
    classId: number,
    studentId: number
  ): Promise<SchoolClass> => {
    return apiClient.delete<SchoolClass>(
      apiConfig.endpoints.classes.removeStudent(classId, studentId)
    );
  },
};
