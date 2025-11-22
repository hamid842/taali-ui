import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import ParentDashboard from "@/pages/parent/dashboard";
import MyChildren from "@/pages/parent/my-children";
import { UserRole } from "@/types/role";

export const parentRoutes = {
  path: "/parent",
  element: (
    <ProtectedRoute allowedRoles={[UserRole.PARENT]}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <ParentDashboard /> },
    { path: "dashboard", element: <ParentDashboard /> },
    { path: "my-children", element: <MyChildren /> },
  ],
};
