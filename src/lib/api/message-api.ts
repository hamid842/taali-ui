import type { ApiResponse } from "@/types/api-response";
import type {
  Conversation,
  CreateConversationRequest,
  Message,
  SendMessageRequest,
} from "@/types/message";
import { apiClient, apiConfig } from "./api-config";

export const messageApi = {
  // Get all conversations for current user
  getConversations: async (
    userId: number
  ): Promise<ApiResponse<Conversation[]>> => {
    return apiClient.get<ApiResponse<Conversation[]>>(
      apiConfig.endpoints.conversations.list,
      {
        headers: {
          "X-User-Id": userId.toString(),
        },
      }
    );
  },

  // Get specific conversation with messages
  getConversation: async (
    conversationId: number,
    userId: number
  ): Promise<Conversation> => {
    return apiClient.get<Conversation>(
      apiConfig.endpoints.conversations.getById(conversationId),
      {
        headers: {
          "X-User-Id": userId.toString(),
        },
      }
    );
  },

  // Create new conversation
  createConversation: async (
    request: CreateConversationRequest,
    userId: number
  ): Promise<Conversation> => {
    return apiClient.post<Conversation>(
      apiConfig.endpoints.conversations.create,
      request,
      {
        headers: {
          "X-User-Id": userId.toString(),
        },
      }
    );
  },

  // Send message in existing conversation
  sendMessage: async (
    conversationId: number,
    request: SendMessageRequest
  ): Promise<Message> => {
    return apiClient.post<Message>(
      apiConfig.endpoints.conversations.sendMessage(conversationId),
      request
    );
  },

  // Mark conversation as read
  markAsRead: async (conversationId: number): Promise<void> => {
    return apiClient.put(
      apiConfig.endpoints.conversations.markAsRead(conversationId)
    );
  },

  // Close conversation
  closeConversation: async (conversationId: number): Promise<void> => {
    return apiClient.put(
      apiConfig.endpoints.conversations.closeConversation(conversationId)
    );
  },

  // Get unread count
  getUnreadCount: async (userId: number): Promise<ApiResponse<number>> => {
    const response = await apiClient.get<ApiResponse<number>>(
      apiConfig.endpoints.conversations.unreadCount,
      {
        headers: {
          "X-User-Id": userId.toString(),
        },
      }
    );
    return response;
  },
};
