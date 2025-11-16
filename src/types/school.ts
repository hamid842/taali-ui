export const SchoolStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING",
} as const;

export type SchoolStatusType = (typeof SchoolStatus)[keyof typeof SchoolStatus];

export const SchoolType = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
  INTERNATIONAL: "INTERNATIONAL",
  CHARTER: "CHARTER",
  RELIGIOUS: "RELIGIOUS",
  BOARDING: "BOARDING",
  ONLINE: "ONLINE",
} as const;

export type SchoolTypeType = (typeof SchoolType)[keyof typeof SchoolType];

export const ShiftType = {
  MORNING: "MORNING",
  AFTERNOON: "AFTERNOON",
  EVENING: "EVENING",
  DOUBLE_SHIFT: "DOUBLE_SHIFT",
  FLEXIBLE: "FLEXIBLE",
} as const;

export type ShiftTypeType = (typeof ShiftType)[keyof typeof ShiftType];

export const EducationalLevel = {
  KINDERGARTEN: "KINDERGARTEN",
  PRESCHOOL: "PRESCHOOL",
  PRIMARY: "PRIMARY",
  MIDDLE_SCHOOL: "MIDDLE_SCHOOL",
  HIGH_SCHOOL: "HIGH_SCHOOL",
  VOCATIONAL: "VOCATIONAL",
  UNDERGRADUATE: "UNDERGRADUATE",
  POSTGRADUATE: "POSTGRADUATE",
} as const;

export type EducationalLevelType =
  (typeof EducationalLevel)[keyof typeof EducationalLevel];

export interface ISchool {
  id: number;
  name: string;
  code: string;
  type?: string;
  image?: string;
  address?: string;
  email?: string;
  phone?: string;
  status: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;

  // Count fields
  teacherCount: number;
  classCount: number;
  studentCount: number;
  canteenCount: number;

  schoolType?: SchoolStatusType;
  shiftType?: ShiftTypeType;
  educationalLevel?: EducationalLevelType;

  // Capacity fields
  studentsCapacity: number;
  studentCapacityPercentage: number;
  hasAvailableSeats: boolean;
  availableSeats: number;

  // Additional info fields
  website?: string;
  establishedYear?: number;
  motto?: string;
  schoolAge?: number;

  // Infrastructure fields
  totalClassrooms: number;
  totalLabs: number;
  hasTransportFacility: boolean;
  hasHostelFacility: boolean;
  hasCafeteria: boolean;
  hasLibrary: boolean;
  hasSportsFacility: boolean;

  // Financial & accreditation
  annualTuitionFee?: number;
  accreditation?: string;

  // Tags for searchability
  tags: string[];
}

export interface CreateSchoolRequest {
  name: string;
  code: string;
  ownerId?: number;
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
