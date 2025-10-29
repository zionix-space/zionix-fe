import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@zionix/design-system';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import DesktopTopBar from './DesktopTopBar';
import DesktopSidebar from './DesktopSidebar';

const { Content } = Layout;

/**
 * Desktop Layout Component - Provides desktop-specific layout structure with sidebar and top bar
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class
 * @param {Object} [props.style={}] - Additional inline styles
 */
const DesktopLayout = ({ className = '', style = {} }) => {
  const { token } = useTheme();

  const { sidebarCollapsed, setSidebarCollapsed, screenWidth } =
    useResponsiveLayout();

  // Responsive sidebar behavior for tablet screens
  const isTabletSize = screenWidth >= 768 && screenWidth < 1024;
  const sidebarWidth = sidebarCollapsed ? 80 : isTabletSize ? 200 : 256;
  const contentPadding = isTabletSize ? '16px' : '24px';

  return (
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
      <Layout style={{ marginTop: '64px' }}>
        {/* Desktop Sidebar */}
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
              backgroundColor: token?.colorBgLayout,
              overflow: 'auto',
              height: 'calc(100vh - 64px)',
            }}
          >
            {/* Content Container */}
            <div
              style={{
                backgroundColor: token?.colorBgContainer,
                borderRadius: token?.borderRadiusLG,
                padding: contentPadding,
                minHeight: '100%',
                boxShadow: `0 2px 8px ${token?.colorBorder}20`,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DesktopLayout;
