import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, theme, Space, Button } from 'antd';
import { 
  UserOutlined,
  MoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FileOutlined,
  FolderOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useStyles } from '../styles/MenuPreview.style';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Icon mapping for preview
const iconMap = {
  AppstoreOutlined: <AppstoreOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserOutlined: <UserOutlined />,
  FileOutlined: <FileOutlined />,
  FolderOutlined: <FolderOutlined />,
  DashboardOutlined: <DashboardOutlined />,
};

const MenuPreview = ({ previewMode, menuData, mainMenus, sidebarMenus }) => {
  const { token } = theme.useToken();
  const styles = useStyles(token, previewMode);
  
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMainMenu, setSelectedMainMenu] = useState(mainMenus[0]?.key || '');

  // Convert menu items for Ant Design Menu component
  const convertMenuItems = (items) => {
    return items?.map(item => ({
      key: item.key,
      icon: iconMap[item.icon] || <FileOutlined />,
      label: item.label,
      disabled: item.disabled,
      children: item.children ? convertMenuItems(item.children) : undefined,
    })) || [];
  };

  // Get main menu items
  const mainMenuItems = convertMenuItems(mainMenus);

  // Get sidebar menu items for selected main menu
  const currentSidebarMenus = sidebarMenus[selectedMainMenu] || [];
  const sidebarMenuItems = convertMenuItems(currentSidebarMenus);

  return (
    <div style={styles.previewContainer}>
      {/* Preview Header */}
      <div style={styles.previewHeader}>
        <Title level={5} style={styles.previewTitle}>
          Live Preview - {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)}
        </Title>
        <Text type="secondary" style={styles.previewSubtitle}>
          Real-time preview of your menu changes
        </Text>
      </div>

      {/* Preview Content */}
      <div style={styles.previewContent}>
        <Layout style={styles.previewLayout}>
          {/* Top Bar */}
          <Header style={styles.topBar}>
            <div style={styles.topBarLeft}>
              <div style={styles.brand}>
                <Text strong style={styles.brandText}>Zionix</Text>
              </div>
              
              {/* Main Navigation */}
              {previewMode === 'desktop' && (
                <Menu
                  mode="horizontal"
                  selectedKeys={[selectedMainMenu]}
                  items={mainMenuItems}
                  style={styles.mainMenu}
                  onSelect={({ key }) => setSelectedMainMenu(key)}
                />
              )}
            </div>

            <div style={styles.topBarRight}>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text style={styles.userText}>John Doe</Text>
              </Space>
            </div>
          </Header>

          <Layout style={styles.contentLayout}>
            {/* Sidebar */}
            {(previewMode === 'desktop' || previewMode === 'tablet') && (
              <Sider
                width={previewMode === 'desktop' ? 240 : 200}
                collapsible={previewMode === 'desktop'}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                style={styles.sidebar}
                theme="light"
              >
                {/* Sidebar Header */}
                <div style={styles.sidebarHeader}>
                  {!collapsed && (
                    <Text strong style={styles.sidebarTitle}>
                      {selectedMainMenu.charAt(0).toUpperCase() + selectedMainMenu.slice(1)}
                    </Text>
                  )}
                  {previewMode === 'desktop' && (
                    <Button
                      type="text"
                      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                      onClick={() => setCollapsed(!collapsed)}
                      style={styles.collapseButton}
                    />
                  )}
                </div>

                {/* Sidebar Menu */}
                <Menu
                  mode="inline"
                  items={sidebarMenuItems}
                  style={styles.sidebarMenu}
                  inlineCollapsed={collapsed}
                />
              </Sider>
            )}

            {/* Main Content */}
            <Content style={styles.mainContent}>
              <div style={styles.contentArea}>
                <Title level={4} style={styles.contentTitle}>
                  Preview Content Area
                </Title>
                <Text type="secondary">
                  This is where your application content would appear. 
                  The menu structure above reflects your current configuration.
                </Text>

                {/* Mobile Menu Preview */}
                {previewMode === 'mobile' && (
                  <div style={styles.mobileMenuPreview}>
                    <Title level={5}>Mobile Navigation</Title>
                    <Menu
                      mode="inline"
                      items={[...mainMenuItems, ...sidebarMenuItems]}
                      style={styles.mobileMenu}
                    />
                  </div>
                )}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default MenuPreview;