import { ImageDisplay } from "@/components/common/image-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import type { Student } from "@/types/student";
import { BookOpen, Calendar, Mail, Phone, User } from "lucide-react";
import AssignClassModal from "../manager/assign-to-class-dialog";
import { useState } from "react";

type StudentItemProps = {
  student: Student;
};

export default function StudentItem({ student }: StudentItemProps) {
  const { t } = useLanguage();
  const [openClassModal, setOpenClassModal] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <Card
      key={student.id}
      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant={student.isActive ? "default" : "secondary"}
            className={
              student.isActive
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {student.isActive ? t("common.active") : t("common.inactive")}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {student.studentId}
          </Badge>
        </div>

        <div className="flex items-center space-x-3 mb-3">
          <ImageDisplay
            imageUrl={student.profileImageUrl}
            alt={`${student.userFirstName} ${student.userLastName}`}
            fallbackText={getInitials(
              student.userFirstName!,
              student.userLastName!
            )}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {student.userFirstName} {student.userLastName}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Mail className="h-3 w-3 mr-1" />
              <span className="truncate">{student.userEmail}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {student.gradeLevel && (
            <div className="flex gap-1 items-center text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{student.gradeLevel}</span>
              {student.className && (
                <span className="ml-2">• {student.className}</span>
              )}
            </div>
          )}

          {student.birthDate && (
            <div className="flex gap-1 items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span>
                {formatBirthDate(student.birthDate.toString())}
                {calculateAge(student.birthDate.toString()) && (
                  <span className="ml-1">
                    ({calculateAge(student.birthDate.toString())}{" "}
                    {t("students.yearsOld")})
                  </span>
                )}
              </span>
            </div>
          )}

          {student.emergencyContact && (
            <div className="flex items-center text-sm gap-1 text-muted-foreground">
              <User className="h-4 w-4 mr-2 text-orange-500" />
              <span className="truncate">{student.emergencyContact}</span>
            </div>
          )}

          {student.emergencyPhone && (
            <div className="flex items-center text-sm gap-1 text-muted-foreground">
              <Phone className="h-4 w-4 mr-2 text-green-500" />
              <span>{student.emergencyPhone}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            {t("common.view")}
          </Button>
          <Button size="sm" className="flex-1">
            {t("common.edit")}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => setOpenClassModal(true)}
          >
            {student.classId
              ? t("common.changeClass")
              : t("common.assignClass")}
          </Button>
        </div>
      </CardContent>
      <AssignClassModal
        student={student}
        isOpen={openClassModal}
        onClose={() => setOpenClassModal(false)}
        onSuccess={() => console.log}
      />
    </Card>
  );
}
