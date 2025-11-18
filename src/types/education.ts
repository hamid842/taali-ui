export interface GradeLevel {
  code: string;
  name: string;
  nameEn: string;
  period:
    | "PRE_PRIMARY"
    | "FIRST_PERIOD_PRIMARY"
    | "SECOND_PERIOD_PRIMARY"
    | "LOWER_SECONDARY"
    | "UPPER_SECONDARY"
    | "TERTIARY";
  gradeNumber?: number;
}
