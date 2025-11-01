import { useQuery } from "@tanstack/react-query";
import { apiClient, apiConfig } from "@/lib/api-config";
import type { School } from "@/types/school";

const schoolApi = {
  getMySchools: async (): Promise<School[]> => {
    return apiClient.get<School[]>(apiConfig.endpoints.schools.getMySchools);
  },
};

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: schoolApi.getMySchools,
    enabled: true,
  });
}
