import React, { useState } from 'react';
import { theme } from 'antd';
import { useMenuData } from '../shared/MenuDataProvider';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import MobileMoreMenu from './MobileMoreMenu';
import { useStyles } from './MobileBottomNavigation.style';

const { useToken } = theme;

/**
 * Mobile Bottom Navigation Component - Clean bottom navigation matching screenshot
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
  const { selectedKey, handleMenuSelect, menuItems, openKeys, handleOpenChange } = useMenuData();
  const { deviceType } = useResponsiveLayout();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const { token } = useToken();
  const styles = useStyles(token);

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  // Fixed navigation items matching the screenshot exactly
  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { key: 'products', label: 'Products', icon: 'ri-shopping-bag-line' },
    { key: 'calendar', label: 'Calendar', icon: 'ri-calendar-line' },
    { key: 'my-tasks', label: 'My Tasks', icon: 'ri-task-line' },
    { key: 'more', label: 'More', icon: 'ri-menu-line' }
  ];

  const handleItemClick = (item) => {
    if (item.key === 'more') {
      setIsMoreMenuOpen(true);
    } else {
      handleMenuSelect(item.key);
      if (onItemSelect) {
        onItemSelect(item);
      }
    }
  };

  const handleMoreMenuClose = () => {
    setIsMoreMenuOpen(false);
  };

  const renderNavItem = (item) => {
    const isActive = selectedKey === item.key;
    const isMoreItem = item.key === 'more';

    return (
      <div
        key={item.key}
        className="mobile-nav-item"
        onClick={() => handleItemClick(item)}
        style={styles.navItemStyle}
      >
        {/* Icon container */}
        <div
          style={{
            ...styles.iconContainerStyle,
            backgroundColor: isActive && !isMoreItem
              ? `${token.colorPrimary}15` 
              : 'transparent'
          }}
        >
          <i 
            className={item.icon}
            style={{
              ...styles.iconStyle,
              color: isActive && !isMoreItem
                ? token.colorPrimary
                : token.colorTextSecondary
            }}
          />
        </div>

        {/* Label */}
        <span
          style={{
            ...styles.labelStyle,
            fontWeight: isActive && !isMoreItem ? '600' : '500',
            color: isActive && !isMoreItem
              ? token.colorPrimary
              : token.colorTextSecondary
          }}
        >
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <>
      <nav
        className={`mobile-bottom-navigation ${className}`}
        style={{
          ...styles.navigationContainerStyle,
          ...style
        }}
      >
        {/* Render all navigation items */}
        {navigationItems.map((item) => renderNavItem(item))}
      </nav>

      {/* More Menu Modal */}
      {isMoreMenuOpen && (
        <MobileMoreMenu
          isOpen={isMoreMenuOpen}
          onClose={handleMoreMenuClose}
          menuItems={menuItems}
          selectedKey={selectedKey}
          onItemSelect={(item) => {
            handleMenuSelect(item.key);
            if (onItemSelect) {
              onItemSelect(item);
            }
            handleMoreMenuClose();
          }}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
        />
      )}
    </>
  );
};

export default MobileBottomNavigation;