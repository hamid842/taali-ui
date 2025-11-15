import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  Calendar,
  BookOpen,
  Clock,
  MapPin,
  Eye,
} from "lucide-react";
import { teacherApi } from "@/lib/api/teacher-api";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  TeacherClassDetail,
  UpcomingClass,
} from "@/types/teacher-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function TeacherClasses() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [classes, setClasses] = useState<TeacherClassDetail[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const loadTeacherClasses = useCallback(async () => {
    if (!user?.id) return;
    console.log("UI ID ========", user.id);
    try {
      setLoading(true);
      const [classesData, upcomingData] = await Promise.all([
        teacherApi.getTeacherClassesWithDetails(user.id),
        teacherApi.getUpcomingClasses(user.id),
      ]);

      setClasses(classesData);
      setUpcomingClasses(upcomingData);
    } catch (error) {
      console.error("Failed to load classes:", error);
      toast.error(t("teacher.myClasses.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    loadTeacherClasses();
  }, [loadTeacherClasses]);

  // Filter classes based on search and filters
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      subjectFilter === "all" || classItem.subject === subjectFilter;

    const matchesGrade =
      gradeFilter === "all" || classItem.gradeLevel === gradeFilter;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "withStudents" && classItem.studentCount > 0) ||
      (activeTab === "noStudents" && classItem.studentCount === 0);

    return matchesSearch && matchesSubject && matchesGrade && matchesTab;
  });

  const allSubjects = Array.from(new Set(classes.map((c) => c.subject))).sort();

  const allGrades = Array.from(
    new Set(classes.map((c) => c.gradeLevel).filter(Boolean))
  ).sort();

  const getNextClass = () => {
    const now = new Date();
    return upcomingClasses.find((cls) => new Date(cls.startTime) > now);
  };

  const nextClass = getNextClass();

  if (loading) {
    return <ClassesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("teacher.myClasses.title")}</h1>
          <p className="text-muted-foreground">
            {t("teacher.myClasses.description")}
          </p>
        </div>

        {nextClass && (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {t("teacher.myClasses.nextClass")}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 truncate">
                    {nextClass.className} - {nextClass.subject}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {new Date(nextClass.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • {nextClass.room}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classes.length}</p>
                <p className="text-sm text-muted-foreground">
                  {t("teacher.myClasses.totalClasses")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("teacher.myClasses.totalStudents")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingClasses.length}</p>
                <p className="text-sm text-muted-foreground">
                  {t("teacher.myClasses.upcomingToday")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("teacher.myClasses.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue
                    placeholder={t("teacher.myClasses.allSubjects")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("teacher.myClasses.allSubjects")}
                  </SelectItem>
                  {allSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={t("teacher.myClasses.allGrades")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("teacher.myClasses.allGrades")}
                  </SelectItem>
                  {allGrades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs and Classes Grid */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            {t("teacher.myClasses.allClasses")} ({classes.length})
          </TabsTrigger>
          <TabsTrigger value="withStudents">
            {t("teacher.myClasses.withStudents")} (
            {classes.filter((c) => c.studentCount > 0).length})
          </TabsTrigger>
          <TabsTrigger value="noStudents">
            {t("teacher.myClasses.noStudents")} (
            {classes.filter((c) => c.studentCount === 0).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("teacher.myClasses.noClassesFound")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("teacher.myClasses.noClassesDescription")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Class Card Component
interface ClassCardProps {
  classItem: TeacherClassDetail;
}

function ClassCard({ classItem }: ClassCardProps) {
  const { t,dir } = useLanguage();

  return (
    <Card dir={dir} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {classItem.gradeLevel}
          </Badge>
          <Badge
            variant={classItem.studentCount > 0 ? "default" : "outline"}
            className={
              classItem.studentCount > 0
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            <Users className="h-3 w-3 mr-1" />
            {classItem.studentCount}
          </Badge>
        </div>

        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {classItem.className}
        </CardTitle>

        <div className="flex items-center gap-2 mt-1">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {classItem.subject}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Schedule */}
          {classItem.schedule && classItem.schedule !== "Schedule not set" && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="line-clamp-2">{classItem.schedule}</span>
            </div>
          )}

          {/* Room */}
          {classItem.room && classItem.room !== "Room not assigned" && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{classItem.room}</span>
            </div>
          )}

          {/* Student Count */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <span>
              {classItem.studentCount} {t("teacher.myClasses.students")}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Link to={`/teacher/classes/${classItem.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              {t("common.view")}
            </Button>
          </Link>

          <Link
            to={`/teacher/classes/${classItem.id}/attendance`}
            className="flex-1"
          >
            <Button size="sm" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              {t("teacher.myClasses.attendance")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function ClassesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-20 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-32 rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
