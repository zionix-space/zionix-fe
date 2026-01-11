import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@zionix/design-system';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import { useMenuData } from '../../../../data/hooks/menu';
import { QueryErrorFallback } from '../../../common/QueryErrorBoundary';
import DesktopTopBar from './DesktopTopBar';
import DesktopSidebar from './DesktopSidebar';
import TopLoadingBar from '../../../common/loaders/TopLoadingBar';

const { Content } = Layout;

/**
 * Desktop Layout Component - Provides desktop-specific layout structure with sidebar and top bar
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class
 * @param {Object} [props.style={}] - Additional inline styles
 */
const DesktopLayout = ({ className = '', style = {} }) => {
  const { token } = useTheme();
  const { isError, error } = useMenuData();

  const { sidebarCollapsed, setSidebarCollapsed, screenWidth } =
    useResponsiveLayout();

  // Show error fallback if menu loading failed - full screen takeover
  if (isError) {
    return <QueryErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
  }

  // Responsive sidebar behavior for tablet screens
  const isTabletSize = screenWidth >= 768 && screenWidth < 1024;
  const sidebarWidth = sidebarCollapsed ? 64 : isTabletSize ? 200 : 256;
  const contentPadding = isTabletSize ? '16px' : '24px';

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
        <Layout>
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
                padding: contentPadding,
                backgroundColor: token?.colorBgLayout, // Same as shell background - no wrapper
                overflow: 'auto',
                height: 'calc(100vh - 64px)',
              }}
            >
              {/* Direct content - no wrapper container */}
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default DesktopLayout;
