// LanguageSwitcher.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/constants";
import { useLanguage } from "@/hooks/use-language";
import { useAppStore } from "@/stores/app-store";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const appStore = useAppStore();

  const handleLanguageChange = async (language: (typeof languages)[0]) => {
    // Update react-i18next
    await i18n.changeLanguage(language.code);

    // Update your custom context
    setCurrentLanguage(language);

    // Update document attributes
    document.documentElement.dir = language.dir;
    document.documentElement.lang = language.code;

    // Update Zustand store
    appStore.setIsRTL(language.dir === "rtl");
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
