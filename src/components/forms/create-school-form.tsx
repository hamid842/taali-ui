// components/forms/create-school-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Loader2 } from "lucide-react";
import { AppTextField } from "../common/app-text-field";
import { InternationalPhoneInput } from "../common/phone-input";
import AppSelect from "../common/app-select-field";
import { AppTextArea } from "../common/app-text-area";

// Enhanced validation schema
const createSchoolSchema = z.object({
  name: z
    .string()
    .min(1, "validation.nameRequired")
    .max(255, "validation.nameTooLong"),
  code: z
    .string()
    .min(1, "validation.codeRequired")
    .max(50, "validation.codeTooLong")
    .regex(/^[A-Z0-9_-]+$/, "validation.codePattern"),
  image: z.string().optional(),
  address: z.string().optional(),
  email: z
    .string()
    .email("validation.emailInvalid")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  // Essential new fields
  schoolType: z.string().optional(),
  educationalLevel: z.string().optional(),
  studentsCapacity: z.number().min(0, "validation.capacityPositive").optional(),
});

export type CreateSchoolFormData = z.infer<typeof createSchoolSchema>;

interface CreateSchoolFormProps {
  onSubmit: (data: CreateSchoolFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateSchoolFormData>;
}

export function CreateSchoolForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: CreateSchoolFormProps) {
  const { t, dir } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CreateSchoolFormData>({
    resolver: zodResolver(createSchoolSchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      image: initialData?.image || "",
      address: initialData?.address || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      schoolType: initialData?.schoolType || "",
      educationalLevel: initialData?.educationalLevel || "",
      studentsCapacity: initialData?.studentsCapacity || 0,
    },
    mode: "onChange",
  });

  const handleFormSubmit = (data: CreateSchoolFormData) => {
    // Clean up empty strings to undefined for optional fields
    const submitData = {
      ...data,
      image: data.image || undefined,
      address: data.address || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      schoolType: data.schoolType || undefined,
      educationalLevel: data.educationalLevel || undefined,
    };
    onSubmit(submitData);
  };

  const getErrorMessage = (error: unknown): string | undefined => {
    if (!error) return undefined;

    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : String(error);

    if (!message) return undefined;

    const translationKeys: Record<string, string> = {
      "validation.nameRequired": "owner.addSchool.validation.nameRequired",
      "validation.nameTooLong": "owner.addSchool.validation.nameTooLong",
      "validation.codeRequired": "owner.addSchool.validation.codeRequired",
      "validation.codeTooLong": "owner.addSchool.validation.codeTooLong",
      "validation.codePattern": "owner.addSchool.validation.codePattern",
      "validation.emailInvalid": "owner.addSchool.validation.emailInvalid",
      "validation.phoneInvalid": "owner.addSchool.validation.phoneInvalid",
      "validation.capacityPositive":
        "owner.addSchool.validation.capacityPositive",
    };

    const translationKey = translationKeys[message] || message;
    return t(translationKey);
  };

  const handlePhoneChange = (value: string) => {
    setValue("phone", value, { shouldValidate: true });
  };

  // School type options
  const schoolTypeOptions = [
    { value: "PUBLIC", label: t("school.type.PUBLIC") || "Public" },
    { value: "PRIVATE", label: t("school.type.PRIVATE") || "Private" },
    {
      value: "INTERNATIONAL",
      label: t("school.type.INTERNATIONAL") || "International",
    },
    { value: "CHARTER", label: t("school.type.CHARTER") || "Charter" },
    { value: "RELIGIOUS", label: t("school.type.RELIGIOUS") || "Religious" },
    { value: "BOARDING", label: t("school.type.BOARDING") || "Boarding" },
    { value: "ONLINE", label: t("school.type.ONLINE") || "Online" },
  ];

  // Educational level options
  const educationalLevelOptions = [
    {
      value: "KINDERGARTEN",
      label: t("school.level.KINDERGARTEN") || "Kindergarten",
    },
    { value: "PRESCHOOL", label: t("school.level.PRESCHOOL") || "Preschool" },
    { value: "PRIMARY", label: t("school.level.PRIMARY") || "Primary" },
    {
      value: "MIDDLE_SCHOOL",
      label: t("school.level.MIDDLE_SCHOOL") || "Middle School",
    },
    {
      value: "HIGH_SCHOOL",
      label: t("school.level.HIGH_SCHOOL") || "High School",
    },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("owner.addSchool.basicInfo") || "Basic Information"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppTextField
            label={t("owner.addSchool.name")}
            {...register("name")}
            error={getErrorMessage(errors.name)}
            required
            placeholder={
              t("owner.addSchool.namePlaceholder") || "Enter school name"
            }
            disabled={isLoading}
            autoFocus
          />
          <AppTextField
            label={t("owner.addSchool.code")}
            {...register("code")}
            error={getErrorMessage(errors.code)}
            required
            placeholder="SCHOOL123"
            helperText={t("owner.addSchool.validation.codePattern")}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppSelect
            label={t("owner.addSchool.schoolType")}
            options={schoolTypeOptions}
            value={watch("schoolType") || ""}
            onValueChange={(value) =>
              setValue("schoolType", value, { shouldValidate: true })
            }
            error={getErrorMessage(errors.schoolType)}
            placeholder={
              t("owner.addSchool.selectSchoolType") || "Select school type"
            }
            disabled={isLoading}
          />
          <AppSelect
            label={t("owner.addSchool.educationalLevel")}
            options={educationalLevelOptions}
            value={watch("educationalLevel") || ""}
            onValueChange={(value) =>
              setValue("educationalLevel", value, { shouldValidate: true })
            }
            error={getErrorMessage(errors.educationalLevel)}
            placeholder={
              t("owner.addSchool.selectEducationalLevel") ||
              "Select educational level"
            }
            disabled={isLoading}
          />
        </div>

        <AppTextField
          label={t("owner.addSchool.studentsCapacity")}
          type="number"
          {...register("studentsCapacity", { valueAsNumber: true })}
          error={getErrorMessage(errors.studentsCapacity)}
          placeholder="0"
          min={0}
          helperText={
            t("owner.addSchool.capacityHelper") ||
            "Leave as 0 for unlimited capacity"
          }
          disabled={isLoading}
        />
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("owner.addSchool.contactInfo") || "Contact Information"}
        </h3>

        <AppTextField
          label={t("owner.addSchool.email")}
          type="email"
          {...register("email")}
          error={getErrorMessage(errors.email)}
          placeholder="school@example.com"
          disabled={isLoading}
        />

        <InternationalPhoneInput
          label={t("owner.addSchool.phone")}
          value={watch("phone") || ""}
          onChange={handlePhoneChange}
          error={getErrorMessage(errors.phone)}
        />

        <AppTextArea
          label={t("owner.addSchool.address")}
          {...register("address")}
          error={getErrorMessage(errors.address)}
          placeholder={
            t("owner.addSchool.addressPlaceholder") || "Enter full address"
          }
          disabled={isLoading}
          rows={3}
        />
      </div>

      {/* Hidden image field */}
      <input type="hidden" {...register("image")} />

      {/* Form Actions */}
      <div
        className={`flex gap-4 pt-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
      >
        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="flex-1 gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? t("common.uploading") : t("owner.addSchool.submit")}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            {t("owner.addSchool.cancel")}
          </Button>
        )}
      </div>
    </form>
  );
}
