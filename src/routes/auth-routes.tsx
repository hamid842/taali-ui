import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import RootLayout from "@/components/layout/root-layout";
import ErrorPage from "@/components/error-boundary/error-page";

// Lazy-loaded components
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));

export const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RegisterPage />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
];
