import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";
import type { TeacherClass } from "@/types/teacher-dashboard";

interface TeacherClassesListProps {
  classes: TeacherClass[];
  onClassClick?: (classId: number) => void;
}

export default function TeacherClassesList({
  classes,
  onClassClick,
}: TeacherClassesListProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t("teacher.dashboard.myClasses")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {classes.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            <p>{t("teacher.dashboard.noClasses")}</p>
          </div>
        ) : (
          classes.map((classItem) => (
            <div
              key={classItem.classId}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => onClassClick?.(classItem.classId)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">
                    {classItem.className}
                  </p>
                  {/* <Badge variant="secondary" className="text-xs">
                    {classItem.gradeLevel}
                  </Badge> */}
                </div>

                {/* <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {classItem.subject}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {classItem.room}
                  </span>
                </div> */}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {classItem.studentCount} {t("teacher.dashboard.students")}
                  </span>
                  {/* <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {classItem.schedule}
                  </span> */}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
