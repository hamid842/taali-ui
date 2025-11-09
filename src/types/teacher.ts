export interface Teacher {
  id: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subjectSpecialization?: string;
  qualification?: string;
  schoolId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeacherRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subjectSpecialization?: string;
  qualification?: string;
  schoolId: number;
  userId?: number;
}

export interface UpdateTeacherRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subjectSpecialization?: string;
  qualification?: string;
}
