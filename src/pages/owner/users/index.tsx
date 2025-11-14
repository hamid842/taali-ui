import { useState } from "react";
import { useUsers } from "@/hooks/use-users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { UserRole, type UserRoleType } from "@/types/role";
import type { IUser } from "@/types/user";
import EmptyData from "@/components/common/empty-data";
import UsersListSkeleton from "@/components/skeleton/owner/users/users-list-skeleton";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/app-store";
import NoSchoolContent from "@/components/dashboard/schools/no-school-content";
import DisplayError from "@/components/common/display-error";
import UserItem from "@/components/dashboard/users/user-item";

export default function Users() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { ownerHasSchool } = useAppStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRoleType>(UserRole.ADMIN);

  const size = 9;

  const { data, isLoading, isError, isFetching } = useUsers({
    page,
    size,
    search: search || undefined,
    role: role || undefined,
  });

  const handleClickAddAdmin = () => {
    navigate("/owner/users/create");
  };

  // Show warning if owner has no school
  if (!ownerHasSchool) {
    return <NoSchoolContent />;
  }

  if (isError) {
    return <DisplayError text={t("owner.users.errorLoading")} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("owner.users.title")}
          </h1>
          <p className="text-muted-foreground">{t("owner.users.subtitleAdmins")}</p>
        </div>
        <Button onClick={handleClickAddAdmin}>
          <UserPlus className="w-4 h-4 mr-2" />
          {t("owner.users.addAdmin")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("owner.users.searchAdmins")}
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRoleType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("owner.users.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>
                  {t("roles.admin")}
                </SelectItem>
                <SelectItem value={UserRole.SUPERVISOR}>
                  {t("roles.supervisor")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{t("owner.users.adminList")}</h2>
            <p className="text-sm text-muted-foreground">
              {data?.pagination.totalElements || 0} {t("owner.users.adminsFound")}
              {isFetching && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {t("owner.users.updating")}
                </span>
              )}
            </p>
          </div>
        </div>

        {isLoading && !data ? (
          <UsersListSkeleton />
        ) : data?.items.length === 0 ? (
          <EmptyData
            title={t("owner.users.noAdminsFound")}
            desc={
              search || role !== UserRole.ADMIN
                ? t("owner.users.tryChangingFilters")
                : t("owner.users.getStartedByAdding")
            }
            actions={
              <Button onClick={handleClickAddAdmin}>
                <UserPlus className="w-4 h-4 mr-2" />
                {t("owner.users.addFirstAdmin")}
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.items.map((user: IUser) => (
              <UserItem key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-muted-foreground">
              {t("owner.users.showing")} {(page - 1) * size + 1}-
              {Math.min(page * size, data.pagination.totalElements)}{" "}
              {t("owner.users.of")} {data.pagination.totalElements}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || isLoading}
              >
                {t("owner.users.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.totalPages || isLoading}
              >
                {t("owner.users.next")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
