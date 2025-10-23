import logo from "@/assets/images/taali-logo.png";
import { useLanguage } from "@/hooks/use-language";

export default function AppLogo() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center space-x-2">
      <img src={logo} alt="App Logo" className="h-8 w-8" />
      <span className="text-2xl font-bold">{t("nav.logoTitle")}</span>
    </div>
  );
}
