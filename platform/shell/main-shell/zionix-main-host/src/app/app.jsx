import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@zionix/design-system";
import { queryClient } from "../data/config/queryClient";
import AppRouter from "./appRouter";
import PWAInstallPrompt from "../components/common/PWAInstallPrompt";
import PWAThemeSync from "../components/common/PWAThemeSync";
import { registerServiceWorker } from "../utils/pwaRegistration";

export function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PWAThemeSync />
        <BrowserRouter>
          <AppRouter />
          <PWAInstallPrompt />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
