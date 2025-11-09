import type { User } from "./auth";

export interface Teacher {
  id: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  isActive: boolean;
  specializations: string[];
  qualification: string;
  experienceYears: string[];
  hireDate: string;
  classAssignments: string[];
  subjects: string[];
  phone: string;
  email: string;
  fullName: string;
}

export interface CreateTeacherRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subjects: string[];
  schoolId: string;
  qualifications?: string[];
  experience?: number;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  hireDate?: string;
  notes?: string;
}

export interface UpdateTeacherRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subjects?: string[];
  qualifications?: string[];
  experience?: number;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  notes?: string;
}
