import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/hooks/use-auth-mutation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { UserLock } from "lucide-react";
import { toast } from "sonner";
import type { UserRoleType } from "@/types/role";

interface OtpVerificationProps {
  phoneNumber: string;
  email: string;
  userId: string;
  onSuccess: (userData: { role: UserRoleType; userId: string }) => void;
  onBack: () => void;
}

export function OtpVerification({
  email,
  userId,
  onSuccess,
  onBack,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const { t } = useLanguage();

  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error(t("validation.otp.length"));
      return;
    }

    try {
      const result = await verifyOtpMutation.mutateAsync({ userId, otp });

      if (result.success) {
        toast.success(t("otpVerification.verificationSuccess"));
        onSuccess({ role: result.role!, userId: result.userId! });
      } else {
        toast.error(result.message || t("otpVerification.verificationFailed"));
      }
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
      if (error instanceof Error)
        toast.error(error.message || t("otpVerification.verificationFailed"));
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await resendOtpMutation.mutateAsync({ userId });

      if (result.success) {
        toast.success(
          t("otpVerification.resendSuccess") || "Verification code sent"
        );
        setOtp("");
      } else {
        toast.error(result.message || t("otpVerification.resendFailed"));
      }
    } catch (error: unknown) {
      console.error("Failed to resend OTP:", error);
      if (error instanceof Error)
        toast.error(error.message || t("otpVerification.resendFailed"));
    }
  };

  const isSubmitting = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-110px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <UserLock size={"70px"} className="m-auto" />
          <CardTitle className="text-2xl font-bold">
            {t("otpVerification.title")}
          </CardTitle>
          <CardDescription>
            {t("otpVerification.subtitle")} {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex items-center justify-center mb-10">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("otpVerification.otpLabel")}
                </label>
                <InputOTP
                  dir={"ltr"}
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup dir={"ltr"}>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-muted-foreground">
                  {t("otpVerification.otpHint")}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex-1"
              >
                {t("common.back")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="flex-1"
              >
                {isSubmitting ? t("common.verifying") : t("common.verify")}
              </Button>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={isSubmitting}
                className="text-sm"
              >
                {isResending
                  ? t("common.sending")
                  : t("otpVerification.resendCode")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
