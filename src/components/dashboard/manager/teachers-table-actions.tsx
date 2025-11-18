import { AppTooltip } from "@/components/common/app-tooltip";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useRoles } from "@/hooks/use-roles";
import { teacherApi } from "@/lib/api/teacher-api";
import { Edit, Eye, FileImage, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

type TeachersTableActionsProps = {
  teacherId: number;
};

export default function TeachersTableActions({
  teacherId,
}: TeachersTableActionsProps) {
  const { t } = useLanguage();
  const { canManageTeachers } = useRoles();

  const handleDeleteTeacher = async () => {
    if (!confirm(t("admin.teachers.confirmDelete"))) {
      return;
    }

    try {
      await teacherApi.delete(teacherId);
      // TODO fetch teachers again
    } catch (error) {
      console.error(t("admin.teachers.errors.deleteFailed"), error);
      alert(t("admin.teachers.errors.deleteFailed"));
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <AppTooltip content={t("common.view")}>
        <Link to={`/teachers/${teacherId}`}>
          <Button variant="outline" size="icon">
            <Eye className="w-4 h-4 mr-1" />
          </Button>
        </Link>
      </AppTooltip>
      {canManageTeachers() && (
        <>
          <AppTooltip content={t("common.edit")}>
            <Link to={`/manager/teachers/edit/${teacherId}`}>
              <Button variant="outline" size="icon">
                <Edit className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </AppTooltip>
          <AppTooltip content={t("common.assignClass")}>
            <Link to={`/manager/teachers/assign-classes/${teacherId}`}>
              <Button variant="outline" size="icon">
                <FileImage className="w-4 h-4 mr-1" />
              </Button>
            </Link>
          </AppTooltip>
          <AppTooltip content={t("common.delete")}>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDeleteTeacher}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
            </Button>
          </AppTooltip>
        </>
      )}
    </div>
  );
}
