import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import LanguageProvider from "./language-provider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
