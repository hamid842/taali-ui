import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Student } from "@/types/student";
import type { Parent } from "@/types/parent";
import { AppTextField } from "../common/app-text-field";
import { AppTextArea } from "../common/app-text-area";
import { studentApi } from "@/lib/api/student-api";
import { InternationalPhoneInput } from "../common/phone-input";

interface StudentParentsFormProps {
  studentId: number | undefined;
  onSuccess: (data: Student) => void;
  onBack: () => void;
}

export default function StudentParentsForm({
  studentId,
  onSuccess,
  onBack,
}: StudentParentsFormProps) {
  const { t } = useLanguage();
  const [parents, setParents] = useState<Parent[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<Parent>();

  const addParent = (data: Parent) => {
    setParents([...parents, data]);
    reset();
  };

  const removeParent = (index: number) => {
    setParents(parents.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    // if (!studentId) return;
    try {
      const updatedStudent = await studentApi.associateParents(studentId!, {
        parentEmails: [],
        newParents: parents,
      });
      onSuccess(updatedStudent);
    } catch (error) {
      console.error("Failed to associate parents:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Parent Form */}
      <form
        onSubmit={handleSubmit(addParent)}
        className="space-y-4 p-4 border rounded-lg"
      >
        <h3 className="font-medium">{t("admin.addStudent.parents.addNew")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label={t("admin.addStudent.parents.firstName")}
            placeholder={t("admin.addStudents.parents.firstNamePlaceholder")}
            error={errors.firstName && t("common.required")}
            required
            {...register("firstName", { required: true })}
          />

          <AppTextField
            label={t("admin.addStudent.parents.lastName")}
            placeholder={t("admin.addStudents.parents.lastNamePlaceholder")}
            error={errors.lastName && t("common.required")}
            required
            {...register("lastName", { required: true })}
          />

          <AppTextField
            label={t("admin.addStudent.parents.email")}
            type="email"
            placeholder={t("admin.addStudents.parents.emailPlaceholder")}
            error={errors.email && t("common.required")}
            required
            {...register("email", { required: true })}
          />
          <InternationalPhoneInput
            label={t("admin.addStudent.parents.phone")}
            value={watch("phoneNumber")}
            onChange={(value) => setValue("phoneNumber", value)}
            error={errors.phoneNumber?.message}
            required
          />

          <div className="md:col-span-2">
            <AppTextField
              label={t("admin.addStudents.parents.occupation")}
              placeholder={t("admin.addStudents.parents.occupationPlaceholder")}
              {...register("occupation")}
            />
          </div>

          <div className="md:col-span-2">
            <AppTextArea
              label={t("admin.addStudent.parents.notes")}
              placeholder={t("admin.addStudent.parents.notesPlaceholder")}
              {...register("notes")}
            />
          </div>
        </div>

        <Button type="submit" size="sm" disabled={isSubmitting}>
          <Plus className="w-4 h-4 mr-2" />
          {t("admin.addStudents.parents.addParent")}
        </Button>
      </form>

      {/* Parents List */}
      {parents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">
            {t("admin.addStudents.parents.addedParents")}
          </h3>
          {parents.map((parent, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="font-medium">
                  {parent.firstName} {parent.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {parent.email} • {parent.phoneNumber}
                  {parent.occupation && ` • ${parent.occupation}`}
                  {parent.notes && (
                    <div className="mt-1 text-xs text-muted-foreground italic">
                      {parent.notes}
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeParent(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Submit all parents */}
      {parents.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onBack}>
            {t("common.back")}
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {t("common.continue")}
          </Button>
        </div>
      )}
    </div>
  );
}
