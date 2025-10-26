import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme, ThemeSafePageLoader } from "@zionix/design-system";
import HostAppLayout from "../components/shell/layout/HostAppLayout";
import { queryClient } from "../data/config/queryClient";

// Lazy load the admin remote app
const AdminApp = React.lazy(() => import("adminApp/Module"));

// Admin page component that loads the remote app
const AdminPage = () => {
  const { token } = useTheme();

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/"
          style={{
            padding: "8px 16px",
            backgroundColor: token.colorTextSecondary,
            color: token.colorWhite,
            textDecoration: "none",
            borderRadius: token.borderRadiusSM,
            fontSize: "14px",
          }}
        >
          ← Back to Host
        </Link>
      </div>

      <React.Suspense fallback={<ThemeSafePageLoader message="Loading Admin App..." />}>
        <AdminApp />
      </React.Suspense>
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <HostAppLayout>
            <Routes>
              <Route path="/admin-app" element={<AdminPage />} />
            </Routes>
          </HostAppLayout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

function getModuleComponent(moduleName) {
  let ModuleComponent;

  switch (moduleName) {
      case 'adminApp':
        ModuleComponent = React.lazy(() => import('adminApp/Module'));
        break;



    default:
      ModuleComponent = () => (
        <div style={{ 
          padding: '48px', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '16px' 
        }}>
          Module "{moduleName}" not found
        </div>
      );
  }

  return ModuleComponent;
}
