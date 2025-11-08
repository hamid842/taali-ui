import type { UserRoleType } from "./role";
import type { ISchool } from "./school";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleType;
  permissions: string[];
  availableSchools: ISchool[];
  currentSchool?: ISchool;
}

// Request types (what we send to the API)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRoleType;
  profileImage?: string | null;
}

export interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

export interface ResendOtpRequest {
  userId: string;
}

// Response types (what we receive from the API)
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRoleType;
  permissions: string[];
  availableSchools: ISchool[];
  currentSchool?: ISchool;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  otpCode?: string;
  requiresVerification?: boolean;
  role?: UserRoleType;
  status?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  role?: UserRoleType;
  status?: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  otpCode?: string;
  requiresVerification?: boolean;
}
