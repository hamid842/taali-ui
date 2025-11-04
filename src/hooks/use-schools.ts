import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schoolApi } from "@/lib/school-api";
import type { CreateSchoolRequest, UpdateSchoolRequest } from "@/types/school";

export function useSchools() {
  return useQuery({
    queryKey: ["schools"],
    queryFn: schoolApi.getMySchools,
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
