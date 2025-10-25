import React, { useState } from 'react';
import { Badge } from 'antd';
import { useMenuData } from '../shared/MenuDataProvider';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import MobileMoreMenu from './MobileMoreMenu';

/**
 * Mobile Bottom Navigation Component - Provides bottom navigation bar for mobile devices
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class
 * @param {Object} [props.style={}] - Additional inline styles
 * @param {Function} [props.onItemSelect] - Callback function when navigation item is selected
 */
const MobileBottomNavigation = ({ 
  className = '',
  style = {},
  onItemSelect 
}) => {
  const { getFlatMenuItems, selectedKey, handleMenuSelect, menuItems, openKeys, setOpenKeys, handleOpenChange } = useMenuData();
  const { deviceType } = useResponsiveLayout();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  const allMenuItems = getFlatMenuItems();
  
  // Define the 3 main items to show in bottom nav (native iOS style)
  const mainMenuItems = allMenuItems.slice(0, 3); // Dashboard, Products, Calendar
  // For More menu, use the complete menu structure instead of just remaining items
  const moreMenuItems = menuItems; // Complete menu structure with hierarchy

  const handleItemClick = (item) => {
    handleMenuSelect(item.key);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const handleMoreClick = () => {
    setIsMoreMenuOpen(true);
  };

  const handleMoreMenuClose = () => {
    setIsMoreMenuOpen(false);
  };

  const handleMoreItemSelect = (item) => {
    handleItemClick(item);
  };

  return (
    <>
      <nav 
        className={`mobile-bottom-navigation ${className}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '84px', // Slightly taller for native iOS feel
          backgroundColor: '#fff',
          borderTop: '0.5px solid #e5e7eb', // Thinner border like iOS
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 20px 20px', // More padding like iOS
          zIndex: 1000,
          boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow like iOS
          backdropFilter: 'blur(20px)', // iOS-style blur effect
          WebkitBackdropFilter: 'blur(20px)',
          ...style
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Main 3 Menu Items */}
        {mainMenuItems.map((item) => {
          const isActive = selectedKey === item.key || selectedKey.startsWith(item.key);
          
          return (
            <button
              key={item.key}
              className="mobile-nav-item"
              onClick={() => handleItemClick(item)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '6px 8px',
                minWidth: '44px', // iOS minimum touch target
                minHeight: '44px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease', // Faster transition like iOS
                position: 'relative',
                flex: 1,
                maxWidth: '80px',
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon with Badge */}
              <div 
                style={{ 
                  position: 'relative',
                  fontSize: '24px', // Larger icons like iOS
                  color: isActive ? '#007AFF' : '#8E8E93', // iOS blue and gray colors
                  transition: 'color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px',
                }}
              >
                {item.icon}
                {item.badge && (
                  <Badge 
                    count={item.badge} 
                    size="small"
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      fontSize: '10px',
                      minWidth: '16px',
                      height: '16px',
                      lineHeight: '16px',
                      backgroundColor: '#FF3B30', // iOS red
                      border: '1px solid #fff',
                    }}
                  />
                )}
              </div>

              {/* Label with iOS Typography */}
              <span
                style={{
                  fontSize: '10px', // iOS tab bar font size
                  fontWeight: isActive ? '600' : '500', // Bold when active
                  color: isActive ? '#007AFF' : '#8E8E93',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif', // iOS system font
                  letterSpacing: '-0.01em', // iOS letter spacing
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More Button (3-dots) */}
        <button
          className="mobile-nav-more"
          onClick={handleMoreClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '6px 8px',
            minWidth: '44px',
            minHeight: '44px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            position: 'relative',
            flex: 1,
            maxWidth: '80px',
          }}
          aria-label="More options"
          aria-expanded={isMoreMenuOpen}
        >
          {/* More Icon */}
          <div 
            style={{ 
              fontSize: '24px',
              color: '#8E8E93', // iOS gray
              transition: 'color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2px',
            }}
          >
            <i className="ri-more-line" />
          </div>

          {/* More Label */}
          <span
            style={{
              fontSize: '10px',
              fontWeight: '500',
              color: '#8E8E93',
              transition: 'all 0.15s ease',
              textAlign: 'center',
              lineHeight: '1.2',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            More
          </span>
        </button>
      </nav>

      {/* More Menu Modal */}
      <MobileMoreMenu
        isOpen={isMoreMenuOpen}
        onClose={handleMoreMenuClose}
        menuItems={moreMenuItems}
        selectedKey={selectedKey}
        onItemSelect={handleMoreItemSelect}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      />
    </>
  );
};

export default MobileBottomNavigation;