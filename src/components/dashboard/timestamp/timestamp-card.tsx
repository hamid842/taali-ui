import { Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/hooks/use-language";
import type { ClassTimestamp } from "@/types/timestamp";

interface TimestampCardProps {
  timestamp: ClassTimestamp;
  onEdit?: (timestamp: ClassTimestamp) => void;
  onDelete?: (timestampId: number) => void;
}

export default function TimestampCard({
  timestamp,
  onEdit,
  onDelete,
}: TimestampCardProps) {
  const { t } = useLanguage();

  const getTypeBadge = () => {
    switch (timestamp.type) {
      case "LAUNCH":
        return (
          <Badge variant="secondary">
            {t("school.timestamps.types.launch")}
          </Badge>
        );
      case "PENSION":
        return (
          <Badge variant="outline">
            {t("school.timestamps.types.pension")}
          </Badge>
        );
      default:
        return <Badge>{t("school.timestamps.types.regular")}</Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{timestamp.name}</h3>
                  {getTypeBadge()}
                </div>
                {timestamp.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {timestamp.description}
                  </p>
                )}
                <div className="text-sm text-muted-foreground mt-1 font-mono">
                  {timestamp.startTime} - {timestamp.endTime}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t("school.timestamps.order")} {timestamp.orderIndex}
              </span>
              <Switch dir={"ltr"} checked={timestamp.isActive} disabled />
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(timestamp)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(timestamp.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
