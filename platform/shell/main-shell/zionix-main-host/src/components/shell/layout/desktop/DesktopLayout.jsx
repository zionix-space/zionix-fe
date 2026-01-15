import React from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '@zionix/design-system';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import { useMenuData } from '../../../../data/hooks/menu';
import { QueryErrorFallback } from '../../../common/QueryErrorBoundary';
import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
import DesktopTopBar from './DesktopTopBar';
import DesktopSidebar from './DesktopSidebar';
import TopLoadingBar from '../../../common/loaders/TopLoadingBar';
import { DynamicBreadcrumb } from '../../../Breadcrumb';

const { Content } = Layout;

/**
 * Desktop Layout Component - Provides desktop-specific layout structure with sidebar and top bar
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class
 * @param {Object} [props.style={}] - Additional inline styles
 */
const DesktopLayout = ({ className = '', style = {} }) => {
  const { token, isDarkMode } = useTheme();
  const { isError, error } = useMenuData();
  const location = useLocation();

  const { sidebarCollapsed, setSidebarCollapsed, screenWidth } =
    useResponsiveLayout();

  // Show error fallback if menu loading failed - full screen takeover
  if (isError) {
    return <QueryErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
  }

  // Responsive sidebar behavior for tablet screens
  const isTabletSize = screenWidth >= 768 && screenWidth < 1024;
  // Use fixed sidebar widths that match DesktopSidebar component (260px expanded, 80px collapsed)
  // This ensures curve stays aligned even when zooming
  const sidebarWidth = sidebarCollapsed ? 80 : 260;
  const contentPadding = isTabletSize ? '16px' : '24px';

  // Match topbar background color
  const topbarColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.015)'
    : 'rgba(0, 0, 0, 0.015)';

  return (
    <>
      {/* Global Top Loading Bar */}
      <TopLoadingBar />

      <Layout
        className={`desktop-layout ${className}`}
        style={{
          height: '100vh',
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Desktop Top Bar */}
        <DesktopTopBar />

        {/* Desktop Layout Container */}
        <Layout style={{ position: 'relative' }}>
          {/* Curved Junction Element - creates inverse radius cutout where sidebar meets topbar */}
          <div
            style={{
              position: 'fixed',
              top: '52px',
              transform: "rotate(270deg)",
              insetInlineStart: `${sidebarWidth}px`,
              width: '32px',
              height: '32px',
              pointerEvents: 'none',
              zIndex: 1001,
              transition: 'inset-inline-start 0.2s ease',
              overflow: 'hidden',
            }}
          >
            {/* Create inverse curved cutout using radial gradient - bottom left curve */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                insetInlineStart: '0',
                width: '32px',
                height: '32px',
                background: `radial-gradient(circle at bottom left, transparent 32px, ${topbarColor} 32px)`,
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                WebkitMaskImage: 'radial-gradient(circle at bottom left, transparent 32px, black 32px)',
                maskImage: 'radial-gradient(circle at bottom left, transparent 32px, black 32px)',
              }}
            />
            {/* Add subtle border for visibility in dark mode */}
            {/* <div
              style={{
                position: 'absolute',
                top: '0',
                insetInlineStart: '0',
                width: '32px',
                height: '32px',
                background: `radial-gradient(circle at bottom left, transparent 30px, ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'} 30px, transparent 32px)`,
              }}
            /> */}
          </div>

          {/* Desktop Sidebar - Expandable/Collapsible */}
          <DesktopSidebar
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
          />

          {/* Desktop Main Content */}
          <Layout
            style={{
              marginInlineStart: `${sidebarWidth}px`,
              transition: 'margin-inline-start 0.3s ease',
            }}
          >
            <Content
              className="desktop-content"
              style={{
                backgroundColor: token?.colorBgContainer, // Clean, bright background for readability
                overflow: 'auto',
                height: 'calc(100vh - 52px)',
                minHeight: 'calc(100vh - 52px)',
              }}
            >
              {/* Dynamic Breadcrumb */}
              <DynamicBreadcrumb />

              {/* Page Content with Smooth Animation */}
              <AnimatePresence mode="wait">
                <PageTransitionWrapper
                  key={location.pathname}
                  style={{ padding: contentPadding }}
                >
                  <Outlet />
                </PageTransitionWrapper>
              </AnimatePresence>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default DesktopLayout;
