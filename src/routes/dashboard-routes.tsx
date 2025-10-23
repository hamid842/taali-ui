import { ProtectedRoute } from "@/components/auth/protected-route";
import AdminDashboard from "@/pages/admin/dashboard";
import { UserRole } from "@/types/role";

export const dashboardRoutes = [
  // Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <div>Admin Layout</div>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      // You can add more admin routes here later
      // { path: "users", element: <AdminUsers /> },
      // { path: "settings", element: <AdminSettings /> },
    ],
  },
];
