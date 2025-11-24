import { managerRoutes } from "./manager-routes";
import { ownerRoutes } from "./owner-routes";
import { parentRoutes } from "./parent-routes";
import { schoolManagerRoutes } from "./school-specific-manager-routes";
import { sharedRoutes } from "./shared-routes";
import { teacherRoutes } from "./teacher-routes";

export const dashboardRoutes = [
  ownerRoutes,
  schoolManagerRoutes,
  managerRoutes,
  teacherRoutes,
  parentRoutes,
  sharedRoutes
];
