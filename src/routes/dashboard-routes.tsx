import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import AdminDashboard from "@/pages/admin/dashboard";
import OwnerDashboard from "@/pages/owner/dashboard";
import Schools from "@/pages/owner/schools/list";
import AddSchool from "@/pages/owner/schools/create/add-school";
import Users from "@/pages/owner/users/list";
import AddSchoolAdmin from "@/pages/owner/users/create/add-school-admin";
import { UserRole } from "@/types/role";
import AdminUsers from "@/pages/admin/users/list";
import CreateAdminUser from "@/pages/admin/users/create";
import CreateTeacher from "@/pages/admin/teachers/create-teacher";
import Classes from "@/pages/admin/classes/classes";
import CreateClass from "@/pages/admin/classes/create-class";
import Students from "@/pages/admin/students/students";
import CreateStudent from "@/pages/admin/students/create-student";
import Parents from "@/pages/admin/parents/parents";
import CreateParent from "@/pages/admin/parents/create-parent";
import Tuition from "@/pages/admin/finance/tuition";
import Invoice from "@/pages/admin/finance/invoice";
import Reports from "@/pages/admin/finance/reports";
import ClassSchedule from "@/pages/admin/classes/class-schedule";
import Teachers from "@/pages/admin/teachers/teachers";

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
      {
        path: "/admin/users",
        element: <AdminUsers />,
      },
      {
        path: "/admin/users/create",
        element: <CreateAdminUser />,
      },
      {
        path: "/admin/teachers",
        element: <Teachers />,
      },
      {
        path: "/admin/teachers/create",
        element: <CreateTeacher />,
      },
      {
        path: "/admin/classes",
        element: <Classes />,
      },
      {
        path: "/admin/classes/create",
        element: <CreateClass />,
      },
      {
        path: "/admin/classes/:classId/schedule",
        element: <ClassSchedule />,
      },
      {
        path: "/admin/students",
        element: <Students />,
      },
      {
        path: "/admin/students/create",
        element: <CreateStudent />,
      },
      {
        path: "/admin/parents",
        element: <Parents />,
      },
      {
        path: "/admin/parents/create",
        element: <CreateParent />,
      },
      {
        path: "/admin/finance/tuition",
        element: <Tuition />,
      },
      {
        path: "/admin/finance/invoice",
        element: <Invoice />,
      },
      {
        path: "/admin/finance/reports",
        element: <Reports />,
      },
    ],
  },
];
