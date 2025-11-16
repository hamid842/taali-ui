import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import { UserRole } from "@/types/role";
import ClassDetail from "@/pages/teacher/classes/class-detail";
import Attendance from "@/pages/teacher/attendance";

const TeacherDashboard = lazy(() => import("@/pages/teacher/dashboard"));
const TeacherClasses = lazy(() => import("@/pages/teacher/classes"));
const TeacherStudents = lazy(() => import("@/pages/teacher/students"));
const TeacherAttendance = lazy(() => import("@/pages/teacher/attendance"));
const TeacherAssignments = lazy(() => import("@/pages/teacher/assignments"));
const TeacherGrades = lazy(() => import("@/pages/teacher/grades"));
const TeacherLessonPlans = lazy(() => import("@/pages/teacher/lesson-plans"));

export const teacherRoutes = {
  path: "/teacher",
  element: (
    <ProtectedRoute
      allowedRoles={[UserRole.SCHOOL_MANAGER, UserRole.OWNER, UserRole.TEACHER]}
    >
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <TeacherDashboard /> },
    { path: "dashboard", element: <TeacherDashboard /> },
    { path: "my-classes", element: <TeacherClasses /> },
    { path: "my-students", element: <TeacherStudents /> },
    { path: "attendance", element: <TeacherAttendance /> },
    { path: "assignments", element: <TeacherAssignments /> },
    { path: "grades", element: <TeacherGrades /> },
    { path: "lesson-plans", element: <TeacherLessonPlans /> },
    { path: "classes/:classId", element: <ClassDetail /> },
    { path: "classes/:classId/attendance", element: <Attendance /> },
  ],
};
