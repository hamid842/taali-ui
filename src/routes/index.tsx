import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth-routes";
import { publicRoutes } from "./public-routes";
import Unauthorized from "@/pages/unauthorized";
import NotFound from "@/pages/not-found";
import { dashboardRoutes } from "./dashboard";

export const router = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...dashboardRoutes,
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
