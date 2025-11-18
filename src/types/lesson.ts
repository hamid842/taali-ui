export interface Lesson {
  id: number;
  name: string;
  nameEn?: string;
  gradeLevel: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  name: string;
  nameEn: string;
  gradeLevel: string;
  color: string;
}

export interface UpdateLessonRequest {
  name?: string;
  nameEn?: string;
  gradeLevel?: string;
  color?: string;
}
