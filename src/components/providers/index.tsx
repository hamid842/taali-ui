import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import LanguageProvider from "./language-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./auth-provider";

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
