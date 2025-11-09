import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Mail } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher-api";
import { useLanguage } from "@/hooks/use-language";
import { useRoles } from "@/hooks/use-roles";
import type { Teacher } from "@/types/teacher";
import { ImageDisplay } from "@/components/common/image-display";

export default function TeachersPage() {
  const { canManageTeachers, user } = useRoles();
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const loadTeachers = useCallback(async () => {
    try {
      if (!user?.schoolId) {
        console.error("No school ID found");
        return;
      }

      const data = await teacherApi.getBySchool(user.schoolId);
      setTeachers(data);
    } catch (error) {
      console.error(t("teachers.errors.loadFailed"), error);
    } finally {
      setLoading(false);
    }
  }, [user?.schoolId, t]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const handleDeleteTeacher = async (teacherId: number) => {
    if (!confirm(t("teachers.confirmDelete"))) {
      return;
    }

    try {
      await teacherApi.delete(teacherId);
      // Remove the teacher from the local state
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
    } catch (error) {
      console.error(t("teachers.errors.deleteFailed"), error);
      alert(t("teachers.errors.deleteFailed"));
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.user?.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && teacher.isActive) ||
      (statusFilter === "inactive" && !teacher.isActive);
    const matchesSubject =
      subjectFilter === "all" || teacher.subjects?.includes(subjectFilter);

    return matchesSearch && matchesStatus && matchesSubject;
  });

  const allSubjects = Array.from(
    new Set(teachers.flatMap((teacher) => teacher.subjects || []))
  ).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("teachers.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("teachers.title")}</h1>
          <p className="text-muted-foreground">{t("teachers.description")}</p>
        </div>
        {canManageTeachers() && (
          <Link to="/admin/teachers/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("teachers.createTeacher")}
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("teachers.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={t("common.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("teachers.allStatus")}</SelectItem>
                  <SelectItem value="active">{t("common.active")}</SelectItem>
                  <SelectItem value="inactive">
                    {t("common.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("teachers.subject")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("teachers.allSubjects")}
                  </SelectItem>
                  {allSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  {t("teachers.name")}
                </TableHead>
                <TableHead className="text-center">
                  {t("teachers.email")}
                </TableHead>
                <TableHead className="text-center">
                  {t("teachers.subjects")}
                </TableHead>
                {/* <TableHead className="text-center">
                  {t("teachers.classes")}
                </TableHead> */}
                <TableHead className="text-center">
                  {t("common.status")}
                </TableHead>
                <TableHead className="text-center">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("teachers.noTeachersFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <ImageDisplay
                          imageUrl={teacher.user.profileImage}
                          size="xs"
                        />
                        <span>
                          {teacher.user.firstName} {teacher.user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Mail className="w-4 h-4" />
                        {teacher.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {teacher.subjects?.slice(0, 2).map((subject) => (
                          <Badge key={subject} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                        {teacher.subjects && teacher.subjects.length > 2 && (
                          <Badge variant="outline">
                            +{teacher.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {teacher.classCount || 0}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Badge
                        variant={teacher.isActive ? "default" : "secondary"}
                      >
                        {teacher.isActive
                          ? t("common.active")
                          : t("common.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/teachers/${teacher.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            {t("common.view")}
                          </Button>
                        </Link>
                        {canManageTeachers() && (
                          <>
                            <Link to={`/admin/teachers/edit/${teacher.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-1" />
                                {t("common.edit")}
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t("common.delete")}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
