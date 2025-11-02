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
  Dropdown,
  List,
  Typography,
  Divider,
  Tag,
} from 'antd';
// Using Remix Icons CSS classes for better performance
import { useTheme, ZionixLogo } from '@zionix/design-system';
import { useStyles } from './DesktopTopBar.style';
import { useMenuStore } from '../../../../data/stores/menu/useMenuStore';
import { fetchMenuData } from '../../../../data/dummy/menuData';

const { Header } = Layout;
const { useToken } = theme;
const { Text, Title } = Typography;

// Dummy notification data
const dummyNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'System Update Complete',
    message: 'Your system has been successfully updated to version 2.4.1. New features and security improvements are now available.',
    timestamp: '2 minutes ago',
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=system',
    actions: [
      { label: 'View Details', type: 'primary' },
      { label: 'Dismiss', type: 'text' }
    ]
  },
  {
    id: 2,
    type: 'info',
    title: 'New User Registration',
    message: 'John Smith (john.smith@company.com) has registered and is pending approval.',
    timestamp: '15 minutes ago',
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    actions: [
      { label: 'Approve', type: 'primary' },
      { label: 'View Profile', type: 'text' }
    ]
  },
  {
    id: 3,
    type: 'warning',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100. Consider reviewing security settings.',
    timestamp: '1 hour ago',
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=security',
    actions: [
      { label: 'Block IP', type: 'primary' },
      { label: 'View Logs', type: 'text' }
    ]
  },
  {
    id: 4,
    type: 'info',
    title: 'Billing Reminder',
    message: 'Your subscription will renew in 3 days. Current plan: Enterprise Pro ($299/month).',
    timestamp: '2 hours ago',
    read: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=billing',
    actions: [
      { label: 'Manage Billing', type: 'primary' },
      { label: 'Change Plan', type: 'text' }
    ]
  },
  {
    id: 5,
    type: 'error',
    title: 'API Rate Limit Exceeded',
    message: 'Your application has exceeded the API rate limit. Some features may be temporarily unavailable.',
    timestamp: '3 hours ago',
    read: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=api',
    actions: [
      { label: 'Upgrade Plan', type: 'primary' },
      { label: 'View Usage', type: 'text' }
    ]
  }
];

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

  // Notification state
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);

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

  // Notification handlers
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationAction = (notificationId, actionLabel) => {
    console.log(`Action "${actionLabel}" clicked for notification ${notificationId}`);
    // Here you would typically handle the specific action
    if (actionLabel === 'Dismiss') {
      markAsRead(notificationId);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'success': return token.colorSuccess;
      case 'warning': return token.colorWarning;
      case 'error': return token.colorError;
      case 'info': 
      default: return token.colorInfo;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'ri-check-circle-line';
      case 'warning': return 'ri-alert-line';
      case 'error': return 'ri-error-warning-line';
      case 'info': 
      default: return 'ri-information-line';
    }
  };

  // Notification dropdown content
  const notificationDropdown = (
    <div style={{ 
      width: 380, 
      maxHeight: 500, 
      backgroundColor: token.colorBgElevated,
      borderRadius: token.borderRadius,
      boxShadow: token.boxShadowSecondary
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 20px 12px', 
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title level={5} style={{ margin: 0, color: token.colorText }}>
          Notifications
        </Title>
        <Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {unreadCount} unread
          </Text>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={markAllAsRead}
              style={{ padding: 0, height: 'auto', fontSize: '12px' }}
            >
              Mark all read
            </Button>
          )}
        </Space>
      </div>

      {/* Notification List */}
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                backgroundColor: notification.read ? 'transparent' : token.colorPrimaryBg,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ position: 'relative' }}>
                    <Avatar 
                      src={notification.avatar} 
                      size={40}
                      style={{ 
                        border: `2px solid ${getNotificationTypeColor(notification.type)}20`
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: getNotificationTypeColor(notification.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${token.colorBgElevated}`
                    }}>
                      <i 
                        className={getNotificationIcon(notification.type)}
                        style={{ 
                          fontSize: '8px', 
                          color: 'white',
                          lineHeight: 1
                        }}
                      />
                    </div>
                  </div>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text strong style={{ 
                      color: token.colorText,
                      fontSize: '14px',
                      lineHeight: '20px'
                    }}>
                      {notification.title}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {!notification.read && (
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: token.colorPrimary,
                          flexShrink: 0
                        }} />
                      )}
                      <Text type="secondary" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                        {notification.timestamp}
                      </Text>
                    </div>
                  </div>
                }
                description={
                  <div style={{ marginTop: 4 }}>
                    <Text 
                      type="secondary" 
                      style={{ 
                        fontSize: '13px',
                        lineHeight: '18px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {notification.message}
                    </Text>
                    {notification.actions && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                        {notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            type={action.type}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationAction(notification.id, action.label);
                            }}
                            style={{ 
                              fontSize: '11px',
                              height: 24,
                              padding: '0 8px'
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '12px 20px', 
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        textAlign: 'center'
      }}>
        <Button 
          type="link" 
          size="small"
          style={{ fontSize: '13px' }}
          onClick={() => {
            setNotificationOpen(false);
            console.log('View all notifications clicked');
          }}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );

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

        <Dropdown
          overlay={notificationDropdown}
          trigger={['click']}
          open={notificationOpen}
          onOpenChange={setNotificationOpen}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Badge count={unreadCount} size="small" overflowCount={99}>
            <Button
              type="text"
              icon={<i className="ri-notification-line" />}
              style={{
                ...styles.iconButtonStyle,
                color: notificationOpen ? token.colorPrimary : undefined,
                backgroundColor: notificationOpen ? token.colorPrimaryBg : undefined,
              }}
            />
          </Badge>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppTopBar;
