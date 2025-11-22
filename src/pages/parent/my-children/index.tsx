import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  ClipboardCheck,
  Award,
  User,
  ArrowRight,
  RefreshCw,
  BookOpen,
  School,
} from "lucide-react";
import { useParentDashboard } from "@/hooks/use-parent-dashboard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Child } from "@/types/parent";
import type { TFunction } from "i18next";

export default function MyChildren() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { myChildren, refreshAll, isLoading, error } = useParentDashboard();

  const navigateToChild = (childId: number) => {
    navigate(`/parent/child/${childId}`);
  };

  const navigateToScreen = (screen: string, params?: unknown) => {
    if (params) {
      navigate(`/parent/${screen}?${new URLSearchParams(params as string)}`);
    } else {
      navigate(`/parent/${screen}`);
    }
  };

  if (isLoading) {
    return <MyChildrenSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription className="flex items-center justify-between">
          <span>{t("parent.children.errorLoading")}</span>
          <Button variant="outline" size="sm" onClick={refreshAll}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.retry")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const children = myChildren.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("parent.children.title")}
          </h1>
          <p className="text-muted-foreground">
            {children.length === 0
              ? t("parent.children.noChildren")
              : t("parent.children.subtitle", { count: children.length })}
          </p>
        </div>

        {children.length > 0 && (
          <Button onClick={refreshAll} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.refresh")}
          </Button>
        )}
      </div>

      {/* Children Grid */}
      {children.length === 0 ? (
        <EmptyState t={t} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onViewDetails={() => navigateToChild(child.id)}
              onViewAttendance={() =>
                navigateToScreen("children-attendance", {
                  childId: String(child.id),
                })
              }
              onViewGrades={() =>
                navigateToScreen("children-grades", { childId: child.id })
              }
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Child Card Component
interface ChildCardProps {
  child: Child;
  onViewDetails: () => void;
  onViewAttendance: () => void;
  onViewGrades: () => void;
  t: TFunction<"translation", undefined>;
}

function ChildCard({
  child,
  onViewDetails,
  onViewAttendance,
  onViewGrades,
  t,
}: ChildCardProps) {
  const getGradeColor = (grade?: string) => {
    if (!grade) return "bg-gray-100 text-gray-700";

    const gradeMap: { [key: string]: string } = {
      A: "bg-green-100 text-green-700 border-green-200",
      "B+": "bg-blue-100 text-blue-700 border-blue-200",
      B: "bg-blue-100 text-blue-700 border-blue-200",
      "C+": "bg-yellow-100 text-yellow-700 border-yellow-200",
      C: "bg-yellow-100 text-yellow-700 border-yellow-200",
      D: "bg-orange-100 text-orange-700 border-orange-200",
      F: "bg-red-100 text-red-700 border-red-200",
    };

    return gradeMap[grade] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (rate >= 80) return "bg-blue-100 text-blue-700 border-blue-200";
    if (rate >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardContent className="p-0">
        {/* Header with Avatar and Basic Info */}
        <div
          className="p-6 cursor-pointer border-b hover:bg-muted/50 transition-colors"
          onClick={onViewDetails}
        >
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {child.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold truncate">{child.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {child.grade} • {child.className}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
                  {child.schoolName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className={`w-full justify-center border ${getAttendanceColor(
                  child.attendanceRate
                )}`}
              >
                <ClipboardCheck className="h-3 w-3 mr-1" />
                {child.attendanceRate}%
              </Badge>
              <p className="text-xs text-muted-foreground">
                {t("parent.children.attendance")}
              </p>
            </div>

            <div className="space-y-2">
              {child.averageGrade ? (
                <>
                  <Badge
                    variant="secondary"
                    className={`w-full justify-center border ${getGradeColor(
                      child.averageGrade
                    )}`}
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {child.averageGrade}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {t("parent.children.averageGrade")}
                  </p>
                </>
              ) : (
                <>
                  <Badge
                    variant="secondary"
                    className="w-full justify-center border"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    {t("common.notAvailable")}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {t("parent.children.averageGrade")}
                  </p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="w-full justify-center border"
              >
                <User className="h-3 w-3 mr-1" />
                {child.teacherName.split(" ")[0]}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {t("parent.children.teacher")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onViewAttendance}
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              {t("parent.children.attendance")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onViewGrades}
            >
              <Award className="h-4 w-4 mr-2" />
              {t("parent.children.grades")}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={onViewDetails}
          >
            {t("parent.children.viewFullProfile")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ t }: { t: TFunction<"translation", undefined> }) {
  return (
    <Card>
      <CardContent className="p-12">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">
              {t("parent.children.noChildrenFound")}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("parent.children.noChildrenDescription")}
            </p>
          </div>
          <div className="flex justify-center space-x-4 pt-4">
            <Button variant="outline">
              <School className="h-4 w-4 mr-2" />
              {t("parent.children.contactSchool")}
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("common.refresh")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Loader
function MyChildrenSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-2">
            <CardContent className="p-0">
              {/* Header Skeleton */}
              <div className="p-6 border-b">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-6 w-full rounded-full" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="p-4 space-y-2">
                <div className="flex space-x-2">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 flex-1 rounded-md" />
                </div>
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
