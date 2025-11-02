import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "./app-sidebar";
import { Outlet } from "react-router-dom";
import { LanguageSwitcher } from "../language-switcher";
import ThemeToggler from "../theme-toggler";
import Settings from "./settings";
import LocalizedDate from "@/components/common/localized-date";
import { useLanguage } from "@/hooks/use-language";
import HeaderBreadcrumb from "./header-breadcrumb";
import Logout from "./logout";

export default function MainLayout() {
  const { language } = useLanguage();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 px-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex-1 md:flex-none">
            <SidebarTrigger />
          </div>
          <div className="hidden md:flex flex-1 px-3">
            <HeaderBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            <LocalizedDate locale={language} />
            <LanguageSwitcher />
            <ThemeToggler />
            <Settings />
            <Logout />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
