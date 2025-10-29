import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import availableApps from 'tools/deployment/zionix-main.modules.json';
import HostAppLayout from '../components/shell/layout/HostAppLayout';
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
    <React.Suspense fallback={null}>
      <AnimatePresence mode="popLayout">
        <div>
          <Routes>
            <Route
              path="/"
              element={<RouteWithTransition element={<AuthApp />} />}
            />

            <Route path="/*" element={<HostAppLayout />}>
              {availableApps
                .filter((moduleName) => moduleName !== excludedModule) // Exclude mainAuthApp
                .map((moduleName) => {
                  const ModuleComponent = getModuleComponent(moduleName);

                  return (
                    <Route
                      key={moduleName}
                      path={`${moduleName}/*`}
                      element={<ModuleComponent />}
                    />
                  );
                })}
              <Route path="*" element={<div>App does not exist</div>} />
            </Route>
          </Routes>
        </div>
      </AnimatePresence>
    </React.Suspense>
  );
}

export default AppRouter;
