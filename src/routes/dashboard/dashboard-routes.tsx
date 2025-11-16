import { managerRoutes } from "./manager-routes";
import { ownerRoutes } from "./owner-routes";
import { schoolManagerRoutes } from "./school-specific-manager-routes";
import { teacherRoutes } from "./teacher-routes";

export const dashboardRoutes = [
  ownerRoutes,
  schoolManagerRoutes,
  managerRoutes,
  teacherRoutes,
];
