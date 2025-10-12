import { useEffect, useState, type ReactNode } from "react";
import LanguageContext, { type Language } from "@/contexts/language-context";
import { languages } from "@/constants";
import { useAppStore } from "@/stores/app-store";

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

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLanguageCode = localStorage.getItem("selectedLanguage");
    const browserLang = navigator.language.startsWith("fa") ? "fa" : "en";

    const initialLanguageCode = savedLanguageCode || browserLang;

    // Find the full language object by code
    const initialLanguage =
      languages.find((lang) => lang.code === initialLanguageCode) ||
      languages[0];

    setCurrentLanguage(initialLanguage);
    document.documentElement.dir = initialLanguage.dir;
    document.documentElement.lang = initialLanguage.code;

    // Update Zustand store
    setIsRTL(initialLanguage.dir === "rtl");

    setIsInitialized(true);
  }, [setIsRTL]);

  // Update direction when language changes
  useEffect(() => {
    if (!isInitialized) return;

    document.documentElement.dir = currentLanguage.dir;
    document.documentElement.lang = currentLanguage.code;
    localStorage.setItem("selectedLanguage", currentLanguage.code);

    // Update Zustand store
    setIsRTL(currentLanguage.dir === "rtl");
  }, [currentLanguage, isInitialized, setIsRTL]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
