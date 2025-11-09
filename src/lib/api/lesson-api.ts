import { apiClient, apiConfig } from "./api-config";
import type { Lesson } from "@/types/schedule";

export const lessonApi = {
  // Get all lessons
  getAll: async (): Promise<Lesson[]> => {
    return apiClient.get<Lesson[]>(apiConfig.endpoints.lessons.getAll);
  },

  // Get lessons by grade level
  getByGradeLevel: async (gradeLevel: string): Promise<Lesson[]> => {
    return apiClient.get<Lesson[]>(
      apiConfig.endpoints.lessons.getByGradeLevel(gradeLevel)
    );
  },
};
