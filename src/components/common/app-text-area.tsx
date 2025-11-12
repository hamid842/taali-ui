import { forwardRef, useId } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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

const AppTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      labelClassName,
      errorClassName,
      helperClassName,
      dir = "auto",
      labelPosition = "top",
      id,
      required,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const { dir: languageDir } = useLanguage();
    const actualDir = dir === "auto" ? languageDir : dir;
    const isRTL = actualDir === "rtl";

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

    const textareaClasses = cn(
      "flex w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      {
        "text-right": isRTL,
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
          <Label htmlFor={textareaId} className={labelClasses}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <div
          className={
            labelPosition === "top" ? "w-full relative" : "flex-1 relative"
          }
        >
          <Textarea
            id={textareaId}
            ref={ref}
            required={required}
            disabled={disabled}
            className={textareaClasses}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : helperText
                ? `${textareaId}-helper`
                : undefined
            }
            {...props}
          />
        </div>

        {(error || helperText) && (
          <div
            id={error ? `${textareaId}-error` : `${textareaId}-helper`}
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

AppTextArea.displayName = "AppTextArea";

export { AppTextArea };
