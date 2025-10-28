import React, { useState } from 'react';
import { useTheme } from '@zionix/design-system';
import { useMenuStore } from '../../../../data/stores/menu/useMenuStore';
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
  const { selectedSidebarKey, setSelectedSidebarKey, mainMenus } = useMenuStore();
  const { deviceType } = useResponsiveLayout();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // Use enhanced theme with responsive tokens
  const { token } = useTheme();
  const styles = useStyles(token);

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  // Get navigation items from the same source as desktop sidebar
  const mainNavItems = mainMenus || [];
  
  // Take first 4 items and add "More" button
  const navigationItems = [
    ...mainNavItems.slice(0, 4),
    { key: 'more', label: 'More', icon: 'ri-menu-line' }
  ];

  const handleItemClick = (item) => {
    if (item.key === 'more') {
      setIsMoreMenuOpen(true);
    } else {
      setSelectedSidebarKey(item.key);
      if (onItemSelect) {
        onItemSelect(item);
      }
    }
  };

  const renderNavigationItem = (item) => {
    const isActive = selectedSidebarKey === item.key;
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
        menuItems={mainMenus}
        selectedKey={selectedSidebarKey}
        onItemSelect={setSelectedSidebarKey}
      />
    </>
  );
};

export default MobileBottomNavigation;