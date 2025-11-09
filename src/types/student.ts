export interface Student {
  id: number;
  userId?: number;
  firstName: string;
  lastName: string;
  studentCode?: string;
  idNumber?: string;
  birthDate?: string;
  gender?: string;
  schoolId?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
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
