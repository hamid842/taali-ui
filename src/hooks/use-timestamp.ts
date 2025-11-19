import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { timestampApi } from "@/lib/api/timestamp-api";
import type {
  CreateClassTimestampRequest,
  UpdateClassTimestampRequest,
} from "@/types/timestamp";
import { useAuth } from "./use-auth";

export function useTimestamps(schoolId: number | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["timestamps", schoolId],
    queryFn: () => timestampApi.getAll(schoolId!),
    enabled: !!schoolId && !!user?.currentSchool,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAvailableTimestampTypes(schoolId: number | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["timestamp-types", schoolId],
    queryFn: () => timestampApi.getAvailableTypes(schoolId!),
    enabled: !!schoolId && !!user?.currentSchool,
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      timestampId,
      data,
    }: {
      timestampId: number;
      data: UpdateClassTimestampRequest;
    }) => timestampApi.update(timestampId, data),
    onSuccess: () => {
      if (user?.currentSchool?.id) {
        queryClient.invalidateQueries({
          queryKey: ["timestamps", user?.currentSchool.id],
        });
      }
    },
  });
}

export function useDeleteTimestamp() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (timestampId: number) => timestampApi.delete(timestampId),
    onSuccess: () => {
      if (user?.currentSchool?.id) {
        queryClient.invalidateQueries({
          queryKey: ["timestamps", user?.currentSchool.id],
        });
      }
    },
  });
}
