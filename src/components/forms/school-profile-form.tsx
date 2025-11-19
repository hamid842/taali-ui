import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Loader2 } from "lucide-react";
import { AppTextField } from "../common/app-text-field";

import { AppTextArea } from "../common/app-text-area";
import AppSelect from "../common/app-select-field";
import type { ISchool } from "@/types/school";
import { useEffect } from "react";
import AppMultiSelect from "../common/app-multi-select";

const schoolProfileSchema = z.object({
  // Basic info
  name: z
    .string()
    .min(1, "validation.nameRequired")
    .max(255, "validation.nameTooLong"),
  code: z
    .string()
    .min(1, "validation.codeRequired")
    .max(50, "validation.codeTooLong")
    .regex(/^[A-Z0-9_-]+$/, "validation.codePattern"),
  email: z.email("validation.emailInvalid").optional().or(z.literal("")),
  phone: z.string().optional(),
  image: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .regex(
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
      "validation.websiteInvalid"
    )
    .optional()
    .or(z.literal("")),
  motto: z.string().max(500, "validation.mottoTooLong").optional(),
  establishedYear: z.number().min(1800).max(2100).optional(),

  // Academic
  schoolType: z.string().optional(),
  educationalLevels: z.array(z.string()).min(1, "validation.atLeastOneLevel"),
  shiftType: z.string().optional(),
  studentsCapacity: z.number().min(0, "validation.capacityPositive").optional(),

  // Facilities
  totalClassrooms: z.number().min(0, "validation.positiveNumber").optional(),
  totalLabs: z.number().min(0, "validation.positiveNumber").optional(),
  hasTransportFacility: z.boolean().optional(),
  hasHostelFacility: z.boolean().optional(),
  hasCafeteria: z.boolean().optional(),
  hasLibrary: z.boolean().optional(),
  hasSportsFacility: z.boolean().optional(),

  // Financial
  annualTuitionFee: z.number().min(0, "validation.positiveNumber").optional(),
  accreditation: z
    .string()
    .max(255, "validation.accreditationTooLong")
    .optional(),
});

// ✅ Simple type from unified schema
export type SchoolProfileFormData = z.infer<typeof schoolProfileSchema>;

interface SchoolProfileFormProps {
  school: ISchool;
  onSubmit: (data: Partial<SchoolProfileFormData>) => void;
  isLoading?: boolean;
  tab: "basic" | "academic" | "facilities" | "financial";
}

// ✅ Tab field mapping
const TAB_FIELDS: Record<string, (keyof SchoolProfileFormData)[]> = {
  basic: [
    "name",
    "code",
    "email",
    "phone",
    "address",
    "website",
    "motto",
    "establishedYear",
  ],
  academic: [
    "schoolType",
    "educationalLevels",
    "shiftType",
    "studentsCapacity",
  ],
  facilities: [
    "totalClassrooms",
    "totalLabs",
    "hasTransportFacility",
    "hasHostelFacility",
    "hasCafeteria",
    "hasLibrary",
    "hasSportsFacility",
  ],
  financial: ["annualTuitionFee", "accreditation"],
};

interface SchoolProfileFormProps {
  school: ISchool;
  onSubmit: (data: Partial<SchoolProfileFormData>) => void;
  isLoading?: boolean;
  tab: "basic" | "academic" | "facilities" | "financial";
}

