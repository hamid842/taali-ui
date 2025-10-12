import type { languages } from "@/constants";
import { createContext } from "react";

export type Language = (typeof languages)[0];

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
export default LanguageContext;
