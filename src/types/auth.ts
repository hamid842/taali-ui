// Request types (what we send to the API)
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";
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
  role?: "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";
  status?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  role?: "STUDENT" | "TEACHER" | "ADMIN" | "PARENT";
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
