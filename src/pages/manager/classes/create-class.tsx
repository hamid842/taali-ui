import { useState, useEffect, useCallback, type FC, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Plus, Save } from "lucide-react";
import { classApi } from "@/lib/api/class-api";
import { teacherApi } from "@/lib/api/teacher-api";
import { useLanguage } from "@/hooks/use-language";
import type { TeacherListResponse } from "@/types/teacher";
import type { CreateSchoolClassRequest } from "@/types/class";
import FormHeader from "@/components/common/form-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AppTextField } from "@/components/common/app-text-field";
import AppSelect, {
  type SelectFieldOptions,
} from "@/components/common/app-select-field";
import TeacherSelection from "@/components/dashboard/class/teacher-selection";
import { useAuth } from "@/hooks/use-auth";

const CreateClassPage: FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherListResponse[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);

  const [formData, setFormData] = useState<CreateSchoolClassRequest>({
    name: "",
    gradeLevel: "",
    academicYear: "1403-1404",
    capacity: 30,
    schoolId: user?.currentSchool?.id || 0,
    mainTeacherId: undefined,
    teacherIds: [],
  });

  const loadTeachers = useCallback(async () => {
    try {
      if (!user?.currentSchool?.id) return;
      setTeachersLoading(true);
      const data = await teacherApi.getBySchool(user?.currentSchool?.id);
      setTeachers(data);
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setTeachersLoading(false);
    }
  }, [user?.currentSchool]);

  useEffect(() => {
    if (user?.currentSchool?.id) {
      loadTeachers();
      setFormData((prev) => ({
        ...prev,
        schoolId: Number(user?.currentSchool?.id),
      }));
    }
  }, [user?.currentSchool, loadTeachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.schoolId) {
      toast.warning(t("manager.classes.errors.schoolRequired"));
      return;
    }

    if (!formData.name.trim()) {
      toast.warning(t("manager.classes.errors.nameRequired"));
      return;
    }

    if (!formData.academicYear.trim()) {
      toast.warning(t("manager.classes.errors.academicYearRequired"));
      return;
    }

    setLoading(true);

    try {
      await classApi.createClass(formData);
      toast.success(t("manager.classes.success.created"));
      navigate("/manager/classes");
    } catch (error) {
      console.error(t("manager.classes.errors.createFailed"), error);
      toast.error(t("manager.classes.errors.createFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTeacherSelection = (teacherId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      teacherIds: checked
        ? [...prev.teacherIds, teacherId]
        : prev.teacherIds.filter((id) => id !== teacherId),
    }));
  };

  const gradeLevels = [
    { value: "مهد کودک", label: t("manager.classes.gradeLevels.kindergarten") },
    { value: "پیش دبستانی", label: t("manager.classes.gradeLevels.preschool") },
    {
      value: "ابتدایی دوره اول",
      label: t("manager.classes.gradeLevels.primaryFirst"),
    },
    {
      value: "ابتدایی دوره دوم",
      label: t("manager.classes.gradeLevels.primarySecond"),
    },
    {
      value: "متوسطه دوره اول",
      label: t("manager.classes.gradeLevels.secondaryFirst"),
    },
    {
      value: "متوسطه دوره دوم",
      label: t("manager.classes.gradeLevels.secondarySecond"),
    },
  ];

  const academicYears = [
    {
      value: "1402-1403",
      label: "1402-1403",
    },
    {
      value: "1403-1404",
      label: "1403-1404",
    },
    {
      value: "1404-1405",
      label: "1404-1405",
    },
  ];

  const teacherOptions: SelectFieldOptions[] = useMemo(() => {
    return teachers.length
      ? teachers.map((teacher) => ({
          value: teacher.id,
          label: `${teacher.firstName} ${teacher.lastName}`,
        }))
      : [];
  }, [teachers]);

  return (
    <div className="space-y-6">
      <FormHeader
        title={t("manager.classes.createClass")}
        desc={t("manager.classes.createDescription")}
      />
      {/* Information Alert */}
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>{t("manager.classes.createInfo")}</AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("manager.classes.basicInformation")}</CardTitle>
              <CardDescription>
                {t("manager.classes.basicInformationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AppTextField
                label={t("manager.classes.className")}
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("manager.classes.classNamePlaceholder")}
                required
              />
              <AppSelect
                label={t("manager.classes.gradeLevel")}
                value={formData.gradeLevel}
                onValueChange={(value) =>
                  handleInputChange("gradeLevel", value)
                }
                options={gradeLevels}
                required
              />
              <AppSelect
                required
                label={t("manager.classes.academicYear")}
                value={formData.academicYear}
                onValueChange={(value) =>
                  handleInputChange("academicYear", value)
                }
                options={academicYears}
              />
              <AppTextField
                label={t("manager.classes.capacity")}
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  handleInputChange("capacity", parseInt(e.target.value))
                }
                min="1"
                max="50"
              />
              {teachers.length === 0 ? (
                <div className="space-y-2">
                  <AppSelect
                    label={t("manager.classes.mainTeacher")}
                    options={[]}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("manager.classes.noTeachersMessage")}
                  </p>
                  <Link to="/manager/teachers/create">
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      {t("manager.teachers.createTeacher")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <AppSelect
                  label={t("manager.classes.mainTeacher")}
                  value={formData.mainTeacherId?.toString()}
                  onValueChange={(value) =>
                    handleInputChange("mainTeacherId", parseInt(value))
                  }
                  options={teacherOptions}
                />
              )}
            </CardContent>
          </Card>

          {/* Students and Teachers Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("manager.classes.studentsAndTeachers")}</CardTitle>
              <CardDescription>
                {t("manager.classes.studentsAndTeachersDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TeacherSelection
                teachers={teachers}
                teachersLoading={teachersLoading}
                selectedTeacherIds={formData.teacherIds}
                onTeacherSelection={handleTeacherSelection}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mt-6">
          <Link to="/manager/classes">
            <Button type="button" variant="outline">
              {t("common.cancel")}
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading
              ? t("manager.classes.creating")
              : t("manager.classes.createClass")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassPage;
