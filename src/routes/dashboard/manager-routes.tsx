import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import { UserRole } from "@/types/role";

import AdminDashboard from "@/pages/manager/dashboard";
import AdminUsers from "@/pages/manager/users/list";
import CreateAdminUser from "@/pages/manager/users/create";
import Teachers from "@/pages/manager/teachers/list";
import CreateTeacher from "@/pages/manager/teachers/create";
import Classes from "@/pages/manager/classes/classes";
import CreateClass from "@/pages/manager/classes/create-class";
import ClassSchedule from "@/pages/manager/classes/class-schedule";
import Students from "@/pages/manager/students/list";
import CreateStudent from "@/pages/manager/students/create";
import Parents from "@/pages/manager/parents/parents";
import CreateParent from "@/pages/manager/parents/create-parent";
import Tuition from "@/pages/manager/finance/tuition";
import Invoice from "@/pages/manager/finance/invoice";
import Reports from "@/pages/manager/finance/reports";
import EditTeacher from "@/pages/manager/teachers/edit";
import AssignClassesToTeacher from "@/pages/manager/teachers/assign-class";
import SchoolProfile from "@/pages/owner/schools/school-profile";
import TimestampManagement from "@/pages/manager/school-settings/timestamp";

export const managerRoutes = {
  path: "/manager",
  element: (
    <ProtectedRoute allowedRoles={[UserRole.SCHOOL_MANAGER, UserRole.OWNER]}>
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
    { path: "school-settings/profile", element: <SchoolProfile /> },
    { path: "school-settings/timestamp", element: <TimestampManagement /> },
    { path: "finance/tuition", element: <Tuition /> },
    { path: "finance/invoice", element: <Invoice /> },
    { path: "finance/reports", element: <Reports /> },
  ],
};
