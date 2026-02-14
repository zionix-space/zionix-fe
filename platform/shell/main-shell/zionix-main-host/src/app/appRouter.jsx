import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';
import { GlobalTopLoader, NotFoundPage } from '@zionix-space/design-system';
import availableApps from 'tools/deployment/zionix-main.modules.json';
import HostAppLayout from '../components/shell/layout/HostAppLayout';
import AppsRedirect from '../components/shell/layout/AppsRedirect';
import { ProfilePage } from '../pages/UserProfile';
import ErrorBoundary from '../components/common/ErrorBoundary';

const AuthApp = React.lazy(() => import('authApp/Module'));

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, z: -50 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: 50 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const RouteWithTransition = ({ element }) => {
  return <PageTransition>{element}</PageTransition>;
};

export function AppRouter() {
  const { isAuthenticated } = useAuthStore();

  function getModuleComponent(moduleName) {
    let ModuleComponent;

    switch (moduleName) {
      case 'adminApp':
        ModuleComponent = React.lazy(() => import('adminApp/Module'));
        break;






























































































































































































































































































































      default:
        ModuleComponent = () => <div>App not found</div>;
    }

    return ModuleComponent;
  }
  const excludedModule = 'authApp';

  return (
    <React.Suspense fallback={<GlobalTopLoader />}>
      <AnimatePresence mode="popLayout">
        <div>
          <Routes>
            {/* Root path - redirect based on auth status */}
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <Navigate to="/apps" replace />
                ) : (
                  <React.Suspense fallback={<GlobalTopLoader />}>
                    <RouteWithTransition element={<AuthApp />} />
                  </React.Suspense>
                )
              }
            />

            {/* Apps routes - protected */}
            <Route
              path="/apps"
              element={
                isAuthenticated ? (
                  <HostAppLayout />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            >
              {/* Default /apps route - redirect to first menu */}
              <Route index element={<AppsRedirect />} />

              {/* Profile route - accessible from all apps */}
              <Route
                path="profile"
                element={
                  <ErrorBoundary>
                    <ProfilePage />
                  </ErrorBoundary>
                }
              />

              {availableApps
                .filter((moduleName) => moduleName !== excludedModule)
                .map((moduleName) => {
                  const ModuleComponent = getModuleComponent(moduleName);

                  return (
                    <Route
                      key={moduleName}
                      path={`${moduleName}/*`}
                      element={
                        <ErrorBoundary>
                          <React.Suspense fallback={<GlobalTopLoader />}>
                            <ModuleComponent />
                          </React.Suspense>
                        </ErrorBoundary>
                      }
                    />
                  );
                })}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Catch all - redirect to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AnimatePresence>
    </React.Suspense>
  );
}

export default AppRouter;
