import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

/**
 * Generic Shimmer Skeleton Block
 */
export function Skeleton({
  className,
  rounded = "rounded-xl",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/30 dark:bg-muted/20 relative overflow-hidden",
        rounded,
        className
      )}
    >
      {/* Shimmer highlight */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] 
      bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
    </div>
  );
}

/**
 * Full-page skeleton used while lazy routes load
 */
export default function GlobalSkeleton() {
  const { language } = useLanguage();

  return (
    <div
      className="p-6 flex flex-col gap-8"
      dir={language === "fa" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Main cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-6 rounded-2xl border bg-card shadow-sm space-y-4"
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        ))}
      </div>

      {/* Table placeholder */}
      <div className="rounded-2xl border bg-card shadow-sm p-6 space-y-4">
        <Skeleton className="h-6 w-48" />

        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
