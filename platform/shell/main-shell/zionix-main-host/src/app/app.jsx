import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, useTheme } from "@zionix/design-system";
import HostAppLayout from "../components/shell/layout/HostAppLayout";

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
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          ← Back to Host
        </Link>
      </div>

      <React.Suspense fallback={<div>Loading Admin App...</div>}>
        <AdminApp />
      </React.Suspense>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <HostAppLayout>
          <Routes>
            <Route path="/admin-app" element={<AdminPage />} />
          </Routes>
        </HostAppLayout>
      </BrowserRouter>
    </ThemeProvider>
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
      ModuleComponent = () => <div>Module not found</div>;
  }

  return ModuleComponent;
}
