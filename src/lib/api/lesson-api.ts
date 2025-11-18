import { apiClient, apiConfig } from "./api-config";
import type { Lesson } from "@/types/lesson";

export const lessonApi = {
  // Get all lessons
  getAll: async (): Promise<Lesson[]> => {
    return await apiClient.get<Lesson[]>(apiConfig.endpoints.lessons.getAll);
  },

  // Get lessons by grade level
  getByGradeLevel: async (gradeLevel: string): Promise<Lesson[]> => {
    // Use encodeURIComponent to properly encode the grade level
    const encodedGradeLevel = encodeURIComponent(gradeLevel);
    return await apiClient.get<Lesson[]>(
      `${apiConfig.endpoints.lessons.getByGradeLevel(encodedGradeLevel)}`
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
