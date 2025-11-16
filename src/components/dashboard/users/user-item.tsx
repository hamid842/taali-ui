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
import { useUpdateUserStatus } from "@/hooks/use-users";
import { UserRole, type UserRoleType } from "@/types/role";
import type { IUser } from "@/types/user";
import { Building, Mail, MoreHorizontal, Phone, User } from "lucide-react";

type UserItemProps = {
  user: IUser;
};

export default function UserItem({ user }: UserItemProps) {
  const { t } = useLanguage();

  const updateStatusMutation = useUpdateUserStatus();

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateStatusMutation.mutateAsync({
        userId,
        isActive: !currentStatus,
      });
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const getRoleBadgeVariant = (userRole: UserRoleType) => {
    switch (userRole) {
      case UserRole.OWNER:
        return "destructive";
      case UserRole.SCHOOL_MANAGER:
        return "default";
      case UserRole.SCHOOL_ADMIN:
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {user.profileImage ? (
                <ImageDisplay size="sm" imageUrl={user.profileImage} />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {t(`roles.${user.role.toLowerCase()}`)}
                </Badge>
                <Badge variant={getStatusVariant(user.isActive)}>
                  {user.isActive ? t("owner.users.active") : t("owner.users.inactive")}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("owner.users.viewDetails")}</DropdownMenuItem>
              <DropdownMenuItem>{t("owner.users.editProfile")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Email */}
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>

        {/* School */}
        <div className="flex items-center gap-2 text-sm">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className={!user.school ? "text-muted-foreground italic" : ""}>
            {user.school?.name || t("owner.users.noSchoolAssigned")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={user.isActive ? "outline" : "default"}
            size="sm"
            className="flex-1"
            onClick={() => handleStatusToggle(user.userId, user.isActive)}
            disabled={updateStatusMutation.isPending}
          >
            {user.isActive ? t("owner.users.deactivate") : t("owner.users.activate")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
