import ErrorPage from "@/components/error-boundary/error-page";
import RootLayout from "@/components/layout/root-layout";
import LandingPage from "@/pages/landing-page";
import { Suspense } from "react";

export const publicRoutes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LandingPage />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
];
