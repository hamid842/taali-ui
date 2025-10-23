import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  showText?: boolean;
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
  showText = true,
}: LoadingSpinnerProps) {
  const { t, language } = useLanguage();
  const displayText = text || t("common.loading") || "Loading...";

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      dir={language === "fa" ? "rtl" : "ltr"}
    >
      {/* Modern SVG Spinner */}
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
            sizeClasses[size],
            "text-primary"
          )}
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">{displayText}</span>
        </div>

        {/* Optional: Pulsing dot in the center */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "rounded-full bg-primary animate-pulse",
            {
              "h-1 w-1": size === "sm",
              "h-1.5 w-1.5": size === "md",
              "h-2 w-2": size === "lg",
              "h-2.5 w-2.5": size === "xl",
            }
          )}
        />
      </div>

      {showText && (
        <p
          className={cn(
            "text-muted-foreground font-medium animate-pulse",
            textSizes[size]
          )}
        >
          {displayText}
        </p>
      )}
    </div>
  );
}

// Full page loading spinner
export function FullPageSpinner({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border">
        <LoadingSpinner size="lg" text={text} showText={true} />
      </div>
    </div>
  );
}

// Inline loading spinner for buttons and small spaces
export function InlineSpinner({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <div className="inline-flex items-center">
      <LoadingSpinner size={size} showText={false} />
    </div>
  );
}
