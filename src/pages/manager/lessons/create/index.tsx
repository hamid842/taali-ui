// components/pages/lessons/create-lesson-page.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Loader2, Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { AppTextField } from "@/components/common/app-text-field";
import AppSelect from "@/components/common/app-select-field";
import ColorPicker from "@/components/common/color-picker";
import type { CreateLessonRequest } from "@/types/lesson";
import { lessonApi } from "@/lib/api/lesson-api";
import { IRANIAN_GRADE_LEVELS } from "@/constants/education";

// Validation schema
const createLessonSchema = z.object({
  name: z
    .string()
    .min(1, "validation.nameRequired")
    .max(255, "validation.nameTooLong"),
  nameEn: z
    .string()
    .min(1, "validation.nameRequired")
    .max(255, "validation.nameTooLong")
    .optional(),
  gradeLevel: z.string().min(1, "validation.gradeLevelRequired"),
  color: z.string().min(1, "validation.colorRequired"),
});

export type CreateLessonFormData = z.infer<typeof createLessonSchema>;

interface CreateLessonPageProps {
  onLessonCreated?: () => void;
  onCancel?: () => void;
}

export default function CreateLesson({
  onLessonCreated,
  onCancel,
}: CreateLessonPageProps) {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<CreateLessonFormData>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      gradeLevel: "",
      color: "#3b82f6", // Default blue
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CreateLessonFormData) => {
    setIsLoading(true);
    try {
      const lessonData: CreateLessonRequest = {
        name: data.name,
        nameEn: data.nameEn ?? "",
        gradeLevel: data.gradeLevel,
        color: data.color,
      };
      await lessonApi.createLesson(lessonData);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        t("manager.lessons.create.success") || "Lesson created successfully"
      );
      reset();
      onLessonCreated?.();
    } catch (error: unknown) {
      console.error("Failed to create lesson:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("manager.lessons.create.error");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Grade level options based on Iranian system
  const gradeLevelOptions = IRANIAN_GRADE_LEVELS.map((level) => ({
    value: level.code,
    label: language === "fa" ? level.name : level.nameEn,
  }));

  const predefinedColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#ef4444", // red
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
  ];

  const getErrorMessage = (error: unknown): string | undefined => {
    if (!error) return undefined;

    const message = error instanceof Error ? error.message : "";
    const translationKeys: Record<string, string> = {
      "validation.nameRequired": "lessons.validation.nameRequired",
      "validation.nameTooLong": "lessons.validation.nameTooLong",
      "validation.gradeLevelRequired": "lessons.validation.gradeLevelRequired",
      "validation.colorRequired": "lessons.validation.colorRequired",
    };

    const translationKey = translationKeys[message] || message;
    return t(translationKey);
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <CardTitle>
              {t("manager.lessons.create.title") || "Create New Lesson"}
            </CardTitle>
          </div>
          <CardDescription>
            {t("manager.lessons.create.description") ||
              "Add a new lesson to the curriculum"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Lesson Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppTextField
                label={
                  t("manager.lessons.form.name") || "Lesson Name (Persian)"
                }
                {...register("name")}
                error={getErrorMessage(errors.name)}
                required
                placeholder={
                  t("manager.lessons.form.namePlaceholder") ||
                  "Enter lesson name in Persian"
                }
                disabled={isLoading}
              />
              <AppTextField
                label={
                  t("manager.lessons.form.nameEn") || "Lesson Name (English)"
                }
                {...register("nameEn")}
                error={getErrorMessage(errors.nameEn)}
                placeholder={t("manager.lessons.form.nameEnPlaceholder")}
                disabled={isLoading}
              />
            </div>

            {/* Grade Level */}
            <AppSelect
              label={t("manager.lessons.form.gradeLevel") || "Grade Level"}
              options={gradeLevelOptions}
              value={watch("gradeLevel")}
              onValueChange={(value) =>
                setValue("gradeLevel", value, { shouldValidate: true })
              }
              error={getErrorMessage(errors.gradeLevel)}
              required
              placeholder={t("manager.lessons.form.selectGradeLevel")}
              disabled={isLoading}
            />

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                {t("manager.lessons.form.color") || "Color"} *
              </label>
              <ColorPicker
                colors={predefinedColors}
                selectedColor={watch("color")}
                onColorSelect={(color) =>
                  setValue("color", color, { shouldValidate: true })
                }
              />
              {errors.color && (
                <p className="text-sm font-medium text-destructive">
                  {getErrorMessage(errors.color)}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="flex-1 gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isLoading
                  ? t("common.creating")
                  : t("manager.lessons.create.submit")}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {t("common.cancel")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
