export interface School {
  id: number;
  name: string;
  code: string;
  image?: string;
  address?: string;
  email?: string;
  phone?: string;
  status: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  teacherCount: number;
  classCount: number;
  studentCount: number;
  canteenCount: number;
}

export interface CreateSchoolRequest {
  name: string;
  code: string;
  image?: string | null | undefined;
  address?: string | null | undefined;
  email?: string | null | undefined;
  phone?: string | null | undefined;
}

export interface UpdateSchoolRequest {
  name?: string;
  code?: string;
  image?: string;
  address?: string;
  email?: string;
  phone?: string;
}
