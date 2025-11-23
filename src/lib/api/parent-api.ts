import type {
  Child,
  ChildDetail,
  CreateParentRequest,
  DashboardStats,
  Parent,
} from "@/types/parent";
import { apiClient, apiConfig } from "./api-config";
import type { Student } from "@/types/student";

export const parentApi = {
  createParent: async (parentData: CreateParentRequest): Promise<Parent> => {
    return apiClient.post(apiConfig.endpoints.parents.create, parentData);
  },

  associateParentsWithStudent: async (
    studentId: number,
    parentIds: number[]
  ): Promise<Student> => {
    return apiClient.post(
      apiConfig.endpoints.parents.associateWithStudent(studentId),
      parentIds
    );
  },

  getParentsByStudent: async (studentId: number): Promise<Parent[]> => {
    return apiClient.get(apiConfig.endpoints.parents.getByStudent(studentId));
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiClient.get(apiConfig.endpoints.parents.dashboardStats);
  },

  getMyChildren: async (): Promise<Child[]> => {
    return apiClient.get(apiConfig.endpoints.parents.myChildren);
  },

  getChildDetail: async (childId: number): Promise<ChildDetail> => {
    return apiClient.get(apiConfig.endpoints.parents.childDetail(childId));
  },

  getChildrenAttendance: async () => {
    return apiClient.get(apiConfig.endpoints.parents.childrenAttendance);
  },

  getChildrenGrades: async () => {
    return apiClient.get(apiConfig.endpoints.parents.childrenGrades);
  },

  getChildAttendance: async (childId: number) => {
    return apiClient.get(apiConfig.endpoints.parents.childAttendance(childId));
  },

  getChildGrades: async (childId: number) => {
    return apiClient.get(apiConfig.endpoints.parents.childGrades(childId));
  },
};
