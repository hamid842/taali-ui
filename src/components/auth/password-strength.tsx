import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({
  password,
  className,
}: PasswordStrengthProps) {
  const { t, language } = useLanguage();
  const isRTL = language === "fa";

  const getStrength = (pwd: string) => {
    let strength = 0;

    // Check criteria
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    // Determine strength level
    if (pwd.length === 0)
      return {
        level: 0,
        text: t("passwordStrength.enterPassword"),
        color: "bg-gray-200",
      };
    if (strength <= 2)
      return {
        level: 1,
        text: t("passwordStrength.weak"),
        color: "bg-red-500",
      };
    if (strength <= 3)
      return {
        level: 2,
        text: t("passwordStrength.fair"),
        color: "bg-yellow-500",
      };
    if (strength <= 4)
      return {
        level: 3,
        text: t("passwordStrength.good"),
        color: "bg-blue-500",
      };
    return {
      level: 4,
      text: t("passwordStrength.strong"),
      color: "bg-green-500",
    };
  };

  const strengthInfo = getStrength(password);

  return (
    <div className={cn("space-y-2", className)} dir={isRTL ? "rtl" : "ltr"}>
      <div className={cn("flex gap-1", isRTL && "flex-row-reverse")}>
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-all",
              level <= strengthInfo.level ? strengthInfo.color : "bg-gray-200"
            )}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p
          className={cn(
            "text-xs font-medium",
            strengthInfo.level === 1 && "text-red-600",
            strengthInfo.level === 2 && "text-yellow-600",
            strengthInfo.level === 3 && "text-blue-600",
            strengthInfo.level === 4 && "text-green-600",
            isRTL && "text-right"
          )}
        >
          {t("passwordStrength.label")} {strengthInfo.text}
        </p>
      )}
    </div>
  );
}
