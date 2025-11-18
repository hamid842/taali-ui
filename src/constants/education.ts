import type { GradeLevel } from "@/types/education";

export const IRANIAN_GRADE_LEVELS: GradeLevel[] = [
  // Pre-Primary
  {
    code: "PRE_PRIMARY",
    name: "پیش دبستانی",
    nameEn: "Pre-Primary",
    period: "PRE_PRIMARY",
  },

  // First Period Primary (دوره اول ابتدایی)
  {
    code: "PRIMARY_1",
    name: "اول ابتدایی",
    nameEn: "First Grade",
    period: "FIRST_PERIOD_PRIMARY",
    gradeNumber: 1,
  },
  {
    code: "PRIMARY_2",
    name: "دوم ابتدایی",
    nameEn: "Second Grade",
    period: "FIRST_PERIOD_PRIMARY",
    gradeNumber: 2,
  },
  {
    code: "PRIMARY_3",
    name: "سوم ابتدایی",
    nameEn: "Third Grade",
    period: "FIRST_PERIOD_PRIMARY",
    gradeNumber: 3,
  },

  // Second Period Primary (دوره دوم ابتدایی)
  {
    code: "PRIMARY_4",
    name: "چهارم ابتدایی",
    nameEn: "Fourth Grade",
    period: "SECOND_PERIOD_PRIMARY",
    gradeNumber: 4,
  },
  {
    code: "PRIMARY_5",
    name: "پنجم ابتدایی",
    nameEn: "Fifth Grade",
    period: "SECOND_PERIOD_PRIMARY",
    gradeNumber: 5,
  },
  {
    code: "PRIMARY_6",
    name: "ششم ابتدایی",
    nameEn: "Sixth Grade",
    period: "SECOND_PERIOD_PRIMARY",
    gradeNumber: 6,
  },

  // Lower Secondary (دوره اول متوسطه)
  {
    code: "LOWER_SECONDARY_7",
    name: "هفتم",
    nameEn: "Seventh Grade",
    period: "LOWER_SECONDARY",
    gradeNumber: 7,
  },
  {
    code: "LOWER_SECONDARY_8",
    name: "هشتم",
    nameEn: "Eighth Grade",
    period: "LOWER_SECONDARY",
    gradeNumber: 8,
  },
  {
    code: "LOWER_SECONDARY_9",
    name: "نهم",
    nameEn: "Ninth Grade",
    period: "LOWER_SECONDARY",
    gradeNumber: 9,
  },

  // Upper Secondary (دوره دوم متوسطه)
  {
    code: "UPPER_SECONDARY_10",
    name: "دهم",
    nameEn: "Tenth Grade",
    period: "UPPER_SECONDARY",
    gradeNumber: 10,
  },
  {
    code: "UPPER_SECONDARY_11",
    name: "یازدهم",
    nameEn: "Eleventh Grade",
    period: "UPPER_SECONDARY",
    gradeNumber: 11,
  },
  {
    code: "UPPER_SECONDARY_12",
    name: "دوازدهم",
    nameEn: "Twelfth Grade",
    period: "UPPER_SECONDARY",
    gradeNumber: 12,
  },
];

export const EDUCATION_PERIODS = {
  PRE_PRIMARY: { name: "پیش دبستانی", nameEn: "Pre-Primary" },
  FIRST_PERIOD_PRIMARY: {
    name: "دوره اول ابتدایی",
    nameEn: "First Period Primary",
  },
  SECOND_PERIOD_PRIMARY: {
    name: "دوره دوم ابتدایی",
    nameEn: "Second Period Primary",
  },
  LOWER_SECONDARY: { name: "دوره اول متوسطه", nameEn: "Lower Secondary" },
  UPPER_SECONDARY: { name: "دوره دوم متوسطه", nameEn: "Upper Secondary" },
};
