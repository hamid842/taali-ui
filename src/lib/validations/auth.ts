import { z } from "zod";

// Language-specific regex patterns
const NAME_REGEX = {
  en: /^[a-zA-Z\s\-']+$/, // English: letters, spaces, hyphens, apostrophes
  fa: /^[\u0600-\u06FF\s\u200C\u200F\-']+$/, // Farsi: Persian chars, spaces, zero-width non-joiner, zero-width joiner, hyphens, apostrophes
};

const PHONE_REGEX = {
  en: /^\+?[\d\s\-()]+$/, // International format
  fa: /^[\d\u06F0-\u06F9\s\-()]+$/, // Persian and Western digits
};

export const createRegisterSchema = (
  t: (key: string) => string,
  language: "en" | "fa"
) => {
  const nameRegex = NAME_REGEX[language];
  const phoneRegex = PHONE_REGEX[language];

  // Language-specific error messages
  const nameRegexError =
    language === "fa"
      ? t("validation.name.regex.fa")
      : t("validation.name.regex.en");

  return z
    .object({
      firstName: z
        .string()
        .min(2, t("validation.firstName.min"))
        .max(50, t("validation.firstName.max"))
        .regex(nameRegex, nameRegexError),

      lastName: z
        .string()
        .min(2, t("validation.lastName.min"))
        .max(50, t("validation.lastName.max"))
        .regex(nameRegex, nameRegexError),

      email: z
        .email(t("validation.email.format"))
        .min(5, t("validation.email.min")),

      phoneNumber: z
        .string()
        .regex(phoneRegex, t("validation.phone.format"))
        .min(10, t("validation.phone.min")),

      password: z
        .string()
        .min(8, t("validation.password.min"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.password.strength")
        ),

      confirmPassword: z.string(),

      role: z
        .enum(["TEACHER", "STUDENT", "PARENT", "ADMIN"])
        .refine((val) => !!val, {
          message: t("validation.role.required"),
        }),

      dateOfBirth: z.string().refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 5 && age <= 100;
      }, t("validation.dateOfBirth.age")),

      gender: z.enum(["MALE", "FEMALE"]).refine((val) => !!val, {
        message: t("validation.gender.required"),
      }),

      address: z.object({
        street: z.string().min(5, t("validation.address.street.min")),
        city: z.string().min(2, t("validation.address.city.min")),
        state: z.string().min(2, t("validation.address.state.min")),
        zipCode: z
          .string()
          .regex(/^\d{5,10}$/, t("validation.address.zipCode.format")),
        country: z.string().min(2, t("validation.address.country.min")),
      }),

      gradeLevel: z.string().optional(),
      subject: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.confirmPassword.match"),
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        if (data.role === "STUDENT" && !data.gradeLevel) {
          return false;
        }
        return true;
      },
      {
        message: t("validation.gradeLevel.required"),
        path: ["gradeLevel"],
      }
    )
    .refine(
      (data) => {
        if (data.role === "TEACHER" && !data.subject) {
          return false;
        }
        return true;
      },
      {
        message: t("validation.subject.required"),
        path: ["subject"],
      }
    );
};

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
