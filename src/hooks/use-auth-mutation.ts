import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { useAuth } from "./use-auth";
import type { UserRoleType } from "@/types/role";
import type { LoginResponse } from "@/types/auth";

export const useLoginMutation = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.userId && data.token) {
        const userData: LoginResponse = {
          id: data.id,
          userId: data.userId!,
          firstName: data.firstName!,
          lastName: data.lastName!,
          role: data.role! as UserRoleType,
          email: data.email!,
          currentSchool: data.currentSchool,
          permissions:data.permissions
        };
        // Use the context login to update state
        login(data.token, userData, data.refreshToken);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });
}

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });
};
