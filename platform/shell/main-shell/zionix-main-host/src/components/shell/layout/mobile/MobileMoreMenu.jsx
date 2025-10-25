import React, { useEffect, useRef } from 'react';
import { Badge, Menu } from 'antd';
import PropTypes from 'prop-types';
import { useTheme } from '@zionix/design-system';

const MobileMoreMenu = ({ 
  isOpen, 
  onClose, 
  menuItems, 
  selectedKey, 
  onItemSelect,
  openKeys,
  onOpenChange 
}) => {
  const themeResult = useTheme();
  const rawToken = themeResult?.token;
  
  // Comprehensive fallback values for all theme tokens used in this component
  const fallbackColors = {
    colorBgMask: 'rgba(0, 0, 0, 0.4)',
    colorBgElevated: '#ffffff',
    colorTextQuaternary: '#C7C7CC',
    colorBorder: '#d9d9d9',
    colorText: '#000000',
    colorTextTertiary: '#8E8E93',
    colorPrimaryBg: '#e6f7ff',
    colorPrimary: '#1677ff',
    colorBgTextHover: '#f5f5f5',
    colorFillQuaternary: '#f0f0f0',
    colorBgTextActive: '#e6f7ff'
  };
  
  // Create a safe token object with fallback values
  const token = {
    ...fallbackColors,
    ...rawToken
  };
  
  // Debug logging
  if (!rawToken) {
    console.warn('MobileMoreMenu: Theme tokens not available, using fallback colors');
  }
  
  const menuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (item) => {
    onItemSelect(item);
    onClose();
  };

  // Convert menu items to Ant Design Menu format
  const formatMenuItems = (items) => {
    return items.map(item => {
      const menuItem = {
        key: item.key,
        icon: item.icon,
        label: item.label,
      };

      if (item.children && item.children.length > 0) {
        menuItem.children = formatMenuItems(item.children);
      }

      return menuItem;
    });
  };

  const formattedMenuItems = formatMenuItems(menuItems);

  const handleMenuSelect = ({ key }) => {
    // Find the selected item in the menu structure
    const findMenuItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) {
          return item;
        }
        if (item.children) {
          const found = findMenuItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedItem = findMenuItem(menuItems, key);
    if (selectedItem) {
      handleItemClick(selectedItem);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with iOS-style blur */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: token.colorBgMask,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 1999,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Container with native iOS styling */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: token.colorBgElevated,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          zIndex: 2000,
          maxHeight: '70vh',
          overflow: 'hidden',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="More menu options"
      >
        {/* Handle Bar - iOS style */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '12px 0 8px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '5px',
              backgroundColor: token.colorTextQuaternary,
              borderRadius: '3px',
            }}
          />
        </div>

        {/* Header with iOS typography */}
        <div
          style={{
            padding: '0 24px 20px',
            borderBottom: `0.5px solid ${token.colorBorder}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: token.colorText,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            More
          </h3>
        </div>

        {/* Menu Items with Ant Design Menu component */}
        <div
          style={{
            padding: '0 0 32px',
            maxHeight: 'calc(70vh - 140px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
          }}
        >
          <div className="mobile-more-menu-container">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              onSelect={handleMenuSelect}
              items={formattedMenuItems}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '17px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
              }}
              theme="light"
              expandIcon={({ isOpen }) => (
                <i 
                  className={`ri-arrow-${isOpen ? 'down' : 'right'}-s-line`}
                  style={{
                    fontSize: '16px',
                    color: token.colorTextTertiary,
                    transition: 'transform 0.2s ease',
                  }}
                />
              )}
            />
          </div>
          
          <style dangerouslySetInnerHTML={{
            __html: `
              .mobile-more-menu-container .ant-menu-inline .ant-menu-item,
              .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title {
                height: 56px !important;
                line-height: 56px !important;
                padding: 0 24px !important;
                margin: 0 !important;
                border-bottom: 0.5px solid ${token.colorBorder} !important;
                font-size: 17px !important;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;
                letter-spacing: -0.01em !important;
                border-radius: 0 !important;
                color: ${token.colorText} !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-item:last-child,
              .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu:last-child .ant-menu-submenu-title {
                border-bottom: none !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-item-selected {
                background-color: ${token.colorPrimaryBg} !important;
                color: ${token.colorPrimary} !important;
                font-weight: 600 !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-item:hover,
              .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title:hover {
                background-color: ${token.colorBgTextHover} !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-item-icon,
              .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title .ant-menu-item-icon {
                font-size: 24px !important;
                color: ${token.colorTextTertiary} !important;
                margin-right: 16px !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-item-selected .ant-menu-item-icon,
              .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-selected .ant-menu-submenu-title .ant-menu-item-icon {
                color: ${token.colorPrimary} !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-arrow {
                right: 24px !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-sub {
                background-color: ${token.colorFillQuaternary} !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-sub .ant-menu-item {
                padding-left: 64px !important;
                background-color: ${token.colorFillQuaternary} !important;
                border-bottom: 0.5px solid ${token.colorBorder} !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-sub .ant-menu-item:hover {
                background-color: ${token.colorBgTextHover} !important;
              }
              
              .mobile-more-menu-container .ant-menu-inline .ant-menu-sub .ant-menu-item-selected {
                background-color: ${token.colorBgTextActive} !important;
                color: ${token.colorPrimary} !important;
                font-weight: 600 !important;
              }
            `
          }} />
        </div>

        {/* Safe area padding for devices with home indicator */}
        <div
          style={{
            height: 'env(safe-area-inset-bottom, 0px)',
            backgroundColor: token.colorBgElevated,
          }}
        />
      </div>
    </>
  );
};

MobileMoreMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menuItems: PropTypes.array.isRequired,
  selectedKey: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func.isRequired,
  openKeys: PropTypes.array,
  onOpenChange: PropTypes.func,
};

export default MobileMoreMenu;