import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Loader2 } from "lucide-react";
import { AppTextField } from "../common/app-text-field";
import { InternationalPhoneInput } from "../common/phone-input";

// Fixed validation schema
const createSchoolSchema = z.object({
  name: z.string().min(1, "validation.nameRequired"),
  code: z
    .string()
    .min(1, "validation.codeRequired")
    .regex(/^[a-zA-Z0-9]+$/, "validation.codePattern"),
  image: z.string().optional(),
  address: z.string().optional(),
  email: z
    .string()
    .email("validation.emailInvalid")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
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
      "validation.nameRequired": "school.validation.nameRequired",
      "validation.codeRequired": "school.validation.codeRequired",
      "validation.codePattern": "school.validation.codePattern",
      "validation.emailInvalid": "school.validation.emailInvalid",
      "validation.phoneInvalid": "school.validation.phoneInvalid",
    };

    const translationKey = translationKeys[message] || message;
    return t(translationKey);
  };

  // Handle phone input changes with validation
  const handlePhoneChange = (value: string) => {
    setValue("phone", value, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="flex gap-4">
        <AppTextField
          label={t("school.name")}
          {...register("name")}
          error={getErrorMessage(errors.name)}
          required
          placeholder={t("school.name")}
          disabled={isLoading}
          autoFocus
        />
        <AppTextField
          label={t("school.code")}
          {...register("code")}
          error={getErrorMessage(errors.code)}
          required
          placeholder="SCHOOL123"
          helperText={t("school.validation.codePattern")}
          disabled={isLoading}
        />
      </div>

      <AppTextField
        label={t("school.email")}
        type="email"
        {...register("email")}
        error={getErrorMessage(errors.email)}
        placeholder="school@example.com"
        disabled={isLoading}
      />

      <InternationalPhoneInput
        label={t("school.phone")}
        value={watch("phone") || ""}
        onChange={handlePhoneChange}
        error={getErrorMessage(errors.phone)}
      />

      <AppTextField
        label={t("school.address")}
        {...register("address")}
        error={getErrorMessage(errors.address)}
        placeholder={t("school.address")}
        disabled={isLoading}
      />

      {/* Hidden image field */}
      <input type="hidden" {...register("image")} />

      {/* Form Actions */}
      <div
        className={`flex gap-4 pt-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
      >
        <Button
          type="submit"
          disabled={isLoading || !isValid} // Disable if form is invalid
          className="flex-1 gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? t("common.uploading") : t("school.submit")}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            {t("school.cancel")}
          </Button>
        )}
      </div>
    </form>
  );
}
