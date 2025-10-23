import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });
};

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
