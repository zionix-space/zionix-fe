import React from 'react';
import { theme } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import { useMenuData } from '../../../../data/hooks/menu';
import { QueryErrorFallback } from '../../../common/QueryErrorBoundary';
import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
import MobileHeader from './MobileHeader';
import MobileBottomNavigation from './MobileBottomNavigation';
import TopLoadingBar from '../../../common/loaders/TopLoadingBar';
import { useStyles } from './MobileLayout.style';

const { useToken } = theme;

/**
 * Mobile Layout Component - Clean and simple mobile layout
 * Unified solid background matching header
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class
 * @param {Object} [props.style={}] - Additional inline styles
 */
const MobileLayout = ({ className = '', style = {} }) => {
  const { token } = useToken();
  const styles = useStyles(token);
  const location = useLocation();

  const { deviceType } = useResponsiveLayout();
  const { isError, error } = useMenuData();

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  // Show error fallback if menu loading failed
  if (isError) {
    return <QueryErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
  }

  return (
    <>
      {/* Global Top Loading Bar */}
      <TopLoadingBar />

      <div
        className={`mobile-layout ${className}`}
        style={{
          ...styles.layoutContainerStyle,
          ...style
        }}
      >
        {/* Mobile Header */}
        <MobileHeader />

        {/* Main Content Area */}
        <main
          className="mobile-content"
          style={styles.mainContentStyle}
        >
          <AnimatePresence mode="wait">
            <PageTransitionWrapper
              key={location.pathname}
              style={styles.contentWrapperStyle}
            >
              <Outlet />
            </PageTransitionWrapper>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNavigation />
      </div>
    </>
  );
};

export default MobileLayout;