import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";
import { OtpVerification } from "@/components/auth/otp-verification";
import { UserPlus } from "lucide-react";
import { type UserRoleType } from "@/types/role";
import { useRoleRedirect } from "@/hooks/use-role-redirect";
import { useNavigate } from "react-router-dom";
import registerImage from "@/assets/images/register-pic.webp";
import RegisterUserForm from "@/components/forms/register-user-form";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userId, setUserId] = useState<string>("");
  const [userContact, setUserContact] = useState<{
    email: string;
    phoneNumber: string;
  }>({
    email: "",
    phoneNumber: "",
  });
  const { t } = useLanguage();

  const { redirectToDashboard } = useRoleRedirect();

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
        phoneNumber={userContact.phoneNumber}
        email={userContact.email}
        userId={userId}
        onSuccess={handleVerificationSuccess}
        onBack={handleBackToRegister}
      />
    );
  }

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
            <RegisterUserForm
              registerForRole="OWNER"
              setStep={setStep}
              setUserId={setUserId}
              setUserContact={setUserContact}
            />
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
