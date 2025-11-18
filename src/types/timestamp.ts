// src/types/timestamp.ts
export interface ClassTimestamp {
  id: number;
  name: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  type: "REGULAR" | "LAUNCH" | "PENSION";
  orderIndex: number;
  isActive: boolean;
  description?: string;
}

export interface CreateClassTimestampRequest {
  name: string;
  startTime: string;
  endTime: string;
  type: "REGULAR" | "LAUNCH" | "PENSION";
  orderIndex?: number;
}

export interface UpdateClassTimestampRequest {
  name?: string;
  startTime?: string;
  endTime?: string;
  type?: "REGULAR" | "LAUNCH" | "PENSION";
  orderIndex?: number;
  isActive?: boolean;
}

export interface TimestampTypeInfo {
  type: "REGULAR" | "LAUNCH" | "PENSION";
  label: string;
  enabled: boolean;
}

export interface AvailableTimestampTypesResponse {
  availableTypes: TimestampTypeInfo[];
}
