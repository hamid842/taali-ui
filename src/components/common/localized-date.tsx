import { useLanguage } from "@/hooks/use-language";
import { formatGregorian, formatJalali } from "@/lib/utils/date-utils";
import { useMemo } from "react";

export default function LocalizedDate() {
  const { language } = useLanguage();

  const today = useMemo(() => {
    const now = new Date();

    if (language === "fa") {
      // Jalali format → example: "23 آبان 1404"
      return formatJalali(now, "DD MMMM YYYY");
    }

    // Gregorian format → example: "14 November 2025"
    return formatGregorian(now, "DD MMMM YYYY");
  }, [language]);

  return (
    <span className="hidden md:block text-sm text-muted-foreground">
      {today}
    </span>
  );
}
