import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { t, language } = useLanguage();
  const isRTL = language === "fa";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-primary/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-primary bg-white/80 dark:bg-gray-800/80 px-6 py-3 rounded-2xl shadow-lg border">
                {t("notFound.title") || "Page Not Found"}
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto relative">
              {/* Simple CSS illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-muted/70 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {t("notFound.oops") || "Oops! Page not found"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {t("notFound.message") ||
                "The page you're looking for doesn't exist or has been moved. Let's get you back on track."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                {t("notFound.goHome") || "Go Home"}
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to={isRTL ? "/contact" : "/contact"}>
                <Mail className="h-4 w-4" />
                {t("notFound.contactSupport") || "Contact Support"}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className={isRTL ? "rotate-180 h-4 w-4" : "h-4 w-4"} />
              {t("notFound.goBack") || "Go Back"}
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t("notFound.needHelp") || "Need help?"}{" "}
              <Link
                to="/help"
                className="text-primary hover:underline font-medium"
              >
                {t("notFound.visitHelpCenter") || "Visit our help center"}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Simple 404 component for nested routes
export function SimpleNotFound({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) {
  const { t, language } = useLanguage();

  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center"
      dir={language === "fa" ? "rtl" : "ltr"}
    >
      <div className="text-6xl font-bold text-muted-foreground/30 mb-4">
        404
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        {title || t("notFound.title") || "Page Not Found"}
      </h2>
      <p className="text-muted-foreground mb-6">
        {message ||
          t("notFound.message") ||
          "The requested page could not be found."}
      </p>
      <Button asChild>
        <Link to="/">{t("notFound.goHome") || "Go Home"}</Link>
      </Button>
    </div>
  );
}
