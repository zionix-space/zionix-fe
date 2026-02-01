import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GlobalTopLoader, NotFoundPage } from '@zionix-space/design-system';

const MenuManagementScreen = lazy(() => import('../pages/MenuManagement'));
const RoleManagementScreen = lazy(() => import('../pages/RoleManagement'));
const FormManagementScreen = lazy(() => import('../pages/FormManagement'));
const KitchenSink = lazy(() => import('../pages/KitchenSink/KitchenSinkScreen'));

export function App() {
  return (
    <Suspense fallback={<GlobalTopLoader />}>
      <Routes>
        {/* Kitchen Sink - Component Showcase */}
        <Route path="app-setup/sink" element={<KitchenSink />} />
        {/* Menu Management Screen */}
        <Route path="app-setup/menus" element={<MenuManagementScreen />} />
        {/* Role Management Screen */}
        <Route path="user-roles-setup/roles" element={<RoleManagementScreen />} />
        {/* Form Management Screen */}
        <Route path="app-setup/forms" element={<FormManagementScreen />} />
        {/* 404 Not Found - Wildcard route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
