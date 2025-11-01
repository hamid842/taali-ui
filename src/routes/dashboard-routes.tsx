import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import AdminDashboard from "@/pages/admin/dashboard";
import OwnerDashboard from "@/pages/owner/dashboard";
import Schools from "@/pages/owner/schools";
import AddSchool from "@/pages/owner/schools/add-school";
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
        path: "/owner/add-school",
        element: <AddSchool />,
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
