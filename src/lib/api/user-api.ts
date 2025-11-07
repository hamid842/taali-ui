// lib/api/user-api.ts
import { apiClient, apiConfig } from "./api-config";
import type {
  IUser,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user";

export const userApi = {
  // Get users with pagination and filtering
  getUsers: async (params?: {
    page?: number;
    size?: number;
    search?: string;
    role?: string;
  }): Promise<UserListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.size) queryParams.append("size", params.size.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("role", params.role);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${apiConfig.endpoints.users.list}?${queryString}`
      : apiConfig.endpoints.users.list;

    return apiClient.get<UserListResponse>(url);
  },

  // Get user by ID
  getUserById: async (id: string): Promise<IUser> => {
    return apiClient.get<IUser>(apiConfig.endpoints.users.getById(id));
  },

  // Create user (for admin/owner creating other users)
  createUser: async (data: CreateUserRequest): Promise<IUser> => {
    return apiClient.post<IUser>(apiConfig.endpoints.users.create, data);
  },

  // Update user status (activate/deactivate)
  updateUserStatus: async (id: string, isActive: boolean): Promise<IUser> => {
    return apiClient.put<IUser>(apiConfig.endpoints.users.updateStatus(id), {
      isActive,
    });
  },

  // Update user profile
  updateUser: async (id: string, data: UpdateUserRequest): Promise<IUser> => {
    return apiClient.put<IUser>(apiConfig.endpoints.users.update(id), data);
  },

  // Delete user (soft delete)
  deleteUser: async (id: string): Promise<void> => {
    return apiClient.delete(apiConfig.endpoints.users.delete(id));
  },

  // Search users
  searchUsers: async (query: string): Promise<IUser[]> => {
    return apiClient.get<IUser[]>(
      `${apiConfig.endpoints.users.search}?q=${encodeURIComponent(query)}`
    );
  },
};
