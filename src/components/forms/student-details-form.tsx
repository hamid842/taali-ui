import { Controller, useForm } from "react-hook-form";
import { useLanguage } from "@/hooks/use-language";
import type { Student, StudentDetailsRequest } from "@/types/student";
import { AppTextField } from "../common/app-text-field";
import { AppTextArea } from "../common/app-text-area";
import { studentApi } from "@/lib/api/student-api";
import { Button } from "../ui/button";
import AppEnDateField from "../common/app-en-date-field";
import { toast } from "sonner";

interface StudentDetailsFormProps {
  studentId: number | undefined;
  initialData: Student | null;
  onSuccess: (data: Student) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function StudentDetailsForm({
  studentId,
  initialData,
  onSuccess,
  onBack,
  onNext,
}: StudentDetailsFormProps) {
  const { t } = useLanguage();
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Student>({
    defaultValues: { ...initialData, id: studentId },
  });

  const onSubmit = async (data: StudentDetailsRequest) => {
    try {
      const updatedStudent = await studentApi.updateDetails(studentId!, data);
      onSuccess(updatedStudent);
      if (updatedStudent.id) onNext();
    } catch (error) {
      if(error instanceof Error) toast.error(error.message)
      console.error("Failed to update student details:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppTextField
          label={t("addStudent.fields.studentId")}
          placeholder={t("addStudent.placeholders.studentId")}
          {...register("studentId")}
        />

        <AppTextField
          label={t("addStudent.fields.idNumber")}
          placeholder={t("addStudent.placeholders.idNumber")}
          {...register("idNumber")}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <AppEnDateField
              label={t("addStudent.fields.birthDate")}
              placeholder={t("addStudent.placeholders.birthDate")}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <AppTextField
          label={t("addStudent.fields.gradeLevel")}
          placeholder={t("addStudent.placeholders.gradeLevel")}
          {...register("gradeLevel")}
        />

        <AppTextField
          label={t("addStudent.fields.emergencyContact")}
          placeholder={t("addStudent.placeholders.emergencyContact")}
          {...register("emergencyContact")}
        />

        <AppTextField
          label={t("addStudent.fields.emergencyPhone")}
          placeholder={t("addStudent.placeholders.emergencyPhone")}
          {...register("emergencyPhone")}
        />
      </div>
      <AppTextArea
        {...register("medicalNotes")}
        label={t("addStudent.fields.medicalNotes")}
        placeholder={t("addStudent.placeholders.medicalNotes")}
      />
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          {t("common.back")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {t("common.continue")}
        </Button>
      </div>
    </form>
  );
}
