import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { userApi } from "@/lib/api/user-api";
import type { CreateUserRequest, UpdateUserRequest } from "@/types/user";

export function useUsers(params?: {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      userApi.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserRequest;
    }) => userApi.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
