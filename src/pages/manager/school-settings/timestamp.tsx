import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Clock, AlertCircle, Building2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { ClassTimestamp } from "@/types/timestamp";
import {
  useTimestamps,
  useAvailableTimestampTypes,
  useDeleteTimestamp,
} from "@/hooks/use-timestamp";
import { useAuth } from "@/hooks/use-auth";
import TimestampCard from "@/components/dashboard/timestamp/timestamp-card";
import TimestampDialog from "@/components/dashboard/timestamp/timestamp-dialog";

export default function TimestampManagement() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimestamp, setEditingTimestamp] =
    useState<ClassTimestamp | null>(null);

  // Use custom hooks
  const {
    data: timestamps,
    isLoading,
    error,
  } = useTimestamps(user?.currentSchool?.id);
  const { data: availableTypes } = useAvailableTimestampTypes(
    user?.currentSchool?.id
  );
  const deleteMutation = useDeleteTimestamp();

  const handleCreate = () => {
    setEditingTimestamp(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (timestamp: ClassTimestamp) => {
    setEditingTimestamp(timestamp);
    setIsDialogOpen(true);
  };

  const handleDelete = (timestampId: number) => {
    if (confirm(t("school.timestamps.confirmDelete"))) {
      deleteMutation.mutate(timestampId, {
        onError: (error: unknown) => {
          toast.error(
            error instanceof Error
              ? error.message
              : t("school.timestamps.deleteError")
          );
        },
      });
    }
  };

  const canManage = user?.role === "OWNER" || user?.role === "SCHOOL_MANAGER";
  const hasLaunchAvailable = availableTypes?.availableTypes.some(
    (t) => t.type === "LAUNCH"
  );
  const hasPensionAvailable = availableTypes?.availableTypes.some(
    (t) => t.type === "PENSION"
  );

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{t("school.timestamps.loadError")}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            {t("common.retry")}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("school.timestamps.title")}
          </h1>
          <p className="text-muted-foreground">
            {user?.currentSchool?.name} - {t("school.timestamps.subtitle")}
          </p>
        </div>
        {canManage && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t("school.timestamps.create")}
          </Button>
        )}
      </div>

      {/* School Context Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{user?.currentSchool?.name}</span>
                <Badge variant="outline">
                  {user?.role === "SCHOOL_MANAGER" ? "Manager" : "Admin"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("school.timestamps.schoolWideSettingDesc")}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {timestamps?.length || 0} {t("school.timestamps.count")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facility Alert */}
      {availableTypes && (!hasLaunchAvailable || !hasPensionAvailable) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-4">
            {!hasLaunchAvailable && !hasPensionAvailable && (
              <div>{t("school.timestamps.noBreakTimes")}</div>
            )}
            {!hasLaunchAvailable && hasPensionAvailable && (
              <div>{t("school.timestamps.noLaunch")}</div>
            )}
            {hasLaunchAvailable && !hasPensionAvailable && (
              <div>{t("school.timestamps.noPension")}</div>
            )}
            <Button
              variant="link"
              className="p-0 h-auto mt-2"
              onClick={() => navigate("/admin/schools/settings")}
            >
              {t("school.timestamps.updateSchoolSettings")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Timestamps Grid */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : timestamps && timestamps.length > 0 ? (
        <div className="grid gap-4">
          {timestamps.map((timestamp) => (
            <TimestampCard
              key={timestamp.id}
              timestamp={timestamp}
              onEdit={canManage ? handleEdit : undefined}
              onDelete={canManage ? handleDelete : undefined}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("school.timestamps.empty.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("school.timestamps.empty.description")}
              </p>
              {canManage && (
                <Button onClick={handleCreate}>
                  {t("school.timestamps.empty.createFirst")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      {canManage && (
        <TimestampDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingTimestamp={editingTimestamp}
          availableTypes={availableTypes?.availableTypes || []}
          schoolId={user?.currentSchool?.id || 0}
        />
      )}
    </div>
  );
}
