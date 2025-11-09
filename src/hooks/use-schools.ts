import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolApi } from "@/lib/api/school-api";
import type { CreateSchoolRequest, UpdateSchoolRequest } from "@/types/school";
import { useAuth } from "./use-auth";

export function useSchools() {
  const { user } = useAuth();

  // Determine if we should fetch based on role
  const shouldFetch = user?.role === "OWNER";

  return useQuery({
    queryKey: ["schools", "role-based"],
    queryFn: schoolApi.getMySchools,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSchool(schoolId: string) {
  return useQuery({
    queryKey: ["schools", schoolId],
    queryFn: () => schoolApi.getSchoolById(schoolId),
    enabled: !!schoolId,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSchoolRequest) => schoolApi.createSchool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchoolRequest }) =>
      schoolApi.updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => schoolApi.deleteSchool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });
}
