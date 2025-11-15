import { adminRoutes } from "./admin-routes";
import { ownerRoutes } from "./owner-routes";
import { schoolAdminRoutes } from "./school-specific-admin-routes";
import { teacherRoutes } from "./teacher-routes";

export const dashboardRoutes = [
  ownerRoutes,
  schoolAdminRoutes,
  adminRoutes,
  teacherRoutes,
];
