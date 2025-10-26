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
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { useLoginMutation } from "@/hooks/use-auth-mutation";
import { useRoleRedirect } from "@/hooks/use-role-redirect";
import type { LoginRequest } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const { redirectToDashboard } = useRoleRedirect();
  const { login} = useAuth();

  // Validation schema
  const loginSchema = z.object({
    email: z.email(t("validation.email.format")),
    password: z.string().min(1, t("validation.password.required")),
  });

  type LoginSchema = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const result = await loginMutation.mutateAsync(data);

      if (result.success && result.userId) {
        toast.success(t("toast.loginSuccess"), {
          description: t("toast.redirectingDashboard"),
        });

        // Create user object from response
        const userData = {
          userId: result.userId,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role,
        };

        // Call AuthContext login to update state
        login(result.token, userData, result.refreshToken);

        setTimeout(() => {
          redirectToDashboard(result.role!);
        }, 2000);
      } else {
        toast.error(result.message || t("toast.loginFailed"));
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const isLoginSubmitting = isSubmitting || loginMutation.isPending;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-110px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <LogIn size={"70px"} className="m-auto" />
          <CardTitle className="text-2xl font-bold">
            {t("login.title")}
          </CardTitle>
          <CardDescription>{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AppTextField
              label={t("login.form.email")}
              type="email"
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <AppTextField
              type="password"
              showPasswordToggle
              label={t("login.form.password")}
              error={errors.password?.message}
              required
              {...register("password")}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoginSubmitting}
            >
              {isLoginSubmitting ? t("login.loggingIn") : t("login.login")}
            </Button>
          </form>
        </CardContent>
        <div className="flex items-center justify-center text-sm">
          <span>{t("login.account")}</span>
          <span
            className="px-1 font-bold cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/register")}
          >
            {t("common.signUp")}
          </span>
        </div>
      </Card>
    </div>
  );
}
