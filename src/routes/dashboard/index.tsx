// Automatically loads all *.routes.ts files in this folder
import type { RouteObject } from "react-router-dom";
import RouteLoader from "../route-loader";

/**
 * Wrap an element in <RouteLoader> ONLY if it exists.
 */
function wrapElement(route: RouteObject): RouteObject {
  const wrapped: RouteObject = {
    ...route,
    element: route.element ? (
      <RouteLoader>{route.element}</RouteLoader>
    ) : undefined,
  };

  // Only add children if they originally exist
  if (route.children) {
    wrapped.children = route.children.map((child) => ({
      ...child,
      element: child.element ? (
        <RouteLoader>{child.element}</RouteLoader>
      ) : undefined,
    }));
  }

  return wrapped;
}

// Auto import all dashboard route groups
const modules = import.meta.glob("./*-routes.tsx", {
  eager: true,
}) as Record<string, Record<string, RouteObject>>;

/**
 * Flatten modules and wrap each route safely.
 */
export const dashboardRoutes: RouteObject[] = Object.values(modules)
  .flatMap((mod) => Object.values(mod))
  .map((route) => wrapElement(route));
