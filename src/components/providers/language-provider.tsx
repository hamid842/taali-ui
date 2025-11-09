import { useEffect, useState, type ReactNode, useCallback } from "react";
import LanguageContext, { type Language } from "@/contexts/language-context";
import { languages } from "@/constants";
import { useAppStore } from "@/stores/app-store";

// Import your JSON translation files
import enTranslations from "@/localization/resources/en.json";
import faTranslations from "@/localization/resources/fa.json";

// Define a type for nested objects
type NestedObject = {
  [key: string]: NestedObject | string;
};

export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const setIsRTL = useAppStore((state) => state.setIsRTL);

  // Helper function to get nested translation values with proper typing
  const getNestedValue = useCallback(
    (obj: NestedObject, path: string): string => {
      return path
        .split(".")
        .reduce((acc: NestedObject | string, part: string) => {
          if (typeof acc === "string" || acc === null || acc === undefined) {
            return "";
          }
          return (acc as NestedObject)[part] || "";
        }, obj) as string;
    },
    []
  );

  // Translation function
  const t = useCallback(
    (key: string, vars?: Record<string, unknown>): string => {
      const translations =
        currentLanguage.code === "fa" ? faTranslations : enTranslations;

      // Get translation string
      const value = getNestedValue(translations as NestedObject, key) || key;

      // If variables provided, replace placeholders {var}
      if (vars) {
        return Object.entries(vars).reduce(
          (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
          value
        );
      }

      return value;
    },
    [currentLanguage.code, getNestedValue]
  );

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLanguageCode = localStorage.getItem("selectedLanguage");

    // Check browser language against available language codes
    const browserLang = navigator.language.startsWith("fa") ? "fa" : "en";

    // Validate that the browser language is in our supported languages
    const supportedBrowserLang = languages.find(
      (lang) => lang.code === browserLang
    )
      ? browserLang
      : "en";

    const initialLanguageCode = savedLanguageCode || supportedBrowserLang;

    // Find the full language object by code
    const initialLanguage =
      languages.find((lang) => lang.code === initialLanguageCode) ||
      languages[0]; // Fallback to Farsi

    setCurrentLanguage(initialLanguage);
    document.documentElement.dir = initialLanguage.dir;
    document.documentElement.lang = initialLanguage.code;

    // Update Zustand store
    setIsRTL(initialLanguage.dir === "rtl");

    setIsInitialized(true);
  }, [setIsRTL]);

  // Update direction and language when currentLanguage changes
  useEffect(() => {
    if (!isInitialized) return;

    document.documentElement.dir = currentLanguage.dir;
    document.documentElement.lang = currentLanguage.code;
    localStorage.setItem("selectedLanguage", currentLanguage.code);

    // Update Zustand store
    setIsRTL(currentLanguage.dir === "rtl");
  }, [currentLanguage, isInitialized, setIsRTL]);

  // Function to change language
  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
  }, []);

  // Function to change language by code
  const changeLanguageByCode = useCallback((languageCode: string) => {
    const newLanguage = languages.find((lang) => lang.code === languageCode);
    if (newLanguage) {
      setCurrentLanguage(newLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage: changeLanguage,
        setCurrentLanguageByCode: changeLanguageByCode,
        t, // Provide translation function
        dir: currentLanguage.dir as "ltr" | "rtl",
        language: currentLanguage.code as "en" | "fa",
        languages, // Provide the full languages array for reference
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
