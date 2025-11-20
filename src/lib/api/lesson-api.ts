import { apiClient, apiConfig } from "./api-config";
import type { Lesson } from "@/types/lesson";

export const lessonApi = {
  // Get all lessons (you might want to add school filter here too)
  getAll: async (schoolId?: number): Promise<Lesson[]> => {
    const url = schoolId
      ? `${apiConfig.endpoints.lessons.getAll}?schoolId=${schoolId}`
      : apiConfig.endpoints.lessons.getAll;
    return await apiClient.get<Lesson[]>(url);
  },

  // Get lessons by grade level for specific school
  getByGradeLevel: async (
    gradeLevel: string,
    schoolId: number
  ): Promise<Lesson[]> => {
    const encodedGradeLevel = encodeURIComponent(gradeLevel);
    return await apiClient.get<Lesson[]>(
      apiConfig.endpoints.lessons.getByGradeLevel(encodedGradeLevel, schoolId)
    );
  },

  // Get lessons by multiple grade levels for specific school
  getByGradeLevels: async (
    gradeLevels: string[],
    schoolId: number
  ): Promise<Lesson[]> => {
    const gradeLevelsParam = gradeLevels.join(",");
    return await apiClient.get<Lesson[]>(
      apiConfig.endpoints.lessons.getByGradeLevels(gradeLevelsParam, schoolId)
    );
  },

  // Get available grade levels for specific school
  getAvailableGradeLevels: async (schoolId: number): Promise<string[]> => {
    return await apiClient.get<string[]>(
      apiConfig.endpoints.lessons.getAvailableGradeLevels(schoolId)
    );
  },

  // Create a new lesson (if you add this endpoint later)
  createLesson: async (lessonData: {
    name: string;
    nameEn: string;
    gradeLevel: string;
    color: string;
  }): Promise<Lesson> => {
    return await apiClient.post<Lesson>(
      `${apiConfig.endpoints.lessons.create}`,
      lessonData
    );
  },

  // Update a lesson (if you add this endpoint later)
  updateLesson: async (
    id: number,
    lessonData: Partial<Lesson>
  ): Promise<Lesson> => {
    return await apiClient.put<Lesson>(
      `${apiConfig.endpoints.lessons.update(id)}`,
      lessonData
    );
  },

  // Delete a lesson (if you add this endpoint later)
  deleteLesson: async (id: number): Promise<void> => {
    await apiClient.delete(`${apiConfig.endpoints.lessons.delete(id)}`);
  },
};
