import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolApi } from "@/lib/school-api";
import type { CreateSchoolRequest } from "@/types/school";

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: schoolApi.getMySchools,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSchoolRequest) => schoolApi.createSchool(data),
    onSuccess: () => {
      // Invalidate and refetch schools list
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}
