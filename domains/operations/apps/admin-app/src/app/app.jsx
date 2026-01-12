import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';
import { NotFoundPage } from '@zionix/shared-utilities/components';

const MenuManagementScreen = lazy(() => import('../pages/MenuManagement'));

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
        {/* Menu Management Screen */}
        <Route path="app-setup/menus" element={<MenuManagementScreen />} />

        {/* 404 Not Found - Wildcard route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
