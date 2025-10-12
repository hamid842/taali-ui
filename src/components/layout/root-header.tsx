import { useState } from "react";
import AppLogo from "./app-logo";
import AuthButtons from "./auth-buttons";
import HeaderMenu from "./header-menu";
import { LanguageSwitcher } from "./language-switcher";
import ThemeToggler from "./theme-toggler";

export default function RootHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex py-2 px-4 items-center justify-between flex-wrap sm:flex-nowrap gap-2">
        {/* Logo */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <AppLogo />
          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex flex-1 justify-center">
          <HeaderMenu />
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex gap-2">
          <AuthButtons />
          <LanguageSwitcher />
          <ThemeToggler />
        </div>

        {/* Mobile Menu - Collapsible */}
        {isMobileMenuOpen && (
          <div className="w-full sm:hidden flex flex-col items-center gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <HeaderMenu />
            <div className="flex gap-4">
              <AuthButtons />
            </div>
            <div className="flex gap-4">
              <LanguageSwitcher />
              <ThemeToggler />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
