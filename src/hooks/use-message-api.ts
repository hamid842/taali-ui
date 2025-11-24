
import { messageApi } from "@/lib/api/message-api";
import { studentApi } from "@/lib/api/student-api";
import { userLookupApi } from "@/lib/api/user-lookup-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import type { CreateConversationRequest, SendMessageRequest } from "@/types/message";

// Query keys
export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (filters: unknown) => [...messageKeys.lists(), filters] as const,
  details: () => [...messageKeys.all, "detail"] as const,
  detail: (id: number) => [...messageKeys.details(), id] as const,
  unreadCount: () => [...messageKeys.all, "unread-count"] as const,
};

export const userLookupKeys = {
  teachers: ["users", "teachers"] as const,
  parents: ["users", "parents"] as const,
  students: ["users", "students"] as const,
};

export const useMessageApi = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Conversations
  const useGetConversations = () => {
    return useQuery({
      queryKey: messageKeys.lists(),
      queryFn: async () => {
        if (!user?.id) {
          throw new Error("Student ID is required");
        }
        return await messageApi.getConversations(user.id);
      },
    });
  };

  const useGetStudentTeachers = (studentId?: number) => {
    return useQuery({
      queryKey: ["studentTeachers", studentId],
      queryFn: async () => {
        if (!studentId) {
          throw new Error("Student ID is required");
        }
        return await studentApi.getStudentTeachers(studentId);
      },
      enabled: !!studentId,
    });
  };

  const useGetConversation = (conversationId: number) => {
    return useQuery({
      queryKey: messageKeys.detail(conversationId),
      queryFn: async () => {
        if (!user?.id) {
          throw new Error("User must be authenticated to create conversation");
        }
        return await messageApi.getConversation(conversationId, user.id);
      },
      enabled: !!conversationId,
    });
  };

  const useCreateConversation = () => {
    return useMutation({
      mutationFn: async (request: CreateConversationRequest) => {
        if (!user?.id) {
          throw new Error("User must be authenticated to create conversation");
        }

        return await messageApi.createConversation(request, user.id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      },
    });
  };

  const useSendMessage = (conversationId: number) => {
    return useMutation({
      mutationFn: (request: SendMessageRequest) =>
        messageApi.sendMessage(conversationId, request),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: messageKeys.detail(conversationId),
        });
        queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
        queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
      },
    });
  };

  const useMarkAsRead = () => {
    return useMutation({
      mutationFn: messageApi.markAsRead,
      onSuccess: (_, conversationId) => {
        queryClient.invalidateQueries({
          queryKey: messageKeys.detail(conversationId),
        });
        queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
        queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
      },
    });
  };

  const useCloseConversation = () => {
    return useMutation({
      mutationFn: messageApi.closeConversation,
      onSuccess: (_, conversationId) => {
        queryClient.invalidateQueries({
          queryKey: messageKeys.detail(conversationId),
        });
        queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      },
    });
  };

  const useGetUnreadCount = () => {
    return useQuery({
      queryKey: messageKeys.unreadCount(),
      queryFn: async () => {
        if (!user?.id) {
          throw new Error("User must be authenticated to create conversation");
        }
        return await messageApi.getUnreadCount(user.id);
      },
    });
  };

  // User Lookup
  const useGetTeachers = () => {
    return useQuery({
      queryKey: userLookupKeys.teachers,
      queryFn: userLookupApi.getTeachers,
    });
  };

  const useGetStudents = () => {
    return useQuery({
      queryKey: userLookupKeys.students,
      queryFn: userLookupApi.getStudents,
    });
  };


  return {
    // Conversations
    useGetConversations,
    useGetConversation,
    useCreateConversation,
    useSendMessage,
    useMarkAsRead,
    useCloseConversation,
    useGetUnreadCount,

    useGetStudentTeachers,

    // User Lookup
    useGetTeachers,
    useGetStudents,
  };
};
