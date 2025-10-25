import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@zionix/design-system';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import MobileHeader from './MobileHeader';
import MobileBottomNavigation from './MobileBottomNavigation';

const MobileLayout = ({ children, className = '', style = {} }) => {
  const themeResult = useTheme();
  const token = themeResult?.token;
  const isDarkMode = themeResult?.isDarkMode;
  
  // Theme-aware fallback colors
  const fallbackColors = isDarkMode ? {
    // Dark mode fallbacks
    colorBgLayout: '#141414',
    colorBgContainer: '#1f1f1f',
    colorBgMask: 'rgba(0, 0, 0, 0.7)',
    colorBgElevated: '#1f1f1f',
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6'
  } : {
    // Light mode fallbacks
    colorBgLayout: '#f5f5f5',
    colorBgContainer: '#ffffff',
    colorBgMask: 'rgba(0, 0, 0, 0.5)',
    colorBgElevated: '#ffffff',
    colorText: '#000000',
    colorTextSecondary: '#666666'
  };
  
  // Debug logging
  if (!token) {
    console.warn('MobileLayout: Theme tokens not available, using fallback colors for', isDarkMode ? 'dark' : 'light', 'mode');
  }
  
  const { deviceType, mobileMenuOpen, setMobileMenuOpen } = useResponsiveLayout();

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div 
      className={`mobile-layout ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: token?.colorBgLayout || fallbackColors.colorBgLayout,
        ...style
      }}
    >
      {/* Mobile Header */}
      <MobileHeader 
        onMenuToggle={handleMenuToggle}
        showMenuButton={false} // We'll use bottom nav instead
      />

      {/* Main Content Area */}
      <main
        className="mobile-content"
        style={{
          flex: 1,
          marginTop: '56px', // Header height
          marginBottom: '80px', // Bottom navigation height
          overflow: 'auto',
          padding: '16px',
          backgroundColor: token?.colorBgContainer || fallbackColors.colorBgContainer,
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />

      {/* Mobile Menu Overlay (for future implementation) */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: token?.colorBgMask || fallbackColors.colorBgMask,
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: token?.colorBgElevated || fallbackColors.colorBgElevated,
              borderRadius: '16px',
              padding: '24px',
              margin: '20px',
              maxWidth: '300px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: token?.colorText || fallbackColors.colorText }}>
              Menu
            </h3>
            <p style={{ margin: 0, color: token?.colorTextSecondary || fallbackColors.colorTextSecondary }}>
              Mobile menu implementation coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

MobileLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default MobileLayout;