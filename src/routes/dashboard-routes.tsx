import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import AdminDashboard from "@/pages/admin/dashboard";
import OwnerDashboard from "@/pages/owner/dashboard";
import Schools from "@/pages/owner/schools/list";
import AddSchool from "@/pages/owner/schools/create/add-school";
import Users from "@/pages/owner/users/list";
import AddSchoolAdmin from "@/pages/owner/users/add-user/add-school-admin";
import { UserRole } from "@/types/role";

export const dashboardRoutes = [
  // Owner Routes
  {
    path: "/owner",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OwnerDashboard />,
      },
      {
        path: "/owner/dashboard",
        element: <OwnerDashboard />,
      },
      {
        path: "/owner/schools",
        element: <Schools />,
      },
      {
        path: "/owner/schools/create",
        element: <AddSchool />,
      },
      {
        path: "/owner/users/create",
        element: <AddSchoolAdmin />,
      },
      {
        path: "/owner/users",
        element: <Users />,
      },
    ],
  },
  // Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      // You can add more admin routes here later
      // { path: "users", element: <AdminUsers /> },
      // { path: "settings", element: <AdminSettings /> },
    ],
  },
];
