import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
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
import StudentItemSkeleton from "@/components/skeleton/dashboard/student-item-skeleton";
import StudentItem from "@/components/dashboard/students/student-item";
import EmptyData from "@/components/common/empty-data";
import { useAuth } from "@/hooks/use-auth";
import { useStudentApi } from "@/hooks/use-student";

export default function StudentsList() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    useGetStudentsBySchool,
    useGetGradeLevels,
    useGetClasses,
    prefetchStudentsBySchool,
  } = useStudentApi();

  const [filters, setFilters] = useState({
    search: "",
    gradeLevel: "",
    classId: "",
  });
  const [page, setPage] = useState(0);
  const size = 12;

  // Fetch students with React Query
  const {
    data: studentsResponse,
    isLoading,
    error,
    refetch,
  } = useGetStudentsBySchool(
    Number(user?.currentSchool?.id),
    {
      page,
      size,
      ...filters,
    },
    {
      enabled: !!user?.currentSchool?.id,
    }
  );

  // Fetch grade levels
  const { data: gradeLevels = [] } = useGetGradeLevels(
    Number(user?.currentSchool?.id),
    {
      enabled: !!user?.currentSchool?.id,
    }
  );

  // Fetch classes
  const { data: classes = [] } = useGetClasses(user?.currentSchool?.id, {
    enabled: !!user?.currentSchool?.id,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 0) {
        setPage(0); // Reset to first page when filters change
      } else {
        refetch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, page, refetch]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", gradeLevel: "", classId: "" });
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Prefetch next page for better UX
    if (newPage < (studentsResponse?.pagination.totalPages || 0) - 1) {
      prefetchStudentsBySchool(user?.currentSchool?.id, {
        page: newPage + 1,
        size,
        ...filters,
      });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleStudentUpdated = () => {
    refetch(); // Refetch students when a student is updated (e.g., class assigned)
  };

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Error loading students</h2>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  const students = studentsResponse?.items || [];
  const pagination = studentsResponse?.pagination || {
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t("manager.students.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("manager.students.subtitle", {
              count: pagination.totalElements,
            })}
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
                    placeholder={t("manager.students.searchPlaceholder")}
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
                    <SelectValue
                      placeholder={t("manager.students.gradeLevel")}
                    />
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
                    <SelectValue placeholder={t("manager.students.class")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    {classes.map((classItem) => (
                      <SelectItem
                        key={classItem.id}
                        value={classItem.id.toString()}
                      >
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Right side: Actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center"
                  disabled={isLoading}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t("common.clear")}
                </Button>
                <Button
                  onClick={handleRefresh}
                  className="flex items-center"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  {t("common.refresh")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <StudentItemSkeleton key={i} />
            ))}
          </div>
        ) : students.length === 0 ? (
          <EmptyData
            title={t("manager.students.noStudents")}
            desc={t("manager.students.noStudentsDescription")}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {students.map((student) => (
                <StudentItem
                  key={student.id}
                  student={student}
                  onStudentUpdated={handleStudentUpdated}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {t("common.showing")} {students.length} {t("common.of")}{" "}
                      {pagination.totalElements}{" "}
                      {t("manager.students.students")}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrevious || isLoading}
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
                                disabled={isLoading}
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
                        disabled={!pagination.hasNext || isLoading}
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
