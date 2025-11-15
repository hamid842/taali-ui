import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import { UserRole } from "@/types/role";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users/list";
import CreateAdminUser from "@/pages/admin/users/create";
import Teachers from "@/pages/admin/teachers/list";
import CreateTeacher from "@/pages/admin/teachers/create";
import Classes from "@/pages/admin/classes/classes";
import CreateClass from "@/pages/admin/classes/create-class";
import ClassSchedule from "@/pages/admin/classes/class-schedule";
import Students from "@/pages/admin/students/list";
import CreateStudent from "@/pages/admin/students/create";
import Parents from "@/pages/admin/parents/parents";
import CreateParent from "@/pages/admin/parents/create-parent";
import Tuition from "@/pages/admin/finance/tuition";
import Invoice from "@/pages/admin/finance/invoice";
import Reports from "@/pages/admin/finance/reports";
import EditTeacher from "@/pages/admin/teachers/edit";
import AssignClassesToTeacher from "@/pages/admin/teachers/assign-class";

export const adminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.OWNER]}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "users", element: <AdminUsers /> },
    { path: "users/create", element: <CreateAdminUser /> },
    { path: "teachers", element: <Teachers /> },
    { path: "teachers/create", element: <CreateTeacher /> },
    { path: "teachers/edit/:teacherId", element: <EditTeacher /> },
    {
      path: "teachers/assign-classes/:teacherId",
      element: <AssignClassesToTeacher />,
    },
    { path: "classes", element: <Classes /> },
    { path: "classes/create", element: <CreateClass /> },
    { path: "classes/:classId/schedule", element: <ClassSchedule /> },
    { path: "students", element: <Students /> },
    { path: "students/create", element: <CreateStudent /> },
    { path: "parents", element: <Parents /> },
    { path: "parents/create", element: <CreateParent /> },
    { path: "finance/tuition", element: <Tuition /> },
    { path: "finance/invoice", element: <Invoice /> },
    { path: "finance/reports", element: <Reports /> },
  ],
};
