import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      type, // Extract type from props
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const { dir: languageDir } = useLanguage(); // Get direction from language context

    // Determine actual direction for container and label
    const actualDir = dir === "auto" ? languageDir : dir;
    const isRTL = actualDir === "rtl";

    // Determine input direction - LTR for email and tel, otherwise use actualDir
    const inputDir = type === "email" || type === "tel" ? "ltr" : actualDir;

    // Base container classes
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

    // Label classes
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

    // Input classes
    const inputClasses = cn(
      // Base styles
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

      // RTL/LTR specific styles
      {
        "text-right": inputDir === "rtl",
        "text-left": inputDir === "ltr",
      },

      // States
      {
        "border-destructive focus-visible:ring-destructive": error,
        "cursor-not-allowed opacity-50": disabled,
      },
      className
    );

    // Error/helper text classes
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

        <div className={labelPosition === "top" ? "w-full" : "flex-1"}>
          <Input
            id={inputId}
            ref={ref}
            className={inputClasses}
            required={required}
            disabled={disabled}
            type={type} // Make sure type is passed through
            dir={inputDir} // Use the computed input direction
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
      </div>
    );
  }
);

AppTextField.displayName = "AppTextField";

export { AppTextField };