export function SchoolProfileForm({
  school,
  onSubmit,
  isLoading = false,
  tab,
}: SchoolProfileFormProps) {
  const { t, dir } = useLanguage();

  const getTabSchema = () => {
    const fields = TAB_FIELDS[tab];
    return schoolProfileSchema.pick(
      fields.reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {} as Record<keyof SchoolProfileFormData, true>
      )
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<SchoolProfileFormData>({
    resolver: zodResolver(getTabSchema()),
    defaultValues: {
      name: school.name || "",
      code: school.code || "",
      email: school.email || "",
      phone: school.phone || "",
      address: school.address || "",
      website: school.website || "",
      motto: school.motto || "",
      establishedYear: school.establishedYear || undefined,
      schoolType: school.schoolType || "",
      educationalLevels: school.educationalLevels || [],
      shiftType: school.shiftType || "",
      studentsCapacity: school.studentsCapacity || 0,
      totalClassrooms: school.totalClassrooms || 0,
      totalLabs: school.totalLabs || 0,
      hasTransportFacility: school.hasTransportFacility || false,
      hasHostelFacility: school.hasHostelFacility || false,
      hasCafeteria: school.hasCafeteria || false,
      hasLibrary: school.hasLibrary || false,
      hasSportsFacility: school.hasSportsFacility || false,
      annualTuitionFee: school.annualTuitionFee || undefined,
      accreditation: school.accreditation || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      // Basic Info Tab
      name: school.name || "",
      code: school.code || "",
      email: school.email || "",
      phone: school.phone || "",
      address: school.address || "",
      website: school.website || "",
      motto: school.motto || "",
      establishedYear: school.establishedYear || undefined,

      // Academic Tab
      schoolType: school.schoolType || "",
      educationalLevels: school.educationalLevels || [],
      shiftType: school.shiftType || "",
      studentsCapacity: school.studentsCapacity || 0,

      // Facilities Tab
      totalClassrooms: school.totalClassrooms || 0,
      totalLabs: school.totalLabs || 0,
      hasTransportFacility: school.hasTransportFacility || false,
      hasHostelFacility: school.hasHostelFacility || false,
      hasCafeteria: school.hasCafeteria || false,
      hasLibrary: school.hasLibrary || false,
      hasSportsFacility: school.hasSportsFacility || false,

      // Financial Tab
      annualTuitionFee: school.annualTuitionFee || undefined,
      accreditation: school.accreditation || "",
    });
  }, [tab, school, reset]);

  const handleFormSubmit = (data: SchoolProfileFormData) => {
    const fields = TAB_FIELDS[tab];

    // Use Record<string, any> during building, then cast final result
    const tabData = fields.reduce((acc: Record<string, unknown>, field) => {
      const value = data[field];
      if (value !== undefined && value !== null) {
        acc[field] = value;
      }
      return acc;
    }, {}) as Partial<SchoolProfileFormData>;

    onSubmit(tabData);
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
      "validation.nameRequired": "school.profile.validation.nameRequired",
      "validation.nameTooLong": "school.profile.validation.nameTooLong",
      "validation.codeRequired": "school.profile.validation.codeRequired",
      "validation.codeTooLong": "school.profile.validation.codeTooLong",
      "validation.codePattern": "school.profile.validation.codePattern",
      "validation.emailInvalid": "school.profile.validation.emailInvalid",
      "validation.websiteInvalid": "school.profile.validation.websiteInvalid",
      "validation.mottoTooLong": "school.profile.validation.mottoTooLong",
      "validation.yearRealistic": "school.profile.validation.yearRealistic",
      "validation.capacityPositive":
        "school.profile.validation.capacityPositive",
      "validation.positiveNumber": "school.profile.validation.positiveNumber",
      "validation.accreditationTooLong":
        "school.profile.validation.accreditationTooLong",
    };

    const translationKey = translationKeys[message] || message;
    return t(translationKey);
  };

  // Render basic info tab
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppTextField
          label={t("school.fields.name")}
          {...register("name")}
          error={getErrorMessage(errors.name)}
          required
          disabled={isLoading}
        />
        <AppTextField
          label={t("school.fields.code")}
          {...register("code")}
          error={getErrorMessage(errors.code)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppTextField
          label={t("school.fields.email")}
          type="email"
          {...register("email")}
          error={getErrorMessage(errors.email)}
          disabled={isLoading}
        />
        <AppTextField
          label={t("school.fields.phone")}
          {...register("phone")}
          error={getErrorMessage(errors.phone)}
          disabled={isLoading}
        />
      </div>

      <AppTextField
        label={t("school.fields.website")}
        {...register("website")}
        error={getErrorMessage(errors.website)}
        placeholder="https://example.com"
        disabled={isLoading}
      />

      <AppTextField
        label={t("school.fields.establishedYear")}
        type="number"
        {...register("establishedYear", { valueAsNumber: true })}
        error={getErrorMessage(errors.establishedYear)}
        min={1800}
        max={2100}
        disabled={isLoading}
      />

      <AppTextField
        label={t("school.fields.motto")}
        {...register("motto")}
        error={getErrorMessage(errors.motto)}
        disabled={isLoading}
      />

      <AppTextArea
        label={t("school.fields.address")}
        {...register("address")}
        error={getErrorMessage(errors.address)}
        disabled={isLoading}
      />
    </div>
  );

  // Render academic tab
  const renderAcademic = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppSelect
          label={t("school.fields.schoolType")}
          options={[
            { value: "PUBLIC", label: t("school.type.PUBLIC") },
            { value: "PRIVATE", label: t("school.type.PRIVATE") },
            { value: "INTERNATIONAL", label: t("school.type.INTERNATIONAL") },
            { value: "CHARTER", label: t("school.type.CHARTER") },
            { value: "RELIGIOUS", label: t("school.type.RELIGIOUS") },
            { value: "BOARDING", label: t("school.type.BOARDING") },
            { value: "ONLINE", label: t("school.type.ONLINE") },
          ]}
          value={watch("schoolType") || ""}
          onValueChange={(value) =>
            setValue("schoolType", value, { shouldValidate: true })
          }
          error={getErrorMessage(errors.schoolType)}
          disabled={isLoading}
        />
        <AppMultiSelect
          label={t("school.fields.educationalLevel")}
          options={[
            { value: "KINDERGARTEN", label: t("school.level.KINDERGARTEN") },
            { value: "PRESCHOOL", label: t("school.level.PRESCHOOL") },
            { value: "PRIMARY", label: t("school.level.PRIMARY") },
            { value: "MIDDLE_SCHOOL", label: t("school.level.MIDDLE_SCHOOL") },
            { value: "HIGH_SCHOOL", label: t("school.level.HIGH_SCHOOL") },
          ]}
          value={watch("educationalLevels") || []}
          onChange={(value) =>
            setValue("educationalLevels", value, { shouldValidate: true })
          }
          error={getErrorMessage(errors.educationalLevels)}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppSelect
          label={t("school.fields.shiftType")}
          options={[
            { value: "MORNING", label: t("school.shift.MORNING") },
            { value: "AFTERNOON", label: t("school.shift.AFTERNOON") },
            { value: "EVENING", label: t("school.shift.EVENING") },
            { value: "DOUBLE_SHIFT", label: t("school.shift.DOUBLE_SHIFT") },
            { value: "FLEXIBLE", label: t("school.shift.FLEXIBLE") },
          ]}
          value={watch("shiftType") || ""}
          onValueChange={(value) =>
            setValue("shiftType", value, { shouldValidate: true })
          }
          error={getErrorMessage(errors.shiftType)}
          disabled={isLoading}
        />
        <AppTextField
          label={t("school.fields.studentsCapacity")}
          type="number"
          {...register("studentsCapacity", { valueAsNumber: true })}
          error={getErrorMessage(errors.studentsCapacity)}
          min={0}
          disabled={isLoading}
        />
      </div>
    </div>
  );

  // Render facilities tab
  const renderFacilities = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppTextField
          label={t("school.fields.totalClassrooms")}
          type="number"
          {...register("totalClassrooms", { valueAsNumber: true })}
          error={getErrorMessage(errors.totalClassrooms)}
          min={0}
          disabled={isLoading}
        />
        <AppTextField
          label={t("school.fields.totalLabs")}
          type="number"
          {...register("totalLabs", { valueAsNumber: true })}
          error={getErrorMessage(errors.totalLabs)}
          min={0}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">
          {t("school.infrastructure.facilities")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("hasTransportFacility")}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <span className="text-sm">
              {t("school.fields.hasTransportFacility")}
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("hasHostelFacility")}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <span className="text-sm">
              {t("school.fields.hasHostelFacility")}
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("hasCafeteria")}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{t("school.fields.hasCafeteria")}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("hasLibrary")}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{t("school.fields.hasLibrary")}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("hasSportsFacility")}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <span className="text-sm">
              {t("school.fields.hasSportsFacility")}
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  // Render financial tab (the one you requested)
  const renderFinancial = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppTextField
          label={t("school.fields.annualTuitionFee")}
          type="number"
          {...register("annualTuitionFee", { valueAsNumber: true })}
          error={getErrorMessage(errors.annualTuitionFee)}
          min={0}
          step="0.01"
          placeholder="0.00"
          disabled={isLoading}
          helperText={
            t("school.profile.tuitionFeeHelper") || "Enter 0 if no tuition fee"
          }
        />
        <AppTextField
          label={t("school.fields.accreditation")}
          {...register("accreditation")}
          error={getErrorMessage(errors.accreditation)}
          placeholder={
            t("school.profile.accreditationPlaceholder") ||
            "e.g., National Accreditation Board"
          }
          disabled={isLoading}
        />
      </div>

      {/* Additional financial information can be added here */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">
          {t("school.profile.financialInfo") || "Financial Information"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {t("school.profile.financialDescription") ||
            "Tuition fees and accreditation information help parents and students make informed decisions."}
        </p>
      </div>
    </div>
  );

  // Render the appropriate form based on the current tab
  const renderFormContent = () => {
    switch (tab) {
      case "basic":
        return renderBasicInfo();
      case "academic":
        return renderAcademic();
      case "facilities":
        return renderFacilities();
      case "financial":
        return renderFinancial();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {renderFormContent()}

      {/* Form Actions */}
      <div
        className={`flex gap-4 pt-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
      >
        <Button
          type="submit"
          disabled={isLoading || !isDirty || !isValid}
          className="gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? t("common.saving") : t("common.save")}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isLoading || !isDirty}
        >
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
