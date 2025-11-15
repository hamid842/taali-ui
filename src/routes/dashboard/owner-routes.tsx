import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import { UserRole } from "@/types/role";

const OwnerDashboard = lazy(() => import("@/pages/owner/dashboard"));
const OwnerSchools = lazy(() => import("@/pages/owner/schools"));
const AddSchool = lazy(() => import("@/pages/owner/schools/add-school"));
const Users = lazy(() => import("@/pages/owner/users"));
const AddSchoolAdmin = lazy(
  () => import("@/pages/owner/users/add-school-admin")
);

export const ownerRoutes = {
  path: "/owner",
  element: (
    <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <OwnerDashboard /> },
    { path: "dashboard", element: <OwnerDashboard /> },
    { path: "schools", element: <OwnerSchools /> },
    { path: "schools/create", element: <AddSchool /> },
    { path: "users", element: <Users /> },
    { path: "users/create", element: <AddSchoolAdmin /> },
  ],
};
