import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GlobalTopLoader } from '@zionix/shared-utilities/components';
import { NotFoundPage } from '@zionix/shared-utilities/components';

const MenuManagementScreen = lazy(() => import('../pages/MenuManagement'));

export function App() {
  return (
    <Suspense fallback={<GlobalTopLoader />}>
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
