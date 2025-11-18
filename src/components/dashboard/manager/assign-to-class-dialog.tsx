import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { classApi } from "@/lib/api/class-api";
import { studentApi } from "@/lib/api/student-api";
import { useLanguage } from "@/hooks/use-language";
import { useAppStore } from "@/stores/app-store";
import type { SchoolClass } from "@/types/class";
import type { Student } from "@/types/student";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AssignClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSuccess: () => void;
}

export default function AssignClassModal({
  isOpen,
  onClose,
  student,
  onSuccess,
}: AssignClassModalProps) {
  const { t, dir } = useLanguage();
  const { currentSchool } = useAppStore();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      setSelectedClassId(student.classId?.toString() || "");
    }
  }, [student, isOpen]);

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await classApi.getClassesBySchool(currentSchool!.id);
      setClasses(data);
    } catch (error) {
      console.error("Failed to load classes:", error);
      toast.error(t("manager.students.errors.loadClassesFailed"));
    } finally {
      setLoading(false);
    }
  }, [currentSchool, t]);

  useEffect(() => {
    if (isOpen && currentSchool?.id) {
      loadClasses();
    }
  }, [isOpen, currentSchool, loadClasses]);

  const handleAssign = async () => {
    if (!student || !selectedClassId) return;

    setSaving(true);
    try {
      if (student.classId) {
        // Remove from current class first
        await studentApi.removeFromClass(student.id!);
      }

      if (selectedClassId !== "remove") {
        // Assign to new class
        await studentApi.assignToClass(student.id!, parseInt(selectedClassId));
      }

      // Show success toast
      toast.success(
        selectedClassId === "remove"
          ? t("manager.students.success.removeFromClass")
          : t("manager.students.success.assignToClass")
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to assign class:", error);
      toast.error(t("manager.students.errors.assignClassFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!student || !student.classId) return;

    setSaving(true);
    try {
      await studentApi.removeFromClass(student.id!);

      // Show success toast
      toast.success(t("manager.students.success.removeFromClass"));

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to remove from class:", error);
      toast.error(t("manager.students.errors.removeClassFailed"));
    } finally {
      setSaving(false);
    }
  };

  const getSelectedClassInfo = () => {
    if (!selectedClassId || selectedClassId === "remove") return null;
    return classes.find((c) => c.id.toString() === selectedClassId);
  };

  const selectedClass = getSelectedClassInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle
            className={cn("mt-6", dir === "rtl" ? "text-right" : "text-left")}
          >
            {t("manager.students.assignClass")}
          </DialogTitle>
          <DialogDescription
            className={dir === "rtl" ? "text-right" : "text-left"}
          >
            {t("manager.students.assigningTo")}: {student?.userFirstName}{" "}
            {student?.userLastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                {t("common.loading")}
              </span>
            </div>
          )}

          {/* Current Class */}
          {!loading && student?.classId && (
            <div className="p-3 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2">
                {t("manager.students.currentClass")}
              </h4>
              <p className="text-sm">{student.className}</p>
            </div>
          )}

          {/* Class Selection */}
          {!loading && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("manager.students.selectClass")}
              </label>
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t("common.loading")}
                    </div>
                  ) : (
                    <SelectValue
                      placeholder={t("manager.students.chooseClass")}
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remove">
                    {t("manager.students.noClass")}
                  </SelectItem>
                  {classes.map((classItem) => (
                    <SelectItem
                      key={classItem.id}
                      value={classItem.id.toString()}
                    >
                      {classItem.name} - {classItem.gradeLevel}
                      {classItem.studentCount !== undefined &&
                        ` (${classItem.studentCount} students)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Class Info */}
          {!loading && selectedClass && (
            <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="text-sm font-medium mb-1">
                {t("manager.students.classInfo")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {selectedClass.gradeLevel} • {selectedClass.studentCount || 0}{" "}
                students
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving || loading}
            >
              {t("common.cancel")}
            </Button>
            {!loading && student?.classId && selectedClassId === "remove" ? (
              <Button
                variant="destructive"
                onClick={handleRemove}
                disabled={saving}
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {saving
                  ? t("common.removing")
                  : t("manager.students.removeFromClass")}
              </Button>
            ) : (
              <Button
                onClick={handleAssign}
                disabled={saving || !selectedClassId || loading}
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {saving
                  ? t("common.saving")
                  : t("manager.students.assignToClass")}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
