import type { Teacher } from "@/types/teacher";
import { apiClient, apiConfig } from "./api-config";

export const teacherApi = {
  getBySchool: async (schoolId: string): Promise<Teacher[]> => {
    return apiClient.get<Teacher[]>(
      apiConfig.endpoints.teachers.getBySchool(schoolId)
    );
  },
};
