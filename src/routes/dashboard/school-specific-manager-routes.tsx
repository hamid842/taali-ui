import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import { UserRole } from "@/types/role";
import EditTeacher from "@/pages/manager/teachers/edit";
import AssignClassesToTeacher from "@/pages/manager/teachers/assign-class";
import SchoolProfile from "@/pages/owner/schools/school-profile";
import TimestampManagement from "@/pages/manager/school-settings/timestamp";
import LessonsCreate from "@/pages/manager/lessons/create";
import Lessons from "@/pages/manager/lessons/list";

const AdminDashboard = lazy(() => import("@/pages/manager/dashboard"));
const AdminUsers = lazy(() => import("@/pages/manager/users/list"));
const CreateAdminUser = lazy(() => import("@/pages/manager/users/create"));
const Teachers = lazy(() => import("@/pages/manager/teachers/list"));
const CreateTeacher = lazy(() => import("@/pages/manager/teachers/create"));
const Classes = lazy(() => import("@/pages/manager/classes/classes"));
const CreateClass = lazy(() => import("@/pages/manager/classes/create-class"));
const ClassSchedule = lazy(
  () => import("@/pages/manager/classes/class-schedule")
);
const Students = lazy(() => import("@/pages/manager/students/list"));
const CreateStudent = lazy(() => import("@/pages/manager/students/create"));
const Parents = lazy(() => import("@/pages/manager/parents/parents"));
const CreateParent = lazy(
  () => import("@/pages/manager/parents/create-parent")
);
const Tuition = lazy(() => import("@/pages/manager/finance/tuition"));
const Invoice = lazy(() => import("@/pages/manager/finance/invoice"));
const Reports = lazy(() => import("@/pages/manager/finance/reports"));

export const schoolManagerRoutes = {
  path: "/school/:schoolId/manager",
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
    { path: "lessons/create", element: <LessonsCreate /> },
    { path: "lessons", element: <Lessons /> },
  ],
};
