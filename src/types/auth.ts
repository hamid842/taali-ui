import type { UserRoleType } from "./role";

// Request types (what we send to the API)
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
