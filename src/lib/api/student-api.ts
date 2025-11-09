import type { Student } from "@/types/student";
import { apiClient, apiConfig } from "./api-config";


export const studentApi = {
  getBySchool: async (schoolId: string): Promise<Student[]> => {
    return apiClient.get<Student[]>(
      apiConfig.endpoints.students.getBySchool(schoolId)
    );
  },
};
