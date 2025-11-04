import { apiClient, apiConfig } from "./api-config";
import type {
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
} from "@/types/school";

export const schoolApi = {
  getMySchools: async (): Promise<School[]> => {
    return apiClient.get<School[]>(apiConfig.endpoints.schools.getMySchools);
  },

  getSchoolById: async (id: string): Promise<School> => {
    return apiClient.get<School>(apiConfig.endpoints.schools.getById(id));
  },

  createSchool: async (data: CreateSchoolRequest): Promise<School> => {
    return apiClient.post<School>(apiConfig.endpoints.schools.create, data);
  },

  updateSchool: async (
    id: string,
    data: UpdateSchoolRequest
  ): Promise<School> => {
    return apiClient.put<School>(apiConfig.endpoints.schools.update(id), data);
  },

  deleteSchool: async (id: string): Promise<void> => {
    return apiClient.delete(apiConfig.endpoints.schools.delete(id));
  },

  updateSchoolLogo: async (id: string, imageUrl: string): Promise<School> => {
    return apiClient.patch<School>(apiConfig.endpoints.schools.updateLogo(id), {
      imageUrl,
    });
  },

  searchSchools: async (query: string): Promise<School[]> => {
    return apiClient.get<School[]>(
      `${apiConfig.endpoints.schools.search}?q=${encodeURIComponent(query)}`
    );
  },
};
