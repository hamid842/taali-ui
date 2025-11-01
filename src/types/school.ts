export interface School {
  id: number;
  name: string;
  code: string;
  image?: string;
  address?: string;
  email?: string;
  phone?: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolRequest {
  name: string;
  code: string;
  image?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface UpdateSchoolRequest {
  name?: string;
  code?: string;
  image?: string;
  address?: string;
  email?: string;
  phone?: string;
}
