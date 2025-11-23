import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Bell,
  CreditCard,
  TrendingUp,
  ClipboardCheck,
  Award,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useParentDashboard } from "@/hooks/use-parent-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import type { Child } from "@/types/parent";
import ParentDashboardSkeleton from "@/components/skeleton/dashboard/parent-dashboard-skeleton";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { dashboardStats, myChildren, refreshAll, isLoading, error } =
    useParentDashboard();

  const navigateToChild = (childId: number) => {
    navigate(`/parent/child/${childId}`);
  };

  const navigateToScreen = (screen: string) => {
    navigate(`/parent/${screen}`);
  };

  if (isLoading) {
    return <ParentDashboardSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription className="flex items-center justify-between">
          <span>{t("parent.children.errorLoading")}</span>{" "}
          {/* Use translation */}
          <Button variant="outline" size="sm" onClick={refreshAll}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.retry")} {/* You might need to add this to common */}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const stats = dashboardStats.data;
  const children = myChildren.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("parent.dashboard.welcome", { name: user?.firstName })}{" "}
          {/* Add this translation */}
        </h1>
        <p className="text-muted-foreground">
          {t("parent.dashboard.subtitle")} {/* Add this translation */}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("parent.children.title")} // Use existing translation
          value={stats?.totalChildren || 0}
          icon={Users}
          color="blue"
          onClick={() => navigateToScreen("my-children")}
        />
        <StatCard
          title={t("parent.dashboard.alerts")} // Add this translation
          value={stats?.unreadNotifications || 0}
          icon={Bell}
          color="orange"
          onClick={() => navigateToScreen("notifications")}
        />
        <StatCard
          title={t("parent.children.attendance")} // Use existing translation
          value={`${stats?.overallAttendanceRate || 0}%`}
          icon={TrendingUp}
          color="green"
          onClick={() => navigateToScreen("children-attendance")}
        />
        <StatCard
          title={t("parent.dashboard.payments")} // Add this translation
          value={stats?.pendingPayments || 0}
          icon={CreditCard}
          color="red"
          onClick={() => navigateToScreen("payments")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Children Section */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              {t("parent.children.title")} {/* Use existing translation */}
            </CardTitle>
            {children.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToScreen("my-children")}
              >
                {t("common.viewAll")}{" "}
                {/* You might need to add this to common */}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {children.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <p className="font-medium">
                    {t("parent.children.noChildren")}
                  </p>{" "}
                  {/* Use existing translation */}
                  <p className="text-sm text-muted-foreground">
                    {t("parent.children.noChildrenDescription")}{" "}
                    {/* Use existing translation */}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {children.slice(0, 3).map((child) => (
                  <ChildCard
                    key={child.id}
                    child={child}
                    onClick={() => navigateToChild(child.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {t("parent.dashboard.quickActions")} {/* Add this translation */}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuickActionButton
              icon={ClipboardCheck}
              label={t("parent.children.attendance")} // Use existing translation
              description={t("parent.dashboard.attendanceDescription")} // Add this translation
              onClick={() => navigateToScreen("children-attendance")}
              color="blue"
            />
            <QuickActionButton
              icon={Award}
              label={t("parent.children.grades")} // Use existing translation
              description={t("parent.dashboard.gradesDescription")} // Add this translation
              onClick={() => navigateToScreen("children-grades")}
              color="yellow"
            />
            <QuickActionButton
              icon={CreditCard}
              label={t("parent.dashboard.payments")} // Add this translation
              description={t("parent.dashboard.paymentsDescription")} // Add this translation
              onClick={() => navigateToScreen("payments")}
              color="green"
            />
            <QuickActionButton
              icon={Bell}
              label={t("parent.dashboard.notifications")} // Add this translation
              description={t("parent.dashboard.notificationsDescription")} // Add this translation
              onClick={() => navigateToScreen("notifications")}
              color="purple"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: "blue" | "orange" | "green" | "red" | "purple" | "yellow";
  onClick?: () => void;
}

function StatCard({ title, value, icon: Icon, color, onClick }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    green: "bg-green-50 text-green-600 border-green-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        onClick ? "hover:scale-105" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{title}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Child Card Component
interface ChildCardProps {
  child: Child;
  onClick: () => void;
}

function ChildCard({ child, onClick }: ChildCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {child.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{child.name}</h3>
              <p className="text-sm text-muted-foreground">
                {child.grade} • {child.className}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              <ClipboardCheck className="h-3 w-3 mr-1" />
              {child.attendanceRate}%
            </div>
            {child.averageGrade && (
              <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                <Award className="h-3 w-3 mr-1" />
                {child.averageGrade}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  color: "blue" | "orange" | "green" | "red" | "purple" | "yellow";
}

function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  color,
}: QuickActionButtonProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    red: "bg-red-50 text-red-600 hover:bg-red-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    yellow: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
  };

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start p-4 h-auto ${colorClasses[color]}`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mr-3" />
      <div className="text-left">
        <div className="font-medium">{label}</div>
        <div className="text-sm opacity-70">{description}</div>
      </div>
    </Button>
  );
}
