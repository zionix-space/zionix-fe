import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';
import { GlobalTopLoader, NotFoundPage } from '@zionix-space/design-system';
import availableApps from 'tools/deployment/zionix-main.modules.json';
import HostAppLayout from '../components/shell/layout/HostAppLayout';
import AppsRedirect from '../components/shell/layout/AppsRedirect';
import { ProfilePage } from '../pages/UserProfile';
import ErrorBoundary from '../components/common/ErrorBoundary';

const AuthApp = React.lazy(() => import('authApp/Module'));

// Modern, smooth page transition with AI-powered feel
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth feel
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Smooth content fade-in
const contentVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

const ContentWrapper = ({ children }) => {
  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="animate"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export function AppRouter() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // Remove HTML loader with smooth transition
    const timer = setTimeout(() => {
      const htmlLoader = document.getElementById("html-loader");
      if (htmlLoader) {
        htmlLoader.style.opacity = "0";
        htmlLoader.style.transition = "opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)";
        setTimeout(() => {
          htmlLoader.remove();
          setIsInitialized(true);
        }, 400);
      } else {
        setIsInitialized(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Root path - redirect based on auth status */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <Navigate to="/apps" replace />
              ) : (
                <PageTransition>
                  <React.Suspense fallback={<GlobalTopLoader />}>
                    <AuthApp />
                  </React.Suspense>
                </PageTransition>
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
                  <ContentWrapper>
                    <ProfilePage />
                  </ContentWrapper>
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
                          <ContentWrapper>
                            <ModuleComponent />
                          </ContentWrapper>
                        </React.Suspense>
                      </ErrorBoundary>
                    }
                  />
                );
              })}
            <Route
              path="*"
              element={
                <ContentWrapper>
                  <NotFoundPage />
                </ContentWrapper>
              }
            />
          </Route>

          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </React.Suspense>
  );
}

export default AppRouter;
