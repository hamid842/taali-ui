/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useStudentApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ParentAssociationRequest,
  StudentDetailsRequest,
  StudentListResponse,
} from "@/types/student";
import { studentApi } from "@/lib/api/student-api";
import type { ClassResponse } from "@/types/class";

// Query keys
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters: unknown) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: number) => [...studentKeys.details(), id] as const,
  byUser: (userId: number) =>
    [...studentKeys.details(), "user", userId] as const,
  byClass: (classId: number) =>
    [...studentKeys.lists(), "class", classId] as const,
  bySchool: (schoolId: number | undefined, filters?: unknown) =>
    [
      ...studentKeys.lists(),
      "school",
      schoolId,
      ...(filters ? [filters] : []),
    ] as const,
  gradeLevels: (schoolId: number | undefined) =>
    [...studentKeys.all, "grade-levels", schoolId] as const,
  classes: (schoolId: number | undefined) =>
    [...studentKeys.all, "classes", schoolId] as const,
};

export const useStudentApi = () => {
  const queryClient = useQueryClient();

  // 🔹 Get all students by school ID
  const useGetStudentsBySchool = (
    schoolId: number | undefined,
    params?: {
      page?: number;
      size?: number;
      search?: string;
      gradeLevel?: string;
      classId?: string;
    },
    options?: any
  ) => {
    return useQuery<StudentListResponse>({
      queryKey: studentKeys.bySchool(schoolId, params),
      queryFn: () => studentApi.getBySchool(schoolId!, params),
      enabled: !!schoolId,
      ...options,
    });
  };

  // 🔹 Get grade levels for filter dropdown
  const useGetGradeLevels = (schoolId: number | undefined, options?: any) => {
    return useQuery<string[]>({
      queryKey: studentKeys.gradeLevels(schoolId),
      queryFn: () => studentApi.getGradeLevels(schoolId!),
      enabled: !!schoolId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  // 🔹 Get classes for filter dropdown
  const useGetClasses = (schoolId: number | undefined, options?: any) => {
    return useQuery<ClassResponse[]>({
      queryKey: studentKeys.classes(schoolId!),
      queryFn: () => studentApi.getClasses(schoolId!),
      enabled: !!schoolId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  // 🔹 Get single student by ID
  const useGetStudentById = (id: number, options?: any) => {
    return useQuery({
      queryKey: studentKeys.detail(id),
      queryFn: () => studentApi.getById(id),
      enabled: !!id,
      ...options,
    });
  };

  // 🔹 Get students by class ID
  const useGetStudentsByClass = (classId: number, options?: any) => {
    return useQuery({
      queryKey: studentKeys.byClass(classId),
      queryFn: () => studentApi.getByClass(classId),
      enabled: !!classId,
      ...options,
    });
  };

  // 🔹 Get student by user ID
  const useGetStudentByUser = (userId: number, options?: any) => {
    return useQuery({
      queryKey: studentKeys.byUser(userId),
      queryFn: () => studentApi.getByUser(userId),
      enabled: !!userId,
      ...options,
    });
  };

  // 🔹 Update student details
  const useUpdateStudentDetails = () => {
    return useMutation({
      mutationFn: ({
        userId,
        details,
      }: {
        userId: number;
        details: StudentDetailsRequest;
      }) => studentApi.updateDetails(userId, details),
      onSuccess: (data, variables) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: studentKeys.detail(data.id!),
        });
        queryClient.invalidateQueries({
          queryKey: studentKeys.byUser(variables.userId),
        });
        queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      },
    });
  };

  // 🔹 Associate parents with student
  const useAssociateParents = () => {
    return useMutation({
      mutationFn: ({
        userId,
        parentData,
      }: {
        userId: number;
        parentData: ParentAssociationRequest;
      }) => studentApi.associateParents(userId, parentData),
      onSuccess: (data, variables) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: studentKeys.detail(data.id!),
        });
        queryClient.invalidateQueries({
          queryKey: studentKeys.byUser(variables.userId),
        });
      },
    });
  };

  // 🔹 Assign student to class
  const useAssignToClass = () => {
    return useMutation({
      mutationFn: ({
        studentId,
        classId,
      }: {
        studentId: number;
        classId: number;
      }) => studentApi.assignToClass(studentId, classId),
      onSuccess: (_, variables) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: studentKeys.detail(variables.studentId),
        });
        queryClient.invalidateQueries({
          queryKey: studentKeys.byClass(variables.classId),
        });
        queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      },
    });
  };

  // 🔹 Remove student from class
  const useRemoveFromClass = () => {
    return useMutation({
      mutationFn: (studentId: number) => studentApi.removeFromClass(studentId),
      onSuccess: (_, studentId) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: studentKeys.detail(studentId),
        });
        queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      },
    });
  };

  // 🔹 Bulk assign students to class
  const useBulkAssignStudents = () => {
    return useMutation({
      mutationFn: ({
        studentIds,
        classId,
      }: {
        studentIds: number[];
        classId: number;
      }) => studentApi.bulkAssignStudentsToClass(studentIds, classId),
      onSuccess: (_, variables) => {
        // Invalidate multiple queries
        variables.studentIds.forEach((studentId) => {
          queryClient.invalidateQueries({
            queryKey: studentKeys.detail(studentId),
          });
        });
        queryClient.invalidateQueries({
          queryKey: studentKeys.byClass(variables.classId),
        });
        queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      },
    });
  };

  // 🔹 Prefetch student data
  const prefetchStudent = (id: number) => {
    return queryClient.prefetchQuery({
      queryKey: studentKeys.detail(id),
      queryFn: () => studentApi.getById(id),
    });
  };

  // 🔹 Prefetch students by school
  const prefetchStudentsBySchool = (
    schoolId: number | undefined,
    params?:
      | {
          page?: number | undefined;
          size?: number | undefined;
          search?: string | undefined;
          gradeLevel?: string | undefined;
          classId?: string | undefined;
        }
      | undefined
  ) => {
    return queryClient.prefetchQuery({
      queryKey: studentKeys.bySchool(schoolId, params),
      queryFn: () => studentApi.getBySchool(schoolId!, params),
    });
  };

  return {
    // Queries
    useGetStudentsBySchool,
    useGetGradeLevels,
    useGetClasses,
    useGetStudentById,
    useGetStudentsByClass,
    useGetStudentByUser,

    // Mutations
    useUpdateStudentDetails,
    useAssociateParents,
    useAssignToClass,
    useRemoveFromClass,
    useBulkAssignStudents,

    // Prefetch
    prefetchStudent,
    prefetchStudentsBySchool,

    // Query keys (for external use)
    studentKeys,
  };
};
