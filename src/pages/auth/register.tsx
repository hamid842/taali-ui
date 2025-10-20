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

export default function Register() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userId, setUserId] = useState<string>("");
  const { t, language } = useLanguage();
  const registerMutation = useRegisterMutation();

  const nameRegex = language === "fa" ? FARSI_REGEX : ENGLISH_REGEX;

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
      password: z.string().min(6, t("validation.password.min")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword.match"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const result = await registerMutation.mutateAsync({
        ...data,
        role: "ADMIN",
      });

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
      toast.error(t("toast.registerFailed"));
    }
  };

  const handleVerificationSuccess = () => {
    toast.success(t("toast.registerSuccess"), {
      description: t("toast.redirectingLogin"),
    });

    // Redirect to login or dashboard
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  const handleBackToRegister = () => {
    setStep("register");
  };

  if (step === "verify") {
    return (
      <div>OTP</div>
      // <OtpVerification
      //   phoneNumber={watch("phone")}
      //   email={watch("email")}
      //   userId={userId}
      //   onSuccess={handleVerificationSuccess}
      //   onBack={handleBackToRegister}
      // />
    );
  }

  const isRegisterSubmitting = isSubmitting || registerMutation.isPending;

  return (
    <Card className="w-full max-w-md m-auto mt-6">
      <CardHeader className="space-y-1">
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
              label={t("register.form.password")}
              error={errors.password?.message}
              required
              {...register("password")}
            />
            <AppTextField
              label={t("register.form.confirmPassword")}
              error={errors.confirmPassword?.message}
              required
              {...register("confirmPassword")}
            />
          </div>

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
    </Card>
  );
}
