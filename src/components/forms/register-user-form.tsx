import type { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRole, type UserRoleType } from "@/types/role";
import { PasswordStrength } from "../auth/password-strength";
import { AppTextField } from "../common/app-text-field";
import { InternationalPhoneInput } from "../common/phone-input";
import { Button } from "../ui/button";
import { ENGLISH_REGEX, FARSI_REGEX } from "@/constants";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";
import type { RegisterRequest } from "@/types/auth";
import { useRegisterMutation } from "@/hooks/use-auth-mutation";
import { useNavigate } from "react-router-dom";
import { SchoolSelect } from "./school-select";
import { useAppStore } from "@/stores/app-store";

interface RegisterUserFormProps {
  registerForRole: UserRoleType;
  setStep?: (value: SetStateAction<"register" | "verify">) => void;
  setUserId?: Dispatch<SetStateAction<string>>;
  setUserContact?: (contact: { email: string; phoneNumber: string }) => void;
  redirectPath?: string;
  profileImage?: string | null;
}

export default function RegisterUserForm({
  registerForRole,
  setStep,
  setUserId,
  setUserContact,
  redirectPath,
  profileImage,
}: RegisterUserFormProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { currentSchool } = useAppStore();
  const registerMutation = useRegisterMutation();

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
      schoolId: z.string().optional(),
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
      password: registerForRole === UserRole.OWNER ? "" : "Default@123",
      confirmPassword: registerForRole === UserRole.OWNER ? "" : "Default@123",
      role: registerForRole,
      schoolId: currentSchool?.id ? currentSchool.id.toString() : undefined,
    },
  });
  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const result = await registerMutation.mutateAsync({
        ...data,
        profileImage,
      });

      if (result.success && result.userId) {
        if (registerForRole === UserRole.OWNER) {
          setUserId?.(result.userId);
          setUserContact?.({
            email: data.email,
            phoneNumber: data.phoneNumber,
          });
          setStep?.("verify");
        } else {
          if (redirectPath) navigate(redirectPath);
        }

        if (registerForRole === UserRole.OWNER) {
          toast.success(t("toast.otpSent"));
        } else {
          toast.success(t("toast.registerSuccess"));
        }
      } else {
        toast.error(result.message || t("toast.registerFailed"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
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
      {registerForRole === UserRole.OWNER && (
        <SchoolSelect
          required
          value={watch("schoolId") || ""}
          onChange={(id) => setValue("schoolId", id)}
          label={t("register.form.selectSchool")}
        />
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? t("register.creatingAccount")
          : t("register.createAccount")}
      </Button>
    </form>
  );
}
