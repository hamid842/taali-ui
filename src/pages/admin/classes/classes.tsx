import React, { useState, useEffect, useCallback } from "react";
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
import { Plus, Edit, Users, Calendar } from "lucide-react";
import { classApi } from "@/lib/api/class-api";
import { useLanguage } from "@/hooks/use-language";
import { useRoles } from "@/hooks/use-roles";
import type { SchoolClass } from "@/types/class";
import { useAppStore } from "@/stores/app-store";

const ClassesPage: React.FC = () => {
  const { canManageClasses } = useRoles();
  const { t } = useLanguage();
  const { currentSchool } = useAppStore();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [academicYearFilter, setAcademicYearFilter] = useState("all");

  const loadClasses = useCallback(async () => {
    try {
      if (!currentSchool?.id) {
        console.error("No school ID found");
        return;
      }

      const data = await classApi.getClassesBySchool(currentSchool.id);
      setClasses(data);
    } catch (error) {
      console.error(t("admin.classes.errors.loadFailed"), error);
    } finally {
      setLoading(false);
    }
  }, [currentSchool, t]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.gradeLevel?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && classItem.isActive) ||
      (statusFilter === "inactive" && !classItem.isActive);
    const matchesYear =
      academicYearFilter === "all" ||
      classItem.academicYear === academicYearFilter;

    return matchesSearch && matchesStatus && matchesYear;
  });

  const academicYears = Array.from(new Set(classes.map((c) => c.academicYear)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t("admin.classes.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.classes.title")}</h1>
          <p className="text-muted-foreground">{t("admin.classes.description")}</p>
        </div>
        {canManageClasses() && (
          <Link to="/admin/classes/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("admin.classes.createClass")}
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("admin.classes.searchPlaceholder")}
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
                  <SelectItem value="all">{t("admin.classes.allStatus")}</SelectItem>
                  <SelectItem value="active">{t("common.active")}</SelectItem>
                  <SelectItem value="inactive">
                    {t("common.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={academicYearFilter}
                onValueChange={setAcademicYearFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("admin.classes.academicYear")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.classes.allYears")}</SelectItem>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
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
                  {t("admin.classes.name")}
                </TableHead>
                <TableHead className="text-center">
                  {t("admin.classes.gradeLevel")}
                </TableHead>
                <TableHead className="text-center">
                  {t("admin.classes.academicYear")}
                </TableHead>
                <TableHead className="text-center">
                  {t("admin.classes.students")}
                </TableHead>
                <TableHead className="text-center">
                  {t("admin.classes.teachers")}
                </TableHead>
                <TableHead className="text-center">
                  {t("common.status")}
                </TableHead>
                <TableHead className="text-center">
                  {t("common.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("admin.classes.noClassesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell className="font-medium">
                      {classItem.name}
                    </TableCell>
                    <TableCell>{classItem.gradeLevel || "-"}</TableCell>
                    <TableCell>{classItem.academicYear}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4" />
                        {classItem.studentCount}
                      </div>
                    </TableCell>
                    <TableCell>{classItem.teacherCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={classItem.isActive ? "default" : "secondary"}
                      >
                        {classItem.isActive
                          ? t("common.active")
                          : t("common.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/classes/${classItem.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            {t("common.edit")}
                          </Button>
                        </Link>
                        <Link to={`/admin/classes/${classItem.id}/schedule`}>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {t("admin.classes.schedule")}
                          </Button>
                        </Link>
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
};

export default ClassesPage;
