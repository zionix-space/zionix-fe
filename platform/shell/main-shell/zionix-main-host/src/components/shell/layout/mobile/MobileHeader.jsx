import React from 'react';
import { Avatar, Badge, Button } from 'antd';
import { useTheme } from '@zionix/design-system';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';

/**
 * Mobile Header Component - iOS-style header for mobile layout
 * @param {Object} props - Component props
 * @param {Function} [props.onMenuToggle] - Function to handle menu toggle
 * @param {boolean} [props.showMenuButton=true] - Whether to show the menu button
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {Object} [props.style={}] - Additional inline styles
 */
const MobileHeader = ({ 
  onMenuToggle, 
  showMenuButton = true,
  className = '',
  style = {} 
}) => {
  const themeResult = useTheme();
  const token = themeResult?.token;
  
  // Fallback colors if theme tokens are not available
  const fallbackColors = {
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9d9',
    colorText: '#000000',
    colorTextSecondary: '#666666',
    colorPrimary: '#1677ff',
    colorWhite: '#ffffff'
  };
  
  // Debug logging
  if (!token) {
    console.warn('MobileHeader: Theme tokens not available, using fallback colors');
  }
  
  const { deviceType } = useResponsiveLayout();

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  return (
    <header 
      className={`mobile-header ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        backgroundColor: token?.colorBgContainer || fallbackColors.colorBgContainer,
        borderBottom: `1px solid ${token?.colorBorder || fallbackColors.colorBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        ...style
      }}
    >
      {/* Left Section - Menu Button (if enabled) */}
      <div className="mobile-header-left" style={{ display: 'flex', alignItems: 'center' }}>
        {showMenuButton && (
          <Button
            type="text"
            icon={<i className="ri-menu-line" />}
            onClick={onMenuToggle}
            style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: token?.colorTextSecondary || fallbackColors.colorTextSecondary
            }}
            aria-label="Toggle menu"
          />
        )}
      </div>

      {/* Center Section - Logo and Brand */}
      <div 
        className="mobile-header-center" 
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          marginLeft: showMenuButton ? '-44px' : '0' // Center logo when menu button is present
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: token?.colorPrimary || fallbackColors.colorPrimary,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: token?.colorWhite || fallbackColors.colorWhite,
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Z
          </div>
          <span
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: token?.colorText || fallbackColors.colorText,
              letterSpacing: '-0.5px'
            }}
          >
            Zionix
          </span>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div 
        className="mobile-header-right" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px' 
        }}
      >
        {/* Notifications */}
        <Button
          type="text"
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: token?.colorTextSecondary || fallbackColors.colorTextSecondary
          }}
          aria-label="Notifications"
        >
          <Badge count={3} size="small" offset={[4, -4]}>
            <i className="ri-notification-3-line" />
          </Badge>
        </Button>

        {/* Profile */}
        <Button
          type="text"
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0'
          }}
          aria-label="Profile"
        >
          <Avatar 
            size={32} 
            icon={<i className="ri-user-3-line" />}
            style={{ 
              backgroundColor: '#f56a00',
              fontSize: '14px'
            }}
          />
        </Button>
      </div>
    </header>
  );
};

export default MobileHeader;