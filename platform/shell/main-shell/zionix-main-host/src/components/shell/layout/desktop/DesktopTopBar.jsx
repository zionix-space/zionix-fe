import React, { useState, useEffect } from 'react';
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
    console.log(`Notification action: ${actionType} for notification ${notificationId}`);
    // Handle notification actions here
  };

  // Fullscreen state management
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if fullscreen API is supported
  const isFullscreenSupported = () => {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
    };

    // Add event listeners for different browsers
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      // Cleanup event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
   }, []);

   // Fullscreen toggle functions
   const enterFullscreen = async () => {
     try {
       const element = document.documentElement;
       
       if (element.requestFullscreen) {
         await element.requestFullscreen();
       } else if (element.webkitRequestFullscreen) {
         await element.webkitRequestFullscreen();
       } else if (element.mozRequestFullScreen) {
         await element.mozRequestFullScreen();
       } else if (element.msRequestFullscreen) {
         await element.msRequestFullscreen();
       }
     } catch (error) {
       console.warn('Failed to enter fullscreen:', error);
       // Optionally show a user-friendly message
     }
   };

   const exitFullscreen = async () => {
     try {
       if (document.exitFullscreen) {
         await document.exitFullscreen();
       } else if (document.webkitExitFullscreen) {
         await document.webkitExitFullscreen();
       } else if (document.mozCancelFullScreen) {
         await document.mozCancelFullScreen();
       } else if (document.msExitFullscreen) {
         await document.msExitFullscreen();
       }
     } catch (error) {
       console.warn('Failed to exit fullscreen:', error);
       // Optionally show a user-friendly message
     }
   };

   const toggleFullscreen = async () => {
     if (!isFullscreenSupported()) {
       console.warn('Fullscreen API is not supported in this browser');
       return;
     }

     if (isFullscreen) {
       await exitFullscreen();
     } else {
       await enterFullscreen();
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
            theme="light"
            onSelect={handleMainMenuSelect}
            overflowedIndicator={<i className="ri-more-line" />}
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
              color: selectedMainMenu?.key === 'admin-app' ? token.colorPrimary : undefined,
              backgroundColor: selectedMainMenu?.key === 'admin-app' ? token.colorPrimaryBg : undefined,
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
            aria-label={isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
          />
        )}

        {/* Color Picker for Dynamic Theme Testing */}
        {/* <Tooltip title="Change Primary Color">
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

        <Button
          type="text"
          icon={<i className="ri-arrow-left-right-line" />}
          onClick={toggleRTL}
          style={styles.rtlToggleStyle(isRTL)}
          title={isRTL ? 'Switch to LTR' : 'Switch to RTL'}
        /> */}

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

        <NotificationDropdown 
          onNotificationClick={handleNotificationClick}
          buttonStyle={styles.iconButtonStyle}
        />
      </Space>
    </Header>
  );
};

export default AppTopBar;
