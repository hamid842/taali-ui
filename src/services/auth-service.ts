import { apiClient, apiConfig } from "@/lib/api-config";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<RegisterResponse>(
      apiConfig.endpoints.auth.login,
      data
    );
  },
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>(
      apiConfig.endpoints.auth.register,
      data
    );
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return apiClient.post<VerifyOtpResponse>(
      apiConfig.endpoints.auth.verifyOtp,
      data
    );
  },

  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    return apiClient.post<ResendOtpResponse>(
      apiConfig.endpoints.auth.resendOtp,
      data
    );
  },
};
