import { ProtectedRoute } from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import MessagesPage from "@/pages/messages";
import NewMessagePage from "@/pages/messages/new-message-page";
import { UserRole } from "@/types/role";
import type { RouteObject } from "react-router-dom";

export const sharedRoutes: RouteObject = {
  path: "/messages",
  element: (
    <ProtectedRoute
      allowedRoles={[
        UserRole.PARENT,
        UserRole.TEACHER,
        UserRole.SCHOOL_ADMIN,
        UserRole.STUDENT,
      ]}
    >
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <MessagesPage />,
    },
    {
      path: "new-message",
      element: <NewMessagePage />,
    },
  ],
};
