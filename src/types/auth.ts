import type { UserRoleType } from "./role";
import type { School } from "./school";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleType;
  permissions: string[];
  availableSchools: School[];
  currentSchool?: School;
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
  role?: string;
  permissions: string[];
  availableSchools: School[];
  currentSchool?: School;
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
