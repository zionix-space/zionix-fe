import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GlobalTopLoader } from '@zionix/shared-utilities/components';
import { NotFoundPage } from '@zionix/shared-utilities/components';

const MenuManagementScreen = lazy(() => import('../pages/MenuManagement'));
const RoleManagementScreen = lazy(() => import('../pages/RoleManagement'));

export function App() {
  return (
    <Suspense fallback={<GlobalTopLoader />}>
      <Routes>
        {/* Menu Management Screen */}
        <Route path="app-setup/menus" element={<MenuManagementScreen />} />
        {/* Role Management Screen */}
        <Route path="user-roles-setup/roles" element={<RoleManagementScreen />} />
        {/* 404 Not Found - Wildcard route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
