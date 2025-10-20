import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/hooks/use-auth-mutation";

interface OtpVerificationProps {
  phoneNumber: string;
  email: string;
  userId: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OtpVerification({
  email,
  userId,
  onSuccess,
  onBack,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const { t, language } = useLanguage();

  const verifyOtpMutation = useVerifyOtpMutation();
  const resendOtpMutation = useResendOtpMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert(t("validation.otp.length"));
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ userId, otp });
      onSuccess();
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtpMutation.mutateAsync({ userId });
      alert(language === "fa" ? "کد جدید ارسال شد" : "New code sent");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const isSubmitting =
    verifyOtpMutation.isPending || resendOtpMutation.isPending;

  return (
    <Card className="w-full max-w-md m-auto mt-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t("otpVerification.title")}
        </CardTitle>
        <CardDescription>
          {t("otpVerification.subtitle")} {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("otpVerification.otpLabel")}
            </label>
            <Input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
              className="text-center text-lg font-mono"
            />
            <p className="text-xs text-muted-foreground">
              {t("otpVerification.otpHint")}
            </p>
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
              {t("otpVerification.resendCode")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
