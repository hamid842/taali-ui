import { createContext } from "react";

// Update the interface to match your readonly arrays
export interface Language {
  readonly code: string;
  readonly name: string;
  readonly flag: string;
  readonly dir: "ltr" | "rtl";
  readonly countryCodes: readonly string[];
}

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  setCurrentLanguageByCode: (languageCode: string) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  language: "en" | "fa";
  languages: readonly Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export default LanguageContext;
