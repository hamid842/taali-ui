import { type FC } from "react";
import { useSchools } from "@/hooks/use-schools";
import { useLanguage } from "@/hooks/use-language";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SchoolSelectProps {
  value: string;
  onChange: (schoolId: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export const SchoolSelect: FC<SchoolSelectProps> = ({
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  label,
  placeholder,
}) => {
  const { t, dir } = useLanguage();
  const {
    data: schoolsResponse,
    isLoading,
    error: schoolsError,
  } = useSchools();

  const schools = schoolsResponse || [];
  const displayError = error || schoolsError?.message;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* Select */}
      <div className="relative">
        <Select
          disabled={disabled || isLoading}
          onValueChange={onChange}
          value={value}
          dir={dir}
        >
          <SelectTrigger
            className={cn(
              "w-full",
              displayError && "border-red-500 focus:ring-red-500"
            )}
          >
            <SelectValue
              placeholder={
                isLoading
                  ? t("common.loading")
                  : placeholder || t("register.form.selectSchool")
              }
            />
          </SelectTrigger>

          <SelectContent>
            {schools.length > 0 ? (
              schools.map((school) => (
                <SelectItem key={school.id} value={school.id.toString()}>
                  <div>{school.name}</div>
                  <div className="text-muted-foreground">{school.address}</div>
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500">
                {isLoading
                  ? t("common.loading")
                  : t("school.noSchoolsAvailable")}
              </div>
            )}
          </SelectContent>
        </Select>

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Error message */}
      {displayError && <p className="text-sm text-red-500">{displayError}</p>}
    </div>
  );
};
