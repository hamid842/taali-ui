import type { UserRoleType } from "./role";

// types/user.ts
export interface IUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRoleType;
  profileImage?: string;
  status: UserStatusType;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface UserListResponse {
  items: IUser[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRoleType;
  password?: string;
  schoolId?: string;
  profileImage?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export const UserStatus = {
  PENDING : "PENDING",
  ACTIVE : "ACTIVE",
  INACTIVE : "INACTIVE",
  SUSPENDED : "SUSPENDED",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

