import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@zionix/design-system";
import HostAppLayout from "../components/shell/layout/HostAppLayout";

// Simple dummy component for the host app
const HostDummyComponent = () => {
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
      }}
    >
      {/* <h1 style={{ marginBottom: "20px" }}>Welcome to Zionix Main Shell</h1>
      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        This is the main host application with Buffer-like layout
      </p> */}

      <div>
        <Link
          to="/admin-app"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1890ff",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Go to Admin App
        </Link>
      </div>
    </div>
  );
};

// Lazy load the admin remote app
const AdminApp = React.lazy(() => import("adminApp/Module"));

// Admin page component that loads the remote app
const AdminPage = () => {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/"
          style={{
            padding: "8px 16px",
            backgroundColor: "#666",
            color: "white",
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
            <Route path="/" element={<HostDummyComponent />} />
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
    case "adminApp":
      ModuleComponent = React.lazy(() => import("adminApp/Module"));
      break;

    default:
      ModuleComponent = () => <div>Module not found</div>;
  }

  return ModuleComponent;
}
