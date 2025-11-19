import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Check, X } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher-api";
import { classApi } from "@/lib/api/class-api";
import { useLanguage } from "@/hooks/use-language";
import type {
  TeacherDetailResponse,
  TeacherClassResponse,
} from "@/types/teacher";
import type { SchoolClass } from "@/types/class";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";

export default function AssignClassesToTeacher() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { user } = useAuth();

  const [teacher, setTeacher] = useState<TeacherDetailResponse | null>(null);
  const [availableClasses, setAvailableClasses] = useState<SchoolClass[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    try {
      if (!teacherId || !user?.currentSchool?.id) return;

      const [teacherData, schoolClasses] = await Promise.all([
        teacherApi.getById(parseInt(teacherId)),
        classApi.getClassesBySchool(user?.currentSchool.id),
      ]);

      setTeacher(teacherData);
      setAvailableClasses(schoolClasses);

      // If teacher already has assigned classes, separate them
      if (teacherData.classes && teacherData.classes.length > 0) {
        const assignedClassIds = new Set(
          teacherData.classes.map((c: TeacherClassResponse) => c.classId)
        );
        const assigned = schoolClasses.filter((c) =>
          assignedClassIds.has(c.id)
        );
        const available = schoolClasses.filter(
          (c) => !assignedClassIds.has(c.id)
        );

        setAssignedClasses(assigned);
        setAvailableClasses(available);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [teacherId, user?.currentSchool]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssignClass = (classItem: SchoolClass) => {
    setAssignedClasses((prev) => [...prev, classItem]);
    setAvailableClasses((prev) => prev.filter((c) => c.id !== classItem.id));
  };

  const handleRemoveClass = (classItem: SchoolClass) => {
    setAvailableClasses((prev) => [...prev, classItem]);
    setAssignedClasses((prev) => prev.filter((c) => c.id !== classItem.id));
  };

  const handleSave = async () => {
    if (!teacher) return;

    setSaving(true);
    try {
      const classIds = assignedClasses.map((c) => c.id);
      await teacherApi.assignClasses(teacher.id, classIds);

      navigate("/manager/teachers");
    } catch (error) {
      console.error("Failed to assign classes:", error);
      alert(t("manager.teachers.errors.assignClassesFailed"));
    } finally {
      setSaving(false);
    }
  };

  const filteredAvailableClasses = availableClasses.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.gradeLevel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          {t("manager.teachers.teacherNotFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/manager/teachers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {t("manager.teachers.assignClasses")}
            </h1>
            <p className="text-muted-foreground">
              {t("manager.teachers.assigningTo")}: {teacher.firstName}{" "}
              {teacher.lastName}
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t("common.saving") : t("common.saveChanges")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("manager.teachers.availableClasses")}</span>
              <Badge variant="secondary">{availableClasses.length}</Badge>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("manager.teachers.searchClasses")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {filteredAvailableClasses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {availableClasses.length === 0
                    ? t("manager.teachers.noClassesAvailable")
                    : t("manager.teachers.noClassesMatchSearch")}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => handleAssignClass(classItem)}
                    >
                      <div dir={dir}>
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {classItem.gradeLevel} • {classItem.studentCount || 0}{" "}
                          students
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Assigned Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("manager.teachers.assignedClasses")}</span>
              <Badge variant="default">{assignedClasses.length}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("manager.teachers.assignedClassesDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {assignedClasses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t("manager.teachers.noClassesAssigned")}
                </div>
              ) : (
                <div className="space-y-2">
                  {assignedClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-accent"
                    >
                      <div dir={dir}>
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {classItem.gradeLevel} • {classItem.studentCount || 0}{" "}
                          students
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveClass(classItem)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("manager.teachers.teacherInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("manager.teachers.name")}
              </label>
              <p className="font-medium">
                {teacher.firstName} {teacher.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("manager.teachers.email")}
              </label>
              <p className="font-medium">{teacher.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("manager.teachers.subjects")}
              </label>
              <div className="flex flex-wrap gap-1">
                {teacher.specializations?.map((subject: string) => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
                {(!teacher.specializations ||
                  teacher.specializations.length === 0) && (
                  <span className="text-sm text-muted-foreground">
                    {t("manager.teachers.noSubjects")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
