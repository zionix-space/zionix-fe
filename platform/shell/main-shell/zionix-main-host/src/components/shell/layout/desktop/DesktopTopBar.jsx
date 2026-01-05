import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Badge,
  Space,
  theme,
  ColorPicker,
  Tooltip,
} from 'antd';
// Using Remix Icons CSS classes for better performance
import { useTheme, ZionixLogo } from '@zionix/design-system';
import { useStyles } from './DesktopTopBar.style';
import { useMenuStore } from '../../../../data/stores/menu/useMenuStore';
import { fetchMenuData } from '../../../../data/dummy/menuData';
import { NotificationDropdown } from '../shared/NotificationDropdown';

const { Header } = Layout;
const { useToken } = theme;

const AppTopBar = () => {
  const { token } = useToken();
  const {
    isDarkMode,
    toggleTheme,
    isRTL,
    toggleRTL,
    primaryColor,
    setPrimaryColor,
  } = useTheme();
  const styles = useStyles(token);

  // Inject CSS to override Ant Design Menu default styles - use useLayoutEffect for instant application
  useLayoutEffect(() => {
    const styleId = 'topbar-menu-override';
    // Remove existing style if it exists
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style with current token values
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Remove all borders and underlines from menu items */
        .ant-menu-horizontal > .ant-menu-item::after,
        .ant-menu-horizontal > .ant-menu-item-selected::after,
        .ant-menu-horizontal > .ant-menu-item-active::after,
        .ant-menu-horizontal > .ant-menu-submenu::after {
          border-bottom: none !important;
          display: none !important;
          content: none !important;
          height: 0 !important;
          width: 0 !important;
        }
        
        .ant-menu-horizontal > .ant-menu-item,
        .ant-menu-horizontal > .ant-menu-item-selected,
        .ant-menu-horizontal > .ant-menu-item-active,
        .ant-menu-horizontal > .ant-menu-submenu {
          border-bottom: none !important;
        }

        .ant-menu-horizontal::before,
        .ant-menu-horizontal::after {
          display: none !important;
        }

        .ant-menu-horizontal {
          border-bottom: none !important;
        }

        /* Topbar menu selected item - force primary background */
        .ant-menu-horizontal .ant-menu-item,
        .ant-menu-horizontal > .ant-menu-item {
          padding: 0 16px !important;
          margin: 0 2px !important;
          height: 28px !important;
          line-height: 28px !important;
          border-radius: 14px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-size: 14px !important;
          font-weight: 500 !important;
        }

        .ant-menu-horizontal .ant-menu-item-selected,
        .ant-menu-horizontal > .ant-menu-item-selected,
        .ant-menu.ant-menu-horizontal .ant-menu-item-selected {
          background-color: ${token.colorPrimary} !important;
          color: ${token.colorWhite} !important;
          font-weight: 600 !important;
          border-radius: 14px !important;
          padding: 0 16px !important;
          box-shadow: 0 2px 8px ${token.colorPrimary}30, inset 0 1px 0 ${token.colorBgContainer}26 !important;
          transform: translateY(-1px) !important;
        }

        .ant-menu-horizontal .ant-menu-item-selected .ant-menu-title-content,
        .ant-menu-horizontal > .ant-menu-item-selected .ant-menu-title-content {
          color: ${token.colorWhite} !important;
        }

        /* Unselected items */
        .ant-menu-horizontal .ant-menu-item:not(.ant-menu-item-selected) {
          background-color: transparent !important;
          color: ${token.colorTextSecondary} !important;
          border-radius: 14px !important;
        }

        .ant-menu-horizontal .ant-menu-item:not(.ant-menu-item-selected):hover {
          background-color: ${token.colorFillQuaternary} !important;
          color: ${token.colorText} !important;
          border-radius: 14px !important;
        }
      `;
    document.head.appendChild(style);
  }, [token]); // Re-run when token changes

  // Get menu data from Zustand store
  const {
    mainMenus,
    selectedMainMenu,
    setSelectedMainMenu,
    initializeMenus,
    shouldUpdateMenuData,
    setMenuVersion,
    menuVersion,
  } = useMenuStore();

  // Initialize menu data on component mount
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        // Fetch menu data with current version for comparison
        const menuData = await fetchMenuData(menuVersion);

        // Check if we need to update based on version
        if (shouldUpdateMenuData(menuData)) {
          // Update menu version first
          setMenuVersion(menuData.config.version);

          // Only initialize if we don't have menu data yet
          // This preserves persisted state after page refresh
          if (mainMenus.length === 0) {
            initializeMenus(menuData);
          } else {
            // If we have persisted mainMenus but no completeMenuData,
            // just update the completeMenuData without changing selections
            const { completeMenuData } = useMenuStore.getState();
            if (!completeMenuData) {
              useMenuStore.setState({ completeMenuData: menuData });
            }
          }
        }
      } catch (error) {
        console.error('Failed to load menu data:', error);
      }
    };

    loadMenuData();
  }, [
    mainMenus.length,
    initializeMenus,
    menuVersion,
    shouldUpdateMenuData,
    setMenuVersion,
  ]);

  // Filter out admin-app from regular navigation and convert to navigation items
  const navigationItems = mainMenus
    .filter((menu) => menu.key !== 'admin-app')
    .map((menu) => ({
      key: menu.key,
      label: menu.label,
      icon: menu.icon ? <i className={menu.icon} /> : null,
    }));

  // Get admin menu for the admin button
  const adminMenu = mainMenus.find((menu) => menu.key === 'admin-app');

  // Handle main menu selection
  const handleMainMenuSelect = ({ key }) => {
    const selectedMenu = mainMenus.find((menu) => menu.key === key);
    if (selectedMenu) {
      setSelectedMainMenu(selectedMenu);
    }
  };

  // Notification handler
  const handleNotificationClick = (notificationId, actionType) => {
    console.log(
      `Notification action: ${actionType} for notification ${notificationId}`
    );
    // Handle notification actions here
  };

  // Fullscreen state management
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Enhanced cross-browser fullscreen API support detection
  const isFullscreenSupported = () => {
    const doc = document;
    const docEl = document.documentElement;

    return !!(
      // Standard API
      (
        (doc.fullscreenEnabled !== undefined && doc.fullscreenEnabled) ||
        // WebKit (Safari, Chrome)
        (doc.webkitFullscreenEnabled !== undefined &&
          doc.webkitFullscreenEnabled) ||
        // Mozilla (Firefox)
        (doc.mozFullScreenEnabled !== undefined && doc.mozFullScreenEnabled) ||
        // Microsoft (IE/Edge)
        (doc.msFullscreenEnabled !== undefined && doc.msFullscreenEnabled) ||
        // Fallback: check if methods exist
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen
      )
    );
  };

  // Get current fullscreen element across browsers
  const getFullscreenElement = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    );
  };

  // Handle fullscreen change events with enhanced browser support
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = getFullscreenElement();
      setIsFullscreen(!!fullscreenElement);
    };

    // Comprehensive event listener setup for all browsers
    const events = [
      'fullscreenchange', // Standard
      'webkitfullscreenchange', // Safari/Chrome
      'mozfullscreenchange', // Firefox
      'MSFullscreenChange', // IE/Edge (capital letters)
      'msfullscreenchange', // Edge (lowercase fallback)
    ];

    // Add all event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange, false);
    });

    // Initial state check
    handleFullscreenChange();

    return () => {
      // Cleanup all event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange, false);
      });
    };
  }, []);

  // Enhanced fullscreen enter function with comprehensive browser support
  const enterFullscreen = async () => {
    if (!isFullscreenSupported()) {
      console.warn('Fullscreen is not supported in this browser');
      return false;
    }

    try {
      const element = document.documentElement;

      // Try standard method first
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
      // WebKit (Safari, older Chrome)
      else if (element.webkitRequestFullscreen) {
        // Safari requires Element.ALLOW_KEYBOARD_INPUT parameter
        if (typeof Element !== 'undefined' && Element.ALLOW_KEYBOARD_INPUT) {
          await element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
          await element.webkitRequestFullscreen();
        }
      }
      // Mozilla (Firefox)
      else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      }
      // Microsoft (IE/Edge)
      else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      } else {
        throw new Error('No fullscreen method available');
      }

      return true;
    } catch (error) {
      console.warn('Failed to enter fullscreen:', error.message);
      return false;
    }
  };

  // Enhanced fullscreen exit function with comprehensive browser support
  const exitFullscreen = async () => {
    if (!getFullscreenElement()) {
      return true; // Already not in fullscreen
    }

    try {
      // Try standard method first
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      // WebKit (Safari, older Chrome)
      else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
      // Mozilla (Firefox)
      else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      }
      // Microsoft (IE/Edge)
      else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      } else {
        throw new Error('No exit fullscreen method available');
      }

      return true;
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error.message);
      return false;
    }
  };

  // Enhanced toggle function with better error handling
  const toggleFullscreen = async () => {
    if (!isFullscreenSupported()) {
      console.warn('Fullscreen API is not supported in this browser');
      return;
    }

    try {
      if (isFullscreen) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  return (
    <Header style={styles.topBarStyle}>
      {/* Left Section - Brand + Navigation */}
      <div style={styles.leftSectionStyle}>
        <div style={styles.brandContainerStyle}>
          <ZionixLogo
            size={48}
            useThemeColors={true}
            style={{ marginRight: '16px' }}
          />
          <span style={styles.logoTextStyle}>Zionix</span>
        </div>

        <div style={styles.navigationContainerStyle}>
          <Menu
            mode="horizontal"
            selectedKeys={selectedMainMenu ? [selectedMainMenu.key] : []}
            items={navigationItems}
            style={styles.menuStyle}
            className="zx-topbar-menu"
            theme="light"
            onSelect={handleMainMenuSelect}
            overflowedIndicator={null}
            disabledOverflow={true}
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <Space style={styles.rightActionsStyle}>
        {/* Admin Button */}
        {adminMenu && (
          <Button
            type="text"
            icon={<i className="ri-settings-3-line" />}
            onClick={() => setSelectedMainMenu(adminMenu)}
            style={{
              ...styles.iconButtonStyle,
              color:
                selectedMainMenu?.key === 'admin-app'
                  ? token.colorPrimary
                  : undefined,
              backgroundColor:
                selectedMainMenu?.key === 'admin-app'
                  ? token.colorPrimaryBg
                  : undefined,
            }}
            title="Admin Settings"
          />
        )}

        {/* Fullscreen Toggle Button */}
        {isFullscreenSupported() && (
          <Button
            type="text"
            icon={
              isFullscreen ? (
                <i className="ri-fullscreen-exit-line" />
              ) : (
                <i className="ri-fullscreen-line" />
              )
            }
            onClick={toggleFullscreen}
            style={{
              ...styles.iconButtonStyle,
              color: isFullscreen ? token.colorPrimary : undefined,
              backgroundColor: isFullscreen ? token.colorPrimaryBg : undefined,
            }}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            aria-label={
              isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'
            }
          />
        )}

        {/* Color Picker moved to sidebar
        <Tooltip title="Change Primary Color">
          <ColorPicker
            value={primaryColor}
            onChange={(color) => setPrimaryColor(color.toHexString())}
            size="small"
            showText={(color) => (
              <span style={{ marginLeft: 8, fontSize: '12px' }}>Theme</span>
            )}
            presets={[
              {
                label: 'Recommended',
                colors: [
                  token.colorPrimary || '#0050d8', // Current primary color
                  '#0050d8', // Classic blue
                  '#52c41a', // Success green
                  '#fa8c16', // Warning orange
                  '#ff4d4f', // Error red
                  '#722ed1', // Purple
                  '#13c2c2', // Cyan
                  '#eb2f96', // Magenta
                ],
              },
            ]}
          />
        </Tooltip>
        */}

        {/* <Button
          type="text"
          icon={<i className="ri-arrow-left-right-line" />}
          onClick={toggleRTL}
          style={styles.rtlToggleStyle(isRTL)}
          title={isRTL ? 'Switch to LTR' : 'Switch to RTL'}
        /> */}

        {/* Theme toggle moved to sidebar - keeping this commented for reference
        <Button
          type="text"
          icon={
            isDarkMode ? (
              <i className="ri-sun-line" />
            ) : (
              <i className="ri-moon-line" />
            )
          }
          onClick={toggleTheme}
          style={styles.iconButtonStyle}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        />
        */}

        <NotificationDropdown
          onNotificationClick={handleNotificationClick}
          buttonStyle={styles.iconButtonStyle}
        />
      </Space>
    </Header>
  );
};

export default AppTopBar;
