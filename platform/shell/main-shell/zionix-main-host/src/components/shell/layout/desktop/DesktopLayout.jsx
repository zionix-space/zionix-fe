import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { useTheme } from '@zionix/design-system';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import DesktopTopBar from './DesktopTopBar';
import DesktopSidebar from './DesktopSidebar';

const { Content } = Layout;

const DesktopLayout = ({ children, className = '', style = {} }) => {
  const themeResult = useTheme();
  const token = themeResult?.token;
  const isDarkMode = themeResult?.isDarkMode;
  
  // Theme-aware fallback colors
  const fallbackColors = isDarkMode ? {
    // Dark mode fallbacks
    colorBgLayout: '#141414',
    colorBgContainer: '#1f1f1f',
    colorBorder: '#434343'
  } : {
    // Light mode fallbacks
    colorBgLayout: '#f5f5f5',
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9d9'
  };
  
  // Debug logging
  if (!token) {
    console.warn('DesktopLayout: Theme tokens not available, using fallback colors for', isDarkMode ? 'dark' : 'light', 'mode');
  }
  
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed,
    screenWidth 
  } = useResponsiveLayout();

  // Responsive sidebar behavior for tablet screens
  const isTabletSize = screenWidth >= 768 && screenWidth < 1024;
  const sidebarWidth = sidebarCollapsed ? 80 : (isTabletSize ? 200 : 256);
  const contentPadding = isTabletSize ? '16px' : '24px';

  return (
    <Layout 
      className={`desktop-layout ${className}`}
      style={{
        height: '100vh',
        overflow: 'hidden',
        ...style
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
            marginLeft: `${sidebarWidth}px`,
            transition: 'margin-left 0.3s ease'
          }}
        >
          <Content
            className="desktop-content"
            style={{
              padding: contentPadding,
              backgroundColor: token?.colorBgLayout || fallbackColors.colorBgLayout,
              overflow: 'auto',
              height: 'calc(100vh - 64px)'
            }}
          >
            {/* Content Container */}
            <div
              style={{
                backgroundColor: token?.colorBgContainer || fallbackColors.colorBgContainer,
                borderRadius: '8px',
                padding: contentPadding,
                minHeight: '100%',
                boxShadow: `0 2px 8px ${token?.colorBorder || fallbackColors.colorBorder}20`
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

DesktopLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default DesktopLayout;