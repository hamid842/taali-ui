import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "dir"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  dir?: "ltr" | "rtl" | "auto";
  labelPosition?: "top" | "left" | "right";
  showPasswordToggle?: boolean;
}

const AppTextField = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      errorClassName,
      helperClassName,
      label,
      error,
      helperText,
      dir = "auto",
      labelPosition = "top",
      id,
      required,
      disabled,
      type,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const { dir: languageDir } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);

    const actualDir = dir === "auto" ? languageDir : dir;
    const isRTL = actualDir === "rtl";

    const inputDir =
      type === "email" || type === "tel" || type === "password"
        ? "ltr"
        : actualDir;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const containerClasses = cn(
      "w-full",
      {
        "flex flex-col gap-2": labelPosition === "top",
        "flex items-center gap-3":
          labelPosition === "left" || labelPosition === "right",
        "flex-row-reverse":
          labelPosition === "right" || (isRTL && labelPosition === "left"),
      },
      containerClassName
    );

    const labelClasses = cn(
      "text-sm font-medium leading-none",
      {
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70": disabled,
        "text-right": isRTL && labelPosition === "top",
        "whitespace-nowrap":
          labelPosition === "left" || labelPosition === "right",
      },
      labelClassName
    );

    const inputClasses = cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      {
        "text-right": inputDir === "rtl",
        "text-left": inputDir === "ltr",
        "border-destructive focus-visible:ring-destructive": error,
        "cursor-not-allowed opacity-50": disabled,
      },
      className
    );

    const messageClasses = cn(
      "text-xs mt-1",
      {
        "text-destructive": error,
        "text-muted-foreground": !error,
        "text-right": isRTL,
      },
      error ? errorClassName : helperClassName
    );

    return (
      <div className={containerClasses} dir={actualDir}>
        {label && (
          <Label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <div
          className={
            labelPosition === "top" ? "w-full relative" : "flex-1 relative"
          }
        >
          <Input
            id={inputId}
            ref={ref}
            className={inputClasses}
            required={required}
            disabled={disabled}
            type={inputType}
            dir={inputDir}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 h-full px-3 py-2 hover:bg-transparent right-0"
              onClick={togglePasswordVisibility}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          )}
        </div>

        {(error || helperText) && (
          <div
            id={error ? `${inputId}-error` : `${inputId}-helper`}
            className={messageClasses}
            role={error ? "alert" : undefined}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

AppTextField.displayName = "AppTextField";

export { AppTextField };
