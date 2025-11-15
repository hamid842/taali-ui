import { Suspense } from "react";
import GlobalSkeleton from "@/components/skeleton/global-skeleton";

export default function RouteLoader({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<GlobalSkeleton />}>{children}</Suspense>;
}
