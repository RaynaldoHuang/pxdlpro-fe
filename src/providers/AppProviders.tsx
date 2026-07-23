import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdminAuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AdminAuthProvider>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
