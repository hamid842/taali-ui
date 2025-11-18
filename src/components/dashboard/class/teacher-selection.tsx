import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { TeacherListResponse } from "@/types/teacher";

interface TeacherSelectionProps {
  teachers: TeacherListResponse[];
  teachersLoading: boolean;
  selectedTeacherIds: number[];
  onTeacherSelection: (teacherId: number, checked: boolean) => void;
}

export default function TeacherSelection({
  teachers,
  teachersLoading,
  selectedTeacherIds,
  onTeacherSelection,
}: TeacherSelectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <Label>{t("manager.classes.teachers")}</Label>
      {teachersLoading ? (
        <div className="text-sm text-muted-foreground py-4 text-center">
          {t("common.loading")}
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-6 border rounded-lg">
          <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            {t("admin.classes.noTeachersAvailable")}
          </p>
          <Link to="/manager/teachers/create">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t("teachers.createTeacher")}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="border rounded-lg max-h-48 overflow-y-auto">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex items-center gap-3 p-3 border-b last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedTeacherIds.includes(teacher.id)}
                  onChange={(e) =>
                    onTeacherSelection(teacher.id, e.target.checked)
                  }
                  className="rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">
                    {teacher?.firstName} {teacher?.lastName}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {t("admin.classes.selectedCount", {
              count: selectedTeacherIds.length,
            })}
          </div>
        </>
      )}
    </div>
  );
}
