import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import type { PerformanceMetrics } from "@/types/owner-dashboard";

export default function DashboardPerformanceMetrics({
  metrics,
}: {
  metrics: PerformanceMetrics;
}) {
  const { t } = useLanguage();

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {[
        ["avgStudentsPerSchool", metrics.averageStudentsPerSchool],
        ["avgTeachersPerSchool", metrics.averageTeachersPerSchool],
        ["avgClassesPerSchool", metrics.averageClassesPerSchool],
        ["studentTeacherRatio", `${metrics.studentTeacherRatio}:1`],
        ["capacityUtilization", `${metrics.capacityUtilization}%`],
      ].map(([label, value]) => (
        <Card key={label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t(`owner.dashboard.stats.${label}`)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
