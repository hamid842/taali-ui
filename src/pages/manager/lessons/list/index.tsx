import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { BookOpen, Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { lessonApi } from "@/lib/api/lesson-api";
import { EDUCATION_PERIODS, IRANIAN_GRADE_LEVELS } from "@/constants/education";
import type { Lesson } from "@/types/lesson";
import LessonsListSkeleton from "@/components/skeleton/dashboard/lesson-list-skeleton";

interface LessonsListPageProps {
  onAddLesson?: () => void;
  onEditLesson?: (lesson: Lesson) => void;
}

export default function Lessons({
  onAddLesson,
  onEditLesson,
}: LessonsListPageProps) {
  const { t, language } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadLessons = async () => {
      setIsLoading(true);
      try {
        const data = await lessonApi.getAll();
        setLessons(data);
      } catch (error: unknown) {
        console.error("Failed to load lessons:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : t("manager.lessons.list.loadError");
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [t]);

  // Group lessons by period and then by grade
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const gradeLevelInfo = IRANIAN_GRADE_LEVELS.find(
      (g) => g.code === lesson.gradeLevel
    );
    const period = gradeLevelInfo?.period || "OTHER";

    if (!acc[period]) {
      acc[period] = {};
    }

    if (!acc[period][lesson.gradeLevel]) {
      acc[period][lesson.gradeLevel] = [];
    }

    acc[period][lesson.gradeLevel].push(lesson);
    return acc;
  }, {} as Record<string, Record<string, Lesson[]>>);

  // Filter lessons based on search and period filter
  const filteredAndGroupedLessons = Object.entries(groupedLessons).reduce(
    (acc, [period, gradeLessons]) => {
      const filteredGradeLessons = Object.entries(gradeLessons).reduce(
        (gradeAcc, [gradeLevel, gradeLessonList]) => {
          const filteredLessons = gradeLessonList.filter(
            (lesson) =>
              lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              lesson?.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredLessons.length > 0) {
            gradeAcc[gradeLevel] = filteredLessons;
          }

          return gradeAcc;
        },
        {} as Record<string, Lesson[]>
      );

      if (
        Object.keys(filteredGradeLessons).length > 0 &&
        (selectedPeriod === "all" || selectedPeriod === period)
      ) {
        acc[period] = filteredGradeLessons;
      }

      return acc;
    },
    {} as Record<string, Record<string, Lesson[]>>
  );

  const periodOptions = [
    { value: "all", label: t("common.all") || "All Periods" },
    {
      value: "PRE_PRIMARY",
      label:
        language === "fa"
          ? EDUCATION_PERIODS.PRE_PRIMARY.name
          : EDUCATION_PERIODS.PRE_PRIMARY.nameEn,
    },
    {
      value: "FIRST_PERIOD_PRIMARY",
      label:
        language === "fa"
          ? EDUCATION_PERIODS.FIRST_PERIOD_PRIMARY.name
          : EDUCATION_PERIODS.FIRST_PERIOD_PRIMARY.nameEn,
    },
    {
      value: "SECOND_PERIOD_PRIMARY",
      label:
        language === "fa"
          ? EDUCATION_PERIODS.SECOND_PERIOD_PRIMARY.name
          : EDUCATION_PERIODS.SECOND_PERIOD_PRIMARY.nameEn,
    },
    {
      value: "LOWER_SECONDARY",
      label:
        language === "fa"
          ? EDUCATION_PERIODS.LOWER_SECONDARY.name
          : EDUCATION_PERIODS.LOWER_SECONDARY.nameEn,
    },
    {
      value: "UPPER_SECONDARY",
      label:
        language === "fa"
          ? EDUCATION_PERIODS.UPPER_SECONDARY.name
          : EDUCATION_PERIODS.UPPER_SECONDARY.nameEn,
    },
  ];

  const getPeriodColor = (period: string): string => {
    const colors: Record<string, string> = {
      PRE_PRIMARY: "bg-pink-100 text-pink-800 border-pink-200",
      FIRST_PERIOD_PRIMARY: "bg-blue-100 text-blue-800 border-blue-200",
      SECOND_PERIOD_PRIMARY: "bg-green-100 text-green-800 border-green-200",
      LOWER_SECONDARY: "bg-purple-100 text-purple-800 border-purple-200",
      UPPER_SECONDARY: "bg-orange-100 text-orange-800 border-orange-200",
      TERTIARY: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[period] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const togglePeriod = (period: string) => {
    const newExpanded = new Set(expandedPeriods);
    if (newExpanded.has(period)) {
      newExpanded.delete(period);
    } else {
      newExpanded.add(period);
    }
    setExpandedPeriods(newExpanded);
  };

  if (isLoading) {
    return <LessonsListSkeleton />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("manager.lessons.list.title") || "Lessons"}
          </h1>
          <p className="text-muted-foreground">
            {t("manager.lessons.list.description") ||
              "Manage curriculum lessons across all educational periods"}
          </p>
        </div>
        <Button onClick={onAddLesson} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("manager.lessons.list.addLesson") || "Add Lesson"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  t("manager.lessons.list.searchPlaceholder") ||
                  "Search lessons..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lessons by Period and Grade */}
      <div className="space-y-4">
        {Object.entries(filteredAndGroupedLessons).map(
          ([period, gradeLessons]) => {
            const periodInfo =
              EDUCATION_PERIODS[period as keyof typeof EDUCATION_PERIODS];
            const periodName =
              language === "fa"
                ? periodInfo?.name
                : periodInfo?.nameEn || period;
            const totalLessons = Object.values(gradeLessons).flat().length;
            const isExpanded = expandedPeriods.has(period);

            return (
              <Card key={period} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer pb-4"
                  onClick={() => togglePeriod(period)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5" />
                      <CardTitle className="text-lg">{periodName}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={getPeriodColor(period)}
                      >
                        {totalLessons}{" "}
                        {t("manager.lessons.list.lessons") || "lessons"}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {t("manager.lessons.list.periodDescription") ||
                      `Curriculum lessons for ${periodName}`}
                  </CardDescription>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 border-t">
                    <div className="space-y-6">
                      {Object.entries(gradeLessons).map(
                        ([gradeLevel, gradeLessonList]) => {
                          const gradeInfo = IRANIAN_GRADE_LEVELS.find(
                            (g) => g.code === gradeLevel
                          );
                          const gradeName = gradeInfo
                            ? language === "fa"
                              ? gradeInfo.name
                              : gradeInfo.nameEn
                            : gradeLevel;

                          return (
                            <div key={gradeLevel} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-base">
                                  {gradeName}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {gradeLessonList.length}{" "}
                                  {t("manager.lessons.list.lessons") ||
                                    "lessons"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {gradeLessonList.map((lesson) => (
                                  <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    onEdit={onEditLesson}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          }
        )}

        {/* Empty State */}
        {Object.keys(filteredAndGroupedLessons).length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm || selectedPeriod !== "all"
                    ? t("manager.lessons.list.noMatchingLessons") ||
                      "No lessons match your search criteria"
                    : t("manager.lessons.list.noLessons") || "No lessons found"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedPeriod !== "all"
                    ? t("manager.lessons.list.tryDifferentSearch") ||
                      "Try adjusting your search or filter criteria"
                    : t("manager.lessons.list.emptyDescription") ||
                      "Get started by creating your first lesson"}
                </p>
                {!searchTerm &&
                  selectedPeriod === "all" &&
                  lessons.length === 0 && (
                    <Button onClick={onAddLesson} className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t("manager.lessons.list.addFirstLesson") ||
                        "Add First Lesson"}
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Individual Lesson Card Component
interface LessonCardProps {
  lesson: Lesson;
  onEdit?: (lesson: Lesson) => void;
}

function LessonCard({ lesson, onEdit }: LessonCardProps) {
  const { language } = useLanguage();
  const gradeInfo = IRANIAN_GRADE_LEVELS.find(
    (g) => g.code === lesson.gradeLevel
  );

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer group border-l-4"
      style={{ borderLeftColor: lesson.color }}
      onClick={() => onEdit?.(lesson)}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                {lesson.name}
              </h4>
              <p className="text-xs text-muted-foreground">{lesson.nameEn}</p>
            </div>
          </div>
          {gradeInfo && (
            <Badge
              variant="outline"
              className="text-xs group-hover:bg-accent transition-colors"
            >
              {language === "fa" ? gradeInfo.name : gradeInfo.nameEn}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Loading Component
