import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';

// Lazy load heavy components to reduce initial bundle size
const FormBuilderLibrary = React.lazy(() => import('../pages/FormSetup/Formbuilder/core'));
const MenuBuilder = React.lazy(() => import('../pages/MenuSetup'));

export function DashboardAdmin() {
  return <b>Admin Dashboard</b>;
}

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh' 
  }}>
    <Spin size="large" />
  </div>
);

export function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route exact path="/form-setup" element={<FormBuilderLibrary />} />
        <Route exact path="/menu-setup" element={<MenuBuilder />} />
      </Routes>
    </Suspense>
  );
}
export default App;
