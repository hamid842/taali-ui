import { parentApi } from "@/lib/api/parent-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useParentDashboard = () => {
  const queryClient = useQueryClient();

  // Dashboard Stats
  const dashboardStatsQuery = useQuery({
    queryKey: ["parent", "dashboard", "stats"],
    queryFn: parentApi.getDashboardStats,
  });

  // My Children
  const myChildrenQuery = useQuery({
    queryKey: ["parent", "children"],
    queryFn: parentApi.getMyChildren,
  });

  // Child Detail
  const useChildDetail = (childId: number) => {
    return useQuery({
      queryKey: ["parent", "child", childId],
      queryFn: () => parentApi.getChildDetail(childId),
      enabled: !!childId,
    });
  };

  // Children Attendance
  const childrenAttendanceQuery = useQuery({
    queryKey: ["parent", "children", "attendance"],
    queryFn: parentApi.getChildrenAttendance,
  });

  // Children Grades
  const childrenGradesQuery = useQuery({
    queryKey: ["parent", "children", "grades"],
    queryFn: parentApi.getChildrenGrades,
  });

  // Refresh all data
  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["parent"] });
  };

  return {
    dashboardStats: dashboardStatsQuery,
    myChildren: myChildrenQuery,
    useChildDetail,
    childrenAttendance: childrenAttendanceQuery,
    childrenGrades: childrenGradesQuery,
    refreshAll,
    isLoading: dashboardStatsQuery.isLoading || myChildrenQuery.isLoading,
    error: dashboardStatsQuery.error || myChildrenQuery.error,
  };
};
