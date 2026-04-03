import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GlobalTopLoader, NotFoundPage } from '@zionix-space/design-system';

const MenuManagementScreen = lazy(() => import('../pages/MenuManagement'));
const RoleManagementScreen = lazy(() => import('../pages/RoleManagement'));
const FormManagementScreen = lazy(() => import('../pages/FormManagement'));
const DomainManagementScreen = lazy(() => import('../pages/DomainManagement'));
const WorkfFlowManagementScreen = lazy(() => import('../pages/WorkFlowManagement'));
const KitchenSink = lazy(() => import('../pages/KitchenSink/KitchenSinkScreen'));

export function App() {
  return (
    <Suspense fallback={<GlobalTopLoader />}>
      <Routes>
        {/* Kitchen Sink - Component Showcase */}
        <Route path="app-Configuration/sink" element={<KitchenSink />} />
        {/* Menu Management Screen */}
        <Route path="app-Configuration/menus" element={<MenuManagementScreen />} />
        {/* Domain Management Screen */}
        <Route path="app-Configuration/domains" element={<DomainManagementScreen />} />
        {/* Role Management Screen */}
        <Route path="user-management/roles" element={<RoleManagementScreen />} />
        {/* Form Management Screen */}
        <Route path="app-Configuration/forms" element={<FormManagementScreen />} />
        {/* Workflow Management Screen */}
        <Route path="integration-settings/workflows" element={<WorkfFlowManagementScreen />} />
        {/* 404 Not Found - Wildcard route */}
        <Route
          path="*"
          element={
            <Suspense fallback={<GlobalTopLoader />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
