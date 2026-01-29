import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@zionix-space/design-system";
import { queryClient } from "../data/config/queryClient";
import AppRouter from "./appRouter";
import ErrorBoundary from "../components/common/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ThemeProvider>
            <ErrorBoundary>
              <BrowserRouter>
                <AppRouter />
              </BrowserRouter>
            </ErrorBoundary>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
