export const UserRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  SUPERVISOR: "SUPERVISOR",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
  CANTEEN_OPERATOR: "CANTEEN_OPERATOR",
  FINANCE_TEAM: "FINANCE_TEAM",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const RoleConfig = {
  OWNER: {
    translationKey: "roles.owner",
    dashboardPath: "/owner/dashboard",
    permissions: ["all"],
  },
  ADMIN: {
    translationKey: "roles.admin",
    dashboardPath: "/admin/dashboard",
    permissions: ["all"],
  },
  SUPERVISOR: {
    translationKey: "roles.supervisor",
    dashboardPath: "/supervisor/dashboard",
    permissions: ["view_reports", "manage_teachers", "view_students"],
  },
  TEACHER: {
    translationKey: "roles.teacher",
    dashboardPath: "/teacher/dashboard",
    permissions: ["manage_classes", "manage_attendance", "manage_grades"],
  },
  STUDENT: {
    translationKey: "roles.student",
    dashboardPath: "/student/dashboard",
    permissions: ["view_schedule", "submit_assignments", "view_grades"],
  },
  PARENT: {
    translationKey: "roles.parent",
    dashboardPath: "/parent/dashboard",
    permissions: ["view_child_progress", "view_attendance", "make_payments"],
  },
  CANTEEN_OPERATOR: {
    translationKey: "roles.canteenOperator",
    dashboardPath: "/canteen/dashboard",
    permissions: ["manage_menu", "manage_orders", "view_inventory"],
  },
  FINANCE_TEAM: {
    translationKey: "roles.financeTeam",
    dashboardPath: "/finance/dashboard",
    permissions: ["manage_fees", "view_payments", "financial_reports"],
  },
} as const;
