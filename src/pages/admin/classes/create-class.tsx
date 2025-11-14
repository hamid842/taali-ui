import { useState, useEffect, useCallback, type FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Plus, Save, Users } from "lucide-react";
import { classApi } from "@/lib/api/class-api";
import { teacherApi } from "@/lib/api/teacher-api";
import { studentApi } from "@/lib/api/student-api";
import { useLanguage } from "@/hooks/use-language";
import type { Teacher } from "@/types/teacher";
import type { Student } from "@/types/student";
import type { CreateSchoolClassRequest } from "@/types/class";
import { useAuth } from "@/hooks/use-auth";
import FormHeader from "@/components/common/form-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const CreateClassPage: FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const [formData, setFormData] = useState<CreateSchoolClassRequest>({
    name: "",
    gradeLevel: "",
    academicYear: "1403-1404",
    capacity: 30,
    schoolId: user?.schoolId || 0,
    mainTeacherId: undefined,
    studentIds: [],
    teacherIds: [],
  });

  const loadTeachers = useCallback(async () => {
    try {
      if (!user?.schoolId) return;
      setTeachersLoading(true);
      const data = await teacherApi.getBySchool(user.schoolId);
      setTeachers(data);
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setTeachersLoading(false);
    }
  }, [user?.schoolId]);

  const loadStudents = useCallback(async () => {
    try {
      if (!user?.schoolId) return;
      setStudentsLoading(true);
      const data = await studentApi.getBySchool(user.schoolId);
      setStudents(data.items);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setStudentsLoading(false);
    }
  }, [user?.schoolId]);

  useEffect(() => {
    if (user?.schoolId) {
      loadTeachers();
      loadStudents();
      setFormData((prev) => ({ ...prev, schoolId: user.schoolId! }));
    }
  }, [user, loadTeachers, loadStudents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.schoolId) {
      toast.warning(t("classes.errors.schoolRequired"));
      return;
    }

    if (!formData.name.trim()) {
      toast.warning(t("classes.errors.nameRequired"));
      return;
    }

    if (!formData.academicYear.trim()) {
      toast.warning(t("classes.errors.academicYearRequired"));
      return;
    }

    setLoading(true);

    try {
      await classApi.createClass(formData);
      toast.success(t("classes.success.created"));
      navigate("/admin/classes");
    } catch (error) {
      console.error(t("classes.errors.createFailed"), error);
      toast.error(t("classes.errors.createFailed"));
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

  const handleStudentSelection = (studentId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      studentIds: checked
        ? [...prev.studentIds, studentId]
        : prev.studentIds.filter((id) => id !== studentId),
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
    { value: "مهد کودک", label: t("classes.gradeLevels.kindergarten") },
    { value: "پیش دبستانی", label: t("classes.gradeLevels.preschool") },
    {
      value: "ابتدایی دوره اول",
      label: t("classes.gradeLevels.primaryFirst"),
    },
    {
      value: "ابتدایی دوره دوم",
      label: t("classes.gradeLevels.primarySecond"),
    },
    {
      value: "متوسطه دوره اول",
      label: t("classes.gradeLevels.secondaryFirst"),
    },
    {
      value: "متوسطه دوره دوم",
      label: t("classes.gradeLevels.secondarySecond"),
    },
  ];

  const academicYears = ["1402-1403", "1403-1404", "1404-1405"];

  return (
    <div className="space-y-6">
      <FormHeader
        title={t("classes.createClass")}
        desc={t("classes.createDescription")}
      />
      {/* Information Alert */}
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>{t("classes.createInfo")}</AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("classes.basicInformation")}</CardTitle>
              <CardDescription>
                {t("classes.basicInformationDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("classes.className")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("classes.classNamePlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradeLevel">{t("classes.gradeLevel")}</Label>
                <Select
                  value={formData.gradeLevel}
                  onValueChange={(value) =>
                    handleInputChange("gradeLevel", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("classes.selectGradeLevel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYear">
                  {t("classes.academicYear")} *
                </Label>
                <Select
                  value={formData.academicYear}
                  onValueChange={(value) =>
                    handleInputChange("academicYear", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">{t("classes.capacity")}</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleInputChange("capacity", parseInt(e.target.value))
                  }
                  min="1"
                  max="50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainTeacher">{t("classes.mainTeacher")}</Label>
                {teachersLoading ? (
                  <div className="text-sm text-muted-foreground">
                    {t("common.loading")}
                  </div>
                ) : teachers.length === 0 ? (
                  <div className="space-y-2">
                    <Select disabled>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("classes.noTeachersAvailable")}
                        />
                      </SelectTrigger>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {t("classes.noTeachersMessage")}
                    </p>
                    <Link to="/admin/teachers/create">
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        {t("teachers.createTeacher")}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Select
                    value={formData.mainTeacherId?.toString()}
                    onValueChange={(value) =>
                      handleInputChange("mainTeacherId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("classes.selectMainTeacher")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem
                          key={teacher.id}
                          value={teacher.id.toString()}
                        >
                          {teacher?.user?.firstName} {teacher?.user?.lastName}
                          {teacher.specializations &&
                            ` - ${teacher.specializations}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Students and Teachers Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("classes.studentsAndTeachers")}</CardTitle>
              <CardDescription>
                {t("classes.studentsAndTeachersDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Students Selection */}
              <div className="space-y-3">
                <Label>{t("classes.students")}</Label>
                {studentsLoading ? (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    {t("common.loading")}
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-6 border rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("classes.noStudentsAvailable")}
                    </p>
                    <Link to="/admin/students/create">
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {t("addStudent.create")}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="border rounded-lg max-h-48 overflow-y-auto">
                      {students &&
                        students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center gap-3 p-3 border-b last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={formData.studentIds.includes(
                                student.id!
                              )}
                              onChange={(e) =>
                                handleStudentSelection(
                                  student.id!,
                                  e.target.checked
                                )
                              }
                              className="rounded"
                            />
                            <div className="flex-1">
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {student.studentCode}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {t("classes.selectedCount", {
                        count: formData.studentIds.length,
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Teachers Selection */}
              <div className="space-y-3">
                <Label>{t("classes.teachers")}</Label>
                {teachersLoading ? (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    {t("common.loading")}
                  </div>
                ) : teachers.length === 0 ? (
                  <div className="text-center py-6 border rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("classes.noTeachersAvailable")}
                    </p>
                    <Link to="/admin/teachers/create">
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
                            checked={formData.teacherIds.includes(teacher.id)}
                            onChange={(e) =>
                              handleTeacherSelection(
                                teacher.id,
                                e.target.checked
                              )
                            }
                            className="rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {teacher?.user?.firstName}{" "}
                              {teacher?.user?.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {teacher.specializations}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {t("classes.selectedCount", {
                        count: formData.teacherIds.length,
                      })}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mt-6">
          <Link to="/admin/classes">
            <Button type="button" variant="outline">
              {t("common.cancel")}
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? t("classes.creating") : t("classes.createClass")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateClassPage;
