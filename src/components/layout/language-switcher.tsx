// LanguageSwitcher.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/constants";
import { useAppStore } from "@/stores/app-store";
import { type Language } from "@/contexts/language-context";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";

export function LanguageSwitcher() {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const setIsRTL = useAppStore((state) => state.setIsRTL);
  const { refetchMenu } = useAuth();


 const handleLanguageChange = async (language: Language) => {
   // Update your custom context
   setCurrentLanguage(language);

   // Update document attributes
   document.documentElement.dir = language.dir;
   document.documentElement.lang = language.code;

   // Update Zustand store
   setIsRTL(language.dir === "rtl");

   // Update localStorage
   localStorage.setItem("selectedLanguage", language.code);

   // Refetch menu with new language
   try {
     await refetchMenu();
   } catch (error) {
     console.error("Failed to refetch menu after language change:", error);
   }
 };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex gap-2 w-auto px-3"
        >
          <span className="text-xl">{currentLanguage.flag}</span>
          <span className="text-sm">{currentLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center gap-3 p-2 cursor-pointer"
          >
            <span className="text-xl flex-shrink-0">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            <span className="text-xs text-muted-foreground">
              {language.code.toUpperCase()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
