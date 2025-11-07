import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useSchools } from "@/hooks/use-schools";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  BookOpen,
  Utensils,
  Settings,
  Eye,
  Edit,
  Trash2,
  Filter,
} from "lucide-react";
import { ImageDisplay } from "@/components/common/image-display";
import EmptyData from "@/components/common/empty-data";
import type { ISchool } from "@/types/school";
import SchoolsGridSkeleton from "@/components/skeleton/owner/schools/school-grid-skeleton";

export default function SchoolsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: schools, isLoading, error } = useSchools();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter schools based on search and filter
  const filteredSchools = schools?.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "all" || school.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateSchool = () => {
    navigate("/owner/schools/create");
  };

  const handleViewSchool = (schoolId: number) => {
    navigate(`/owner/schools/${schoolId}`);
  };

  const handleEditSchool = (schoolId: number) => {
    navigate(`/owner/schools/${schoolId}/edit`);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <EmptyData
          title={t("schoolsPage.errorTitle") || "Failed to load schools"}
          desc={t("schoolsPage.errorDescription") || "Please try again later"}
          actions={
            <div>
              <Button>{t("")}</Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("schoolsPage.title") || "My Schools"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("schoolsPage.subtitle") ||
              "Manage all your educational institutions"}
          </p>
        </div>
        <Button onClick={handleCreateSchool} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addSchool.create") || "Create School"}
        </Button>
      </div>

      {/* Stats Overview */}
      {!isLoading && schools && schools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title={t("schoolsPage.stats.total")}
            value={schools.length}
            icon={Building}
            description={t("schoolsPage.descriptions.total")}
          />
          <StatCard
            title={t("schoolsPage.stats.active")}
            value={schools.filter((s) => s.status === "active").length}
            icon={Users}
            description={t("schoolsPage.descriptions.active")}
          />
          <StatCard
            title={t("schoolsPage.stats.setup")}
            value={schools.filter((s) => s.status === "setup").length}
            icon={Settings}
            description={t("schoolsPage.descriptions.setup")}
          />
          <StatCard
            title={t("schoolsPage.stats.archived")}
            value={schools.filter((s) => s.status === "archived").length}
            icon={Building}
            description={t("schoolsPage.descriptions.archived")}
          />
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={
                  t("schoolsPage.searchPlaceholder") ||
                  "Search schools by name or code..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter === "all" ? "All Status" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("setup")}>
                  In Setup
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Schools Grid */}
      <div>
        {isLoading ? (
          <SchoolsGridSkeleton />
        ) : filteredSchools && filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onView={handleViewSchool}
                onEdit={handleEditSchool}
              />
            ))}
          </div>
        ) : (
          <EmptyData
            title={t("schoolsPage.emptyTitle") || "No schools found"}
            desc={
              searchTerm || statusFilter !== "all"
                ? t("schoolsPage.filters.searchNoResults")
                : t("schoolsPage.filters.emptyDescription")
            }
            actions={
              <Button onClick={handleCreateSchool} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("addSchool.create") || "Create School"}
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// School Card Component
interface SchoolCardProps {
  school: ISchool;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}

function SchoolCard({ school, onView, onEdit }: SchoolCardProps) {
  const { t } = useLanguage();
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

  // Mock data for features - replace with actual data from your API
  const features = [
    {
      icon: Users,
      label: t("schoolsPage.features.teachers"),
      value: school.teacherCount || 0,
    },
    {
      icon: BookOpen,
      label: t("schoolsPage.features.classes"),
      value: school.classCount || 0,
    },
    {
      icon: Users,
      label: t("schoolsPage.features.students"),
      value: school.studentCount || 0,
    },
    {
      icon: Utensils,
      label: t("schoolsPage.features.canteen"),
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(school.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(school.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit School
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete School
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Badge variant={getStatusVariant(school.status)}>
            {school.status?.charAt(0).toUpperCase() + school.status?.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Since {new Date(school.createdAt).getFullYear()}
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
            onClick={() => onView(school.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(school.id)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
