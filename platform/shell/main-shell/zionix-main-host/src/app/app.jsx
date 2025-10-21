import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Simple dummy component for the host app
const HostDummyComponent = () => {
  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
 
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        This is the main host application
      </p>

      <div style={{ marginTop: '30px' }}>
        <Link
          to="/admin-app"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007acc',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '16px',
          }}
        >
          Go to Admin App
        </Link>
      </div>
    </div>
  );
};

// Lazy load the admin remote app
const AdminApp = React.lazy(() => import('adminApp/Module'));

// Admin page component that loads the remote app
const AdminPage = () => {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/"
          style={{
            padding: '8px 16px',
            backgroundColor: '#666',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '14px',
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HostDummyComponent />} />
        <Route path="/admin-app" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Auto-generated Module Federation switch statement
// eslint-disable-next-line no-unused-vars
function getModuleComponent(moduleName) {
  let ModuleComponent;

  switch (moduleName) {
      case 'adminApp':
        ModuleComponent = React.lazy(() => import('adminApp/Module'));
        break;














    default:
      ModuleComponent = function NotFoundComponent() {
        return <div>Module &apos;{moduleName}&apos; not found</div>;
      };
  }

  return ModuleComponent;
}
