import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { studentApi } from "@/lib/api/student-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import type { Student } from "@/types/student";
import StudentItemSkeleton from "@/components/skeleton/dashboard/student-item-skeleton";
import StudentItem from "@/components/dashboard/students/student-item";
import EmptyData from "@/components/common/empty-data";

export default function StudentsList() {
  const { t } = useLanguage();
  const { currentSchool } = useAppStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    gradeLevel: "",
    classId: "",
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const [gradeLevels, setGradeLevels] = useState<string[]>([]);

  const fetchStudents = async (page = 0) => {
    setLoading(true);
    try {
      const response = await studentApi.getBySchool(currentSchool!.id, {
        page,
        size: pagination.size,
        ...filters,
      });

      setStudents(response.items);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGradeLevels = async () => {
    try {
      const levels = await studentApi.getGradeLevels(currentSchool!.id);
      setGradeLevels(levels);
    } catch (error) {
      console.error("Failed to fetch grade levels:", error);
    }
  };

  useEffect(() => {
    fetchStudents(0);
    fetchGradeLevels();
  }, [currentSchool]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchStudents(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", gradeLevel: "", classId: "" });
  };

  const handlePageChange = (newPage: number) => {
    fetchStudents(newPage);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("students.title")}</h1>
          <p className="text-muted-foreground">
            {t("students.subtitle", { count: pagination.totalElements })}
          </p>
        </div>

        {/* Filters Card */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left side: Filters */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("students.searchPlaceholder")}
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>

                {/* Grade Level Filter */}
                <Select
                  value={filters.gradeLevel || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "gradeLevel",
                      value === "all" ? "" : value
                    )
                  }
                >
                  <SelectTrigger className="min-w-[150px]">
                    <SelectValue placeholder={t("students.gradeLevel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    {gradeLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Class Filter */}
                <Select
                  value={filters.classId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("classId", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="min-w-[150px]">
                    <SelectValue placeholder={t("students.class")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="1">Class 1A</SelectItem>
                    <SelectItem value="2">Class 1B</SelectItem>
                    <SelectItem value="3">Class 2A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Right side: Actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t("common.clear")}
                </Button>
                <Button
                  onClick={() => fetchStudents(0)}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("common.refresh")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <StudentItemSkeleton key={i} />
            ))}
          </div>
        ) : students.length === 0 ? (
          <EmptyData
            title={t("students.noStudents")}
            desc={t("students.noStudentsDescription")}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {students.map((student) => (
                <StudentItem key={student.id} student={student} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {t("common.showing")} {students.length} {t("common.of")}{" "}
                      {pagination.totalElements} {t("students.students")}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrevious}
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        {t("common.previous")}
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const pageNum = i;
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pagination.page === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum + 1}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasNext}
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        {t("common.next")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
