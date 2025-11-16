import { ImageDisplay } from "@/components/common/image-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { formatGregorian, formatJalali } from "@/lib/utils/date-utils";
import { useAppStore } from "@/stores/app-store";
import type { ISchool } from "@/types/school";
import {
  BookOpen,
  Building,
  Edit,
  Eye,
  MoreHorizontal,
  Settings,
  Trash2,
  Users,
  Utensils,
} from "lucide-react";

interface SchoolCardProps {
  school: ISchool;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function SchoolCard({
  school,
  onView,
  onEdit,
}: SchoolCardProps) {
  const { t, dir, language } = useLanguage();
  const { setCurrentSchool } = useAppStore();

  const formatSinceDate = (date: string | Date) => {
    if (language === "fa") {
      // For Farsi, use Jalali calendar with year only
      return formatJalali(date, "YYYY");
    } else {
      // For English and other languages, use Gregorian calendar with year only
      return formatGregorian(date, "YYYY");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "setup":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "default";
    }
  };

  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return t("owner.schoolsPage.status.active");
      case "SETUP":
        return t("owner.schoolsPage.status.setup");
      case "ARCHIVED":
        return t("owner.schoolsPage.status.archived");
      default:
        return status;
    }
  };

  // Mock data for features - replace with actual data from your API
  const features = [
    {
      icon: Users,
      label: t("owner.schoolsPage.features.teachers"),
      value: school.teacherCount || 0,
    },
    {
      icon: BookOpen,
      label: t("owner.schoolsPage.features.classes"),
      value: school.classCount || 0,
    },
    {
      icon: Users,
      label: t("owner.schoolsPage.features.students"),
      value: school.studentCount || 0,
    },
    {
      icon: Utensils,
      label: t("owner.schoolsPage.features.canteen"),
      value: school.canteenCount || 0,
    },
  ];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {school.image ? (
                <div className="w-12 h-12 rounded-lg border overflow-hidden">
                  <ImageDisplay
                    imageUrl={school.image}
                    alt={school.name}
                    size="xs"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold truncate">
                {school.name}
              </CardTitle>
              <CardDescription className="truncate">
                {school.code}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu dir={dir}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
              <DropdownMenuItem onClick={() => onView(school.id)}>
                <Eye className="h-4 w-4 mr-2" />
                {t("owner.schoolsPage.actions.viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(school.id)}>
                <Edit className="h-4 w-4 mr-2" />
                {t("owner.schoolsPage.actions.editSchool")}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t("owner.schoolsPage.actions.deleteSchool")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Badge variant={getStatusVariant(school.status)}>
            {getTranslatedStatus(school.status)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {t("owner.schoolsPage.since")} {formatSinceDate(school.createdAt)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50"
            >
              <feature.icon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {feature.label}
                </p>
                <p className="text-sm font-semibold">{feature.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        {school.address && (
          <p className="text-xs text-muted-foreground truncate mb-3">
            {school.address}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setCurrentSchool(school);
              onView(school.id);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            {t("owner.schoolsPage.actions.dashboard")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(school.id)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
