import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { MonthlyGrowth } from "@/types/owner-dashboard";

export default function DashboardGrowthOverview({
  months,
}: {
  months: MonthlyGrowth[];
}) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("owner.dashboard.growthOverview")}</CardTitle>
        <CardDescription>
          {t("owner.dashboard.growthOverviewDescription")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {months.slice(-3).map((m, idx) => (
            <div
              key={`${m.month}-${idx}`}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="text-sm font-medium">{m.month}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>
                    {t("common.students")}: {m.students}
                  </span>
                  <span>
                    {t("common.teachers")}: {m.teachers}
                  </span>
                </div>
              </div>

              <Badge variant="outline" className="flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {m.students > 0 && m.students - 10 > 0
                  ? `+${Math.round(
                      (m.students / (m.students - 10) - 1) * 100
                    )}%`
                  : "+0%"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
