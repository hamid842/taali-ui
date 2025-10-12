import logo from "@/assets/images/taali-logo.png";
import { useTranslation } from "react-i18next";

export default function AppLogo() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center space-x-2">
      <img src={logo} alt="App Logo" className="h-8 w-8" />
      <span className="text-3xl font-bold">{t("nav.logoTitle")}</span>
    </div>
  );
}
