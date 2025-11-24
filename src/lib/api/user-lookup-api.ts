import type { User } from "@/types/auth";
import { apiClient, apiConfig } from "./api-config";
import type { Student } from "@/types/message";

export const userLookupApi = {
  // Get teachers for parent
  getTeachers: async (): Promise<User[]> => {
    return apiClient.get<User[]>(apiConfig.endpoints.users.getTeachers);
  },

  // Get parents for teacher
  getParents: async (): Promise<User[]> => {
    return apiClient.get<User[]>(apiConfig.endpoints.users.getParents);
  },

  // Get students for parent
  getStudents: async (): Promise<Student[]> => {
    return apiClient.get<Student[]>(apiConfig.endpoints.users.getStudents);
  },
};
