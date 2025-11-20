import { useLanguage } from "./use-language";

export const useGradeLevels = () => {
  const { language } = useLanguage();

  const broadOptions = [
    { value: "PRESCHOOL", label: "Preschool" },
    { value: "PRIMARY", label: "Primary School" },
    { value: "MIDDLE_SCHOOL", label: "Middle School" },
    { value: "HIGH_SCHOOL", label: "High School" },
  ];

  const farsiSpecificOptions = [
    { value: "PRE_PRIMARY", label: "پیش دبستانی" },
    { value: "PRIMARY_1", label: "اول ابتدایی" },
    { value: "PRIMARY_2", label: "دوم ابتدایی" },
    { value: "PRIMARY_3", label: "سوم ابتدایی" },
    { value: "PRIMARY_4", label: "چهارم ابتدایی" },
    { value: "PRIMARY_5", label: "پنجم ابتدایی" },
    { value: "PRIMARY_6", label: "ششم ابتدایی" },
    { value: "LOWER_SECONDARY_7", label: "هفتم" },
    { value: "LOWER_SECONDARY_8", label: "هشتم" },
    { value: "LOWER_SECONDARY_9", label: "نهم" },
    { value: "UPPER_SECONDARY_10", label: "دهم" },
    { value: "UPPER_SECONDARY_11", label: "یازدهم" },
    { value: "UPPER_SECONDARY_12", label: "دوازدهم" },
  ];

  const englishSpecificOptions = [
    { value: "PRE_PRIMARY", label: "Pre-Primary" },
    { value: "PRIMARY_1", label: "Grade 1" },
    { value: "PRIMARY_2", label: "Grade 2" },
    { value: "PRIMARY_3", label: "Grade 3" },
    { value: "PRIMARY_4", label: "Grade 4" },
    { value: "PRIMARY_5", label: "Grade 5" },
    { value: "PRIMARY_6", label: "Grade 6" },
    { value: "LOWER_SECONDARY_7", label: "Grade 7" },
    { value: "LOWER_SECONDARY_8", label: "Grade 8" },
    { value: "LOWER_SECONDARY_9", label: "Grade 9" },
    { value: "UPPER_SECONDARY_10", label: "Grade 10" },
    { value: "UPPER_SECONDARY_11", label: "Grade 11" },
    { value: "UPPER_SECONDARY_12", label: "Grade 12" },
  ];

  // Mapping functions
  const gradeLevelMapping = {
    PRESCHOOL: ["PRE_PRIMARY"],
    PRIMARY: [
      "PRIMARY_1",
      "PRIMARY_2",
      "PRIMARY_3",
      "PRIMARY_4",
      "PRIMARY_5",
      "PRIMARY_6",
    ],
    MIDDLE_SCHOOL: [
      "LOWER_SECONDARY_7",
      "LOWER_SECONDARY_8",
      "LOWER_SECONDARY_9",
    ],
    HIGH_SCHOOL: [
      "UPPER_SECONDARY_10",
      "UPPER_SECONDARY_11",
      "UPPER_SECONDARY_12",
    ],
  };

  const mapToSpecificLevels = (broadLevels: string[]): string[] => {
    return broadLevels.flatMap(
      (level) =>
        gradeLevelMapping[level as keyof typeof gradeLevelMapping] || [level]
    );
  };

  const mapToBroadLevels = (specificLevels: string[]): string[] => {
    const broadLevels: string[] = [];

    specificLevels.forEach((specificLevel) => {
      for (const [broad, specifics] of Object.entries(gradeLevelMapping)) {
        if (specifics.includes(specificLevel)) {
          broadLevels.push(broad);
          return;
        }
      }
      // If no mapping found, keep the specific level
      broadLevels.push(specificLevel);
    });

    return [...new Set(broadLevels)]; // Remove duplicates
  };

  const mapSchoolLevelsToLessonLevels = (schoolLevels: string[]): string[] => {
    const lessonLevels: string[] = [];

    schoolLevels.forEach((level) => {
      switch (level) {
        case "PRESCHOOL":
        case "KINDERGARTEN":
          lessonLevels.push("PRE_PRIMARY");
          break;
        case "PRIMARY":
          // Include all primary grades
          lessonLevels.push(
            "PRIMARY_1",
            "PRIMARY_2",
            "PRIMARY_3",
            "PRIMARY_4",
            "PRIMARY_5",
            "PRIMARY_6"
          );
          break;
        case "MIDDLE_SCHOOL":
          // Include all middle school grades
          lessonLevels.push(
            "LOWER_SECONDARY_7",
            "LOWER_SECONDARY_8",
            "LOWER_SECONDARY_9"
          );
          break;
        case "HIGH_SCHOOL":
          // Include all high school grades
          lessonLevels.push(
            "UPPER_SECONDARY_10",
            "UPPER_SECONDARY_11",
            "UPPER_SECONDARY_12"
          );
          break;
        case "VOCATIONAL":
          // Handle vocational if you have specific levels for it
          lessonLevels.push("VOCATIONAL");
          break;
        default:
          // If it's already a specific level, keep it
          if (!lessonLevels.includes(level)) lessonLevels.push(level);
      }
    });

    return [...new Set(lessonLevels)]; // Remove duplicates
  };

  // Determine which options to use based on language
  const getOptions = () => {
    if (language === "fa") {
      return farsiSpecificOptions;
    } else {
      return broadOptions;
    }
  };

  const getSpecificOptions = () => {
    if (language === "fa") {
      return farsiSpecificOptions;
    } else {
      return englishSpecificOptions;
    }
  };

  return {
    options: getOptions(),
    specificOptions: getSpecificOptions(),
    isUsingBroadOptions: language !== "fa",
    mapToSpecificLevels,
    mapToBroadLevels,
    language,
    mapSchoolLevelsToLessonLevels,
  };
};
