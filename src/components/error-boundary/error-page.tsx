// components/error-boundary/ErrorPage.tsx
import { useRouteError } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage() {
  const error = useRouteError() as any;

  useEffect(() => {
    console.error("Router error:", error);
  }, [error]);

  const resetError = () => {
    window.location.reload();
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      dir="ltr"
      className="ltr-error-boundary min-h-screen bg-background flex items-center justify-center p-4"
      style={{ direction: "ltr" }}
    >
      <Card className="w-full max-w-2xl border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl text-left">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-left text-base">
            An unexpected error has occurred. Please try refreshing the page or
            contact support if the problem persists.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="destructive" className="text-left">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription className="mt-2">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {error.statusText || error.message}
              </code>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 justify-start">
            <Button onClick={resetError} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={goHome} className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>

          {import.meta.env.NODE_ENV === "development" && error.stack && (
            <details className="text-left mt-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground mb-2">
                Error Stack (Development)
              </summary>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-40 text-left">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
