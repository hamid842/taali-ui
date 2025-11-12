import type { Pagination } from "./pagination";
import type { Parent } from "./parent";

export interface Student {
  id?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  studentCode?: string;
  idNumber?: string;
  birthDate?: Date;
  gender?: string;
  schoolId?: number;
  studentId?: string;
  gradeLevel?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  parents?: Parent[];
  isActive: boolean;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  className?: string;
  profileImageUrl?: string;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  studentCode?: string;
  idNumber?: string;
  birthDate?: string;
  gender?: string;
  schoolId: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  userId?: number;
}

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  studentCode?: string;
  idNumber?: string;
  birthDate?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
}

export interface StudentDetailsRequest {
  studentId?: string;
  idNumber?: string;
  birthDate?: Date;
  gradeLevel?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
}

export interface ParentAssociationRequest {
  parentEmails: string[];
  newParents: Parent[];
}

export interface StudentListResponse {
  items: Student[];
  pagination: Pagination;
}
