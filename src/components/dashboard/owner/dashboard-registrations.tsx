import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import type { RecentRegistration } from "@/types/owner-dashboard";

export default function DashboardRegistrations({
  registrations,
}: {
  registrations: RecentRegistration[];
}) {
  const { t } = useLanguage();

  const iconFor = (type: string) =>
    type === "student" ? (
      <Users className="h-4 w-4" />
    ) : type === "teacher" ? (
      <GraduationCap className="h-4 w-4" />
    ) : (
      <BookOpen className="h-4 w-4" />
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("owner.dashboard.recentRegistrations")}</CardTitle>
        <CardDescription>
          {t("owner.dashboard.recentRegistrationsDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {registrations.slice(0, 4).map((r) => (
            <div
              key={r.id}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  r.type === "student" && "bg-blue-100 text-blue-600",
                  r.type === "teacher" && "bg-green-100 text-green-600",
                  r.type === "class" && "bg-purple-100 text-purple-600"
                )}
              >
                {iconFor(r.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {r.schoolName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
