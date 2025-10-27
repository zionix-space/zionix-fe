import React, { useState } from 'react';
import { useTheme } from '@zionix/design-system';
import { useMenuData } from '../shared/MenuDataProvider';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import MobileMoreMenu from './MobileMoreMenu';
import { useStyles } from './MobileBottomNavigation.style';

/**
 * Mobile Bottom Navigation Component - Clean bottom navigation with responsive tokens
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
  
  // Use enhanced theme with responsive tokens
  const { token } = useTheme();
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

  const renderNavigationItem = (item) => {
    const isActive = selectedKey === item.key;
    const isMoreItem = item.key === 'more';

    return (
      <div
        key={item.key}
        style={styles.navItemStyle}
        onClick={() => handleItemClick(item)}
        className={`nav-item ${isActive ? 'active' : ''} ${isMoreItem ? 'more-item' : ''}`}
      >
        {/* Icon container */}
        <div style={styles.iconContainerStyle}>
          <i 
            className={`${item.icon}`}
            style={isActive ? styles.activeIconStyle : styles.inactiveIconStyle}
          />
        </div>
        
        {/* Label */}
        <span 
          style={isActive ? styles.activeLabelStyle : styles.inactiveLabelStyle}
        >
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Main Navigation Container */}
      <nav 
        style={{
          ...styles.navigationContainerStyle,
          ...style
        }}
        className={`mobile-bottom-navigation ${className}`}
      >
        {navigationItems.map(renderNavigationItem)}
      </nav>

      {/* More Menu Overlay */}
      <MobileMoreMenu
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        menuItems={menuItems}
        selectedKey={selectedKey}
        openKeys={openKeys}
        onItemSelect={handleMenuSelect}
        onOpenChange={handleOpenChange}
      />
    </>
  );
};

export default MobileBottomNavigation;