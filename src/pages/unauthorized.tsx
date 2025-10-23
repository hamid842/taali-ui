import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Home, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function Unauthorized() {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const isRTL = language === "fa";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Shield className="h-10 w-10 text-red-600" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {t("unauthorized.title") || "Access Denied"}
            </h1>
            <p className="text-muted-foreground">
              {t("unauthorized.message") ||
                "You don't have permission to access this page. Please contact your administrator if you believe this is an error."}
            </p>
            {user && (
              <p className="text-sm text-muted-foreground">
                {t("unauthorized.loggedInAs") || "Logged in as:"} {user.role}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                {t("unauthorized.goHome") || "Go Home"}
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={logout}
            >
              <LogIn className="h-4 w-4" />
              {t("unauthorized.signInDifferent") ||
                "Sign In with Different Account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
