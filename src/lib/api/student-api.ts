import type { Student, StudentListResponse } from "@/types/student";
import type {
  ParentAssociationRequest,
  StudentDetailsRequest,
} from "@/types/student";
import { apiClient, apiConfig } from "./api-config";
import type { ClassResponse } from "@/types/class";
import type { ApiResponse } from "@/types/api-response";
import type { Teacher } from "@/types/teacher";

export const studentApi = {
  /** 🔹 Get all students by school ID */
  getBySchool: async (
    schoolId: number,
    params?: {
      page?: number;
      size?: number;
      search?: string;
      gradeLevel?: string;
      classId?: string;
    }
  ): Promise<StudentListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.size) queryParams.append("size", params.size.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.gradeLevel)
      queryParams.append("gradeLevel", params.gradeLevel.toString());
    if (params?.classId)
      queryParams.append("classId", params.classId.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${apiConfig.endpoints.students.getBySchool(schoolId)}?${queryString}`
      : apiConfig.endpoints.students.getBySchool(schoolId);

    return apiClient.get<StudentListResponse>(url);
  },

  /** 🔹 Get grade levels for filter dropdown */
  getGradeLevels: async (schoolId: number) => {
    return apiClient.get<string[]>(
      apiConfig.endpoints.students.getGradeLevels(schoolId)
    );
  },

  /** 🔹 Get classes for filter dropdown */
  getClasses: async (schoolId: number): Promise<ClassResponse[]> => {
    return apiClient.get<ClassResponse[]>(
      apiConfig.endpoints.students.getClasses(schoolId)
    );
  },

  /** 🔹 Get teachers for a specific student*/
  getStudentTeachers: async (
    studentId: number
  ): Promise<ApiResponse<Teacher[]>> => {
    const response = await apiClient.get<ApiResponse<Teacher[]>>(
      apiConfig.endpoints.students.getTeachers(studentId)
    );
    return response;
  },

  /** 🔹 Get single student by ID */
  getById: async (id: number): Promise<Student> => {
    return apiClient.get<Student>(apiConfig.endpoints.students.getById(id));
  },

  /** 🔹 Get students by class ID */
  getByClass: async (classId: number): Promise<Student[]> => {
    return apiClient.get<Student[]>(
      apiConfig.endpoints.students.getByClass(classId)
    );
  },

  /** 🔹 Get student by user ID */
  getByUser: async (userId: number): Promise<Student> => {
    return apiClient.get<Student>(
      apiConfig.endpoints.students.getByUser(userId)
    );
  },

  /** 🔹 Update student details (Step 2 in your flow) */
  updateDetails: async (
    userId: number,
    details: StudentDetailsRequest
  ): Promise<Student> => {
    return apiClient.put<Student>(
      apiConfig.endpoints.students.updateDetailsByUser(userId),
      details
    );
  },

  /** 🔹 Associate parents with student (Step 3 in your flow) */
  associateParents: async (
    userId: number,
    parentData: ParentAssociationRequest
  ): Promise<Student> => {
    return apiClient.post<Student>(
      apiConfig.endpoints.students.associateParents(userId),
      parentData
    );
  },

  assignToClass: async (studentId: number, classId: number): Promise<void> => {
    return apiClient.post(apiConfig.endpoints.students.assignClass(studentId), {
      classId,
    });
  },

  removeFromClass: async (studentId: number): Promise<void> => {
    return apiClient.delete(
      apiConfig.endpoints.students.removeFromClass(studentId)
    );
  },

  bulkAssignStudentsToClass: async (
    studentIds: number[],
    classId: number
  ): Promise<void> => {
    return apiClient.post(apiConfig.endpoints.students.bulkAssign, {
      studentIds,
      classId,
    });
  },
};
