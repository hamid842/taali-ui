import { apiClient, apiConfig } from "./api-config";
import type {
  ClassTimestamp,
  CreateClassTimestampRequest,
  UpdateClassTimestampRequest,
  AvailableTimestampTypesResponse,
} from "@/types/timestamp";

export const timestampApi = {
  // Get all timestamps for a specific school
  getAll: async (schoolId: number): Promise<ClassTimestamp[]> => {
    return apiClient.get<ClassTimestamp[]>(
      apiConfig.endpoints.school.getSchoolTimestamps(schoolId)
    );
  },

  // Create a new timestamp for a school
  create: async (
    schoolId: number,
    data: CreateClassTimestampRequest
  ): Promise<ClassTimestamp> => {
    return apiClient.post<ClassTimestamp>(
      apiConfig.endpoints.school.create(schoolId),
      data
    );
  },

  // Update an existing timestamp
  update: async (
    timestampId: number,
    data: UpdateClassTimestampRequest
  ): Promise<ClassTimestamp> => {
    return apiClient.put<ClassTimestamp>(
      apiConfig.endpoints.school.update(timestampId),
      data
    );
  },

  // Delete a timestamp
  delete: async (timestampId: number): Promise<void> => {
    return apiClient.delete(apiConfig.endpoints.school.delete(timestampId));
  },

  // Get available timestamp types based on school facilities
  getAvailableTypes: async (
    schoolId: number
  ): Promise<AvailableTimestampTypesResponse> => {
    return apiClient.get<AvailableTimestampTypesResponse>(
      apiConfig.endpoints.school.getAvailableTypes(schoolId)
    );
  },
};
