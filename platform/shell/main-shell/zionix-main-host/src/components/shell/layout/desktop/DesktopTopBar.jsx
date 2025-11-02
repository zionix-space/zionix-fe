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

  // Convert main menus to navigation items for the topbar
  const navigationItems = mainMenus.map((menu) => ({
    key: menu.key,
    label: menu.label,
    icon: menu.icon ? <i className={menu.icon} /> : null,
  }));

  // Handle main menu selection
  const handleMainMenuSelect = ({ key }) => {
    const selectedMenu = mainMenus.find((menu) => menu.key === key);
    if (selectedMenu) {
      setSelectedMainMenu(selectedMenu);
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

        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<i className="ri-notification-line" />}
            style={styles.iconButtonStyle}
          />
        </Badge>
      </Space>
    </Header>
  );
};

export default AppTopBar;
