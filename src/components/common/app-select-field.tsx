import { useLanguage } from "@/hooks/use-language";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppSelectProps {
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export default function AppSelect({
  label,
  value,
  onValueChange,
  error,
  required,
  disabled,
  placeholder,
  options,
}: AppSelectProps) {
  const { t,dir } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-sm font-medium">
        {t(label)}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Select
        dir={dir}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder ? t(placeholder) : ""} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {t(option.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
