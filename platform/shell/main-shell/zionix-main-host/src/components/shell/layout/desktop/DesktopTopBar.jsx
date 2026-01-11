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
  Spin,
} from 'antd';
import { useNavigate } from 'react-router-dom';
// Using Remix Icons CSS classes for better performance
import { useTheme, ZionixLogo } from '@zionix/design-system';
import { useStyles } from './DesktopTopBar.style';
import { useMenuData } from '../../../../data/hooks/menu';
import { NotificationDropdown } from '../shared/NotificationDropdown';
import { QueryErrorFallback } from '../../../common/QueryErrorBoundary';

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
  const styles = useStyles(token, isDarkMode);

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
          padding: 0 10px !important;
          margin: 0 1px !important;
          height: 28px !important;
          line-height: 28px !important;
          border-radius: 6px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }

        .ant-menu-horizontal .ant-menu-item-selected,
        .ant-menu-horizontal > .ant-menu-item-selected,
        .ant-menu.ant-menu-horizontal .ant-menu-item-selected {
          background-color: ${token.colorPrimaryBg} !important;
          color: ${token.colorPrimary} !important;
          font-weight: 600 !important;
          border-radius: 0 !important;
          padding: 0 10px 0 7px !important;
          border-left: 3px solid ${token.colorPrimary} !important;
          box-shadow: none !important;
          transform: none !important;
        }

        .ant-menu-horizontal .ant-menu-item-selected .ant-menu-title-content,
        .ant-menu-horizontal > .ant-menu-item-selected .ant-menu-title-content {
          color: ${token.colorPrimary} !important;
        }

        /* Unselected items */
        .ant-menu-horizontal .ant-menu-item:not(.ant-menu-item-selected) {
          background-color: transparent !important;
          color: ${token.colorTextSecondary} !important;
          border-radius: 6px !important;
        }

        .ant-menu-horizontal .ant-menu-item:not(.ant-menu-item-selected):hover {
          background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'} !important;
          color: ${token.colorText} !important;
          border-radius: 6px !important;
        }
      `;
    document.head.appendChild(style);
  }, [token]); // Re-run when token changes

  // Get menu data using the new unified hook
  const {
    mainMenus,
    selectedMainMenu,
    isLoading: isMenuLoading,
    selectMainMenu,
  } = useMenuData();

  // Fullscreen state management
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = useNavigate();

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
    selectMainMenu(key);

    // Find the selected menu to get its route
    const selectedMenu = mainMenus.find(menu => menu.key === key);
    if (selectedMenu) {
      // If menu has children, navigate to first child's route
      if (selectedMenu.children && selectedMenu.children.length > 0) {
        const firstChild = selectedMenu.children[0];
        // Check if first child has children (nested structure)
        if (firstChild.children && firstChild.children.length > 0) {
          const firstNestedChild = firstChild.children[0];
          if (firstNestedChild.route) {
            const route = firstNestedChild.route.startsWith('/')
              ? firstNestedChild.route
              : `/${firstNestedChild.route}`;
            navigate(route);
          }
        } else if (firstChild.route) {
          const route = firstChild.route.startsWith('/')
            ? firstChild.route
            : `/${firstChild.route}`;
          navigate(route);
        }
      } else if (selectedMenu.route) {
        // Navigate to menu's own route if no children
        const route = selectedMenu.route.startsWith('/')
          ? selectedMenu.route
          : `/${selectedMenu.route}`;
        navigate(route);
      }
    }
  };

  // Notification handler
  const handleNotificationClick = (notificationId, actionType) => {
    console.log(
      `Notification action: ${actionType} for notification ${notificationId}`
    );
    // Handle notification actions here
  };

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
      {isMenuLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Spin size="small" />
        </div>
      ) : (
        <>
          {/* Left Section - Brand + Navigation */}
          <div style={styles.leftSectionStyle}>
            <div style={styles.brandContainerStyle}>
              <ZionixLogo
                size={48}
                useThemeColors={true}
                style={{ marginRight: '12px' }}
              />
              <span style={styles.logoTextStyle}>Zionix</span>
            </div>

            {/* Only show navigation container if there are navigation items */}
            {navigationItems.length > 0 && (
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
            )}
          </div>

          {/* Right Section - Actions */}
          <Space style={styles.rightActionsStyle}>
            {/* Admin Button */}
            {adminMenu && (
              <Button
                type="text"
                icon={<i className="ri-settings-3-line" />}
                onClick={() => selectMainMenu(adminMenu.key)}
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
        </>
      )}
    </Header>
  );
};

export default AppTopBar;
