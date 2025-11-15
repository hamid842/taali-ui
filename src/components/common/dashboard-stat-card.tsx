import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex gap-2 items-center text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && (
            <Badge
              variant={trend.isPositive ? "default" : "destructive"}
              className="ml-2"
            >
              <TrendingUp
                className={cn(
                  "h-3 w-3 mr-1",
                  !trend.isPositive && "rotate-180"
                )}
              />
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
