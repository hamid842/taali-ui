import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { timestampApi } from "@/lib/api/timestamp-api";
import type {
  CreateClassTimestampRequest,
  UpdateClassTimestampRequest,
} from "@/types/timestamp";
import { useAppStore } from "@/stores/app-store";

export function useTimestamps(schoolId: number | undefined) {
  const { currentSchool } = useAppStore();

  return useQuery({
    queryKey: ["timestamps", schoolId],
    queryFn: () => timestampApi.getAll(schoolId!),
    enabled: !!schoolId && !!currentSchool,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAvailableTimestampTypes(schoolId: number | undefined) {
  const { currentSchool } = useAppStore();

  return useQuery({
    queryKey: ["timestamp-types", schoolId],
    queryFn: () => timestampApi.getAvailableTypes(schoolId!),
    enabled: !!schoolId && !!currentSchool,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateTimestamp(schoolId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassTimestampRequest) =>
      timestampApi.create(schoolId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timestamps", schoolId] });
    },
  });
}

export function useUpdateTimestamp() {
  const queryClient = useQueryClient();
  const { currentSchool } = useAppStore();

  return useMutation({
    mutationFn: ({
      timestampId,
      data,
    }: {
      timestampId: number;
      data: UpdateClassTimestampRequest;
    }) => timestampApi.update(timestampId, data),
    onSuccess: () => {
      if (currentSchool?.id) {
        queryClient.invalidateQueries({
          queryKey: ["timestamps", currentSchool.id],
        });
      }
    },
  });
}

export function useDeleteTimestamp() {
  const queryClient = useQueryClient();
  const { currentSchool } = useAppStore();

  return useMutation({
    mutationFn: (timestampId: number) => timestampApi.delete(timestampId),
    onSuccess: () => {
      if (currentSchool?.id) {
        queryClient.invalidateQueries({
          queryKey: ["timestamps", currentSchool.id],
        });
      }
    },
  });
}
