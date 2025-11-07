import { apiClient, apiConfig } from "./api-config";
import type {
  ISchool,
  CreateSchoolRequest,
  UpdateSchoolRequest,
} from "@/types/school";

export const schoolApi = {
  getMySchools: async (): Promise<ISchool[]> => {
    return apiClient.get<ISchool[]>(apiConfig.endpoints.schools.getMySchools);
  },

  getSchoolById: async (id: string): Promise<ISchool> => {
    return apiClient.get<ISchool>(apiConfig.endpoints.schools.getById(id));
  },

  createSchool: async (data: CreateSchoolRequest): Promise<ISchool> => {
    return apiClient.post<ISchool>(apiConfig.endpoints.schools.create, data);
  },

  updateSchool: async (
    id: string,
    data: UpdateSchoolRequest
  ): Promise<ISchool> => {
    return apiClient.put<ISchool>(apiConfig.endpoints.schools.update(id), data);
  },

  deleteSchool: async (id: string): Promise<void> => {
    return apiClient.delete(apiConfig.endpoints.schools.delete(id));
  },

  updateSchoolLogo: async (id: string, imageUrl: string): Promise<ISchool> => {
    return apiClient.patch<ISchool>(
      apiConfig.endpoints.schools.updateLogo(id),
      {
        imageUrl,
      }
    );
  },

  searchSchools: async (query: string): Promise<ISchool[]> => {
    return apiClient.get<ISchool[]>(
      `${apiConfig.endpoints.schools.search}?q=${encodeURIComponent(query)}`
    );
  },
};
