import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { AppTextField } from "@/components/common/app-text-field";
import { InternationalPhoneInput } from "@/components/common/phone-input";
import { ENGLISH_REGEX, FARSI_REGEX } from "@/constants";
import { useRegisterMutation } from "@/hooks/use-auth-mutation";
import type { RegisterRequest } from "@/types/auth";
import { toast } from "sonner";
import { OtpVerification } from "@/components/auth/otp-verification";
import { UserPlus } from "lucide-react";
import { PasswordStrength } from "@/components/auth/password-strength";
import { UserRole, type UserRoleType } from "@/types/role";
import { useRoleRedirect } from "@/hooks/use-role-redirect";
import { useNavigate } from "react-router-dom";
import registerImage from "@/assets/images/register-pic.webp";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userId, setUserId] = useState<string>("");
  const { t, language } = useLanguage();
  const registerMutation = useRegisterMutation();
  const { redirectToDashboard } = useRoleRedirect();

  const nameRegex = language === "fa" ? FARSI_REGEX : ENGLISH_REGEX;
  // Password regex - always use English alphabet for passwords
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]*$/;

  // Validation schema
  const registerSchema = z
    .object({
      firstName: z
        .string()
        .min(2, t("validation.firstName.min"))
        .max(50, t("validation.firstName.max"))
        .regex(nameRegex, t("validation.firstName.regex")),
      lastName: z
        .string()
        .min(2, t("validation.lastName.min"))
        .max(50, t("validation.lastName.max"))
        .regex(nameRegex, t("validation.lastName.regex")),
      phoneNumber: z.string().min(5, t("validation.phone.min")),
      email: z.email(t("validation.email.format")),
      role: z.enum([
        UserRole.OWNER,
        UserRole.ADMIN,
        UserRole.SUPERVISOR,
        UserRole.TEACHER,
        UserRole.STUDENT,
        UserRole.PARENT,
        UserRole.CANTEEN_OPERATOR,
        UserRole.FINANCE_TEAM,
      ]),
      password: z
        .string()
        .min(8, t("validation.password.min"))
        .regex(passwordRegex, t("validation.password.regex")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword.match"),
      path: ["confirmPassword"],
    });

  type RegisterSchema = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.OWNER,
    },
  });
  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const result = await registerMutation.mutateAsync(data);

      if (result.success && result.userId) {
        setUserId(result.userId);
        setStep("verify");

        // Sonner toast with RTL support
        toast.success(t("toast.otpSent"));
      } else {
        toast.error(result.message || t("toast.registerFailed"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const handleVerificationSuccess = (userData: {
    role: UserRoleType;
    userId: string;
  }) => {
    toast.success(t("toast.registerSuccess"), {
      description: t("toast.redirectingDashboard"),
    });

    setTimeout(() => {
      redirectToDashboard(userData.role);
    }, 2000);
  };

  const handleBackToRegister = () => {
    setStep("register");
  };

  if (step === "verify") {
    return (
      <OtpVerification
        phoneNumber={watch("phoneNumber")}
        email={watch("email")}
        userId={userId}
        onSuccess={handleVerificationSuccess}
        onBack={handleBackToRegister}
      />
    );
  }

  const isRegisterSubmitting = isSubmitting || registerMutation.isPending;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-110px)]">
      {/* Main container with rounded corners */}
      <div className="flex overflow-hidden rounded-lg shadow-md">
        {/* Image - Same size as form */}
        <div className="flex-1 hidden lg:block">
          <div className="w-full h-full">
            <img
              src={registerImage}
              alt="Register Pic"
              className="w-full h-full max-h-[700px] object-cover shadow-md"
            />
          </div>
        </div>
        {/* Form Card */}
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <UserPlus size={"70px"} className="m-auto" />
            <CardTitle className="text-2xl font-bold">
              {t("register.title")}
            </CardTitle>
            <CardDescription>{t("register.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <AppTextField
                  label={t("register.form.firstName")}
                  error={errors.firstName?.message}
                  required
                  {...register("firstName")}
                />
                <AppTextField
                  label={t("register.form.lastName")}
                  error={errors.lastName?.message}
                  required
                  {...register("lastName")}
                />
              </div>

              <InternationalPhoneInput
                label={t("register.form.phone")}
                value={watch("phoneNumber")}
                onChange={(value) => setValue("phoneNumber", value)}
                error={errors.phoneNumber?.message}
                required
              />

              <AppTextField
                label={t("register.form.email")}
                type="email"
                error={errors.email?.message}
                required
                {...register("email")}
              />
              <div className="grid gap-4 grid-cols-2">
                <AppTextField
                  type="password"
                  showPasswordToggle
                  label={t("register.form.password")}
                  error={errors.password?.message}
                  required
                  {...register("password")}
                />
                <AppTextField
                  type="password"
                  showPasswordToggle
                  label={t("register.form.confirmPassword")}
                  error={errors.confirmPassword?.message}
                  required
                  {...register("confirmPassword")}
                />
              </div>
              {passwordValue && <PasswordStrength password={passwordValue} />}
              <Button
                type="submit"
                className="w-full"
                disabled={isRegisterSubmitting}
              >
                {isSubmitting
                  ? t("register.creatingAccount")
                  : t("register.createAccount")}
              </Button>
            </form>
          </CardContent>
          <div className="flex items-center justify-center text-sm">
            <span>{t("register.account")}</span>
            <span
              className="px-1 mb-0.5 font-bold cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/login")}
            >
              {t("common.login")}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
