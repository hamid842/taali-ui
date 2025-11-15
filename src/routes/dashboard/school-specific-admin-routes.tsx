import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import { UserRole } from "@/types/role";
import EditTeacher from "@/pages/admin/teachers/edit";
import AssignClassesToTeacher from "@/pages/admin/teachers/assign-class";

const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/users/list"));
const CreateAdminUser = lazy(() => import("@/pages/admin/users/create"));
const Teachers = lazy(() => import("@/pages/admin/teachers/list"));
const CreateTeacher = lazy(() => import("@/pages/admin/teachers/create"));
const Classes = lazy(() => import("@/pages/admin/classes/classes"));
const CreateClass = lazy(() => import("@/pages/admin/classes/create-class"));
const ClassSchedule = lazy(
  () => import("@/pages/admin/classes/class-schedule")
);
const Students = lazy(() => import("@/pages/admin/students/list"));
const CreateStudent = lazy(() => import("@/pages/admin/students/create"));
const Parents = lazy(() => import("@/pages/admin/parents/parents"));
const CreateParent = lazy(() => import("@/pages/admin/parents/create-parent"));
const Tuition = lazy(() => import("@/pages/admin/finance/tuition"));
const Invoice = lazy(() => import("@/pages/admin/finance/invoice"));
const Reports = lazy(() => import("@/pages/admin/finance/reports"));

export const schoolAdminRoutes = {
  path: "/school/:schoolId/admin",
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
