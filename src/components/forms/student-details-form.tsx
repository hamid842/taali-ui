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
          label={t("admin.addStudent.fields.studentId")}
          placeholder={t("admin.addStudent.placeholders.studentId")}
          {...register("studentId")}
        />

        <AppTextField
          label={t("admin.addStudent.fields.idNumber")}
          placeholder={t("admin.addStudent.placeholders.idNumber")}
          {...register("idNumber")}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <AppEnDateField
              label={t("admin.addStudent.fields.birthDate")}
              placeholder={t("admin.addStudent.placeholders.birthDate")}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <AppTextField
          label={t("admin.addStudent.fields.gradeLevel")}
          placeholder={t("admin.addStudent.placeholders.gradeLevel")}
          {...register("gradeLevel")}
        />

        <AppTextField
          label={t("admin.addStudent.fields.emergencyContact")}
          placeholder={t("admin.addStudent.placeholders.emergencyContact")}
          {...register("emergencyContact")}
        />

        <AppTextField
          label={t("admin.addStudent.fields.emergencyPhone")}
          placeholder={t("admin.addStudent.placeholders.emergencyPhone")}
          {...register("emergencyPhone")}
        />
      </div>
      <AppTextArea
        {...register("medicalNotes")}
        label={t("admin.addStudent.fields.medicalNotes")}
        placeholder={t("admin.addStudent.placeholders.medicalNotes")}
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
