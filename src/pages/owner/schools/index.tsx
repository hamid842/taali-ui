import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useSchools } from "@/hooks/use-schools";
import { Button } from "@/components/ui/button";
import { Building, Plus, Users, Settings } from "lucide-react";
import EmptyData from "@/components/common/empty-data";
import SchoolsGridSkeleton from "@/components/skeleton/owner/schools/school-grid-skeleton";
import SchoolCard from "@/components/dashboard/schools/school-item-card";
import StatCard from "@/components/dashboard/schools/school-stat";
import SchoolFilter from "@/components/dashboard/schools/school-filter";

export default function OwnerSchools() {
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
          title={t("owner.schoolsPage.errorTitle") || "Failed to load schools"}
          desc={t("owner.schoolsPage.errorDescription") || "Please try again later"}
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
            {t("owner.schoolsPage.title") || "My Schools"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("owner.schoolsPage.subtitle") ||
              "Manage all your educational institutions"}
          </p>
        </div>
        <Button onClick={handleCreateSchool} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("owner.addSchool.create")}
        </Button>
      </div>

      {/* Stats Overview */}
      {!isLoading && schools && schools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title={t("owner.schoolsPage.stats.total")}
            value={schools.length}
            icon={Building}
            description={t("owner.schoolsPage.descriptions.total")}
          />
          <StatCard
            title={t("owner.schoolsPage.stats.active")}
            value={schools.filter((s) => s.status === "active").length}
            icon={Users}
            description={t("owner.schoolsPage.descriptions.active")}
          />
          <StatCard
            title={t("owner.schoolsPage.stats.setup")}
            value={schools.filter((s) => s.status === "setup").length}
            icon={Settings}
            description={t("owner.schoolsPage.descriptions.setup")}
          />
          <StatCard
            title={t("owner.schoolsPage.stats.archived")}
            value={schools.filter((s) => s.status === "archived").length}
            icon={Building}
            description={t("owner.schoolsPage.descriptions.archived")}
          />
        </div>
      )}

      {/* Search and Filters */}
      <SchoolFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

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
            title={t("owner.schoolsPage.emptyTitle") || "No schools found"}
            desc={
              searchTerm || statusFilter !== "all"
                ? t("owner.schoolsPage.filters.searchNoResults")
                : t("owner.schoolsPage.filters.emptyDescription")
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
