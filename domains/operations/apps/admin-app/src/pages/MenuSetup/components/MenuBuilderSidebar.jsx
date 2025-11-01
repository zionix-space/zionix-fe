import React, { useState } from 'react';
import { Layout, Menu, Input, Button, Space, Typography, theme } from 'antd';
import { 
  SearchOutlined,
  MenuOutlined,
  AppstoreOutlined,
  SettingOutlined,
  PlusOutlined,
  FolderOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useMenuStore } from '../../../stores/menu/useMenuStore';
import { useStyles } from '../styles/MenuBuilderSidebar.style';

const { Sider } = Layout;
const { Title, Text } = Typography;

const MenuBuilderSidebar = ({ selectedMenuId, setSelectedMenuId }) => {
  const { token } = theme.useToken();
  const styles = useStyles(token);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  
  const { mainMenus, sidebarMenus } = useMenuStore();

  // Convert menu data to sidebar menu items
  const getSidebarMenuItems = () => {
    const items = [
      {
        key: 'main-menus',
        icon: <MenuOutlined />,
        label: 'Main Navigation',
        type: 'group',
      },
      ...mainMenus.map(menu => ({
        key: `main-${menu.key}`,
        icon: <AppstoreOutlined />,
        label: menu.label,
        onClick: () => setSelectedMenuId(`main-${menu.key}`),
      })),
      {
        key: 'sidebar-menus',
        icon: <FolderOutlined />,
        label: 'Sidebar Menus',
        type: 'group',
      },
      ...Object.entries(sidebarMenus).map(([key, menuItems]) => ({
        key: `sidebar-${key}`,
        icon: <FileOutlined />,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        onClick: () => setSelectedMenuId(`sidebar-${key}`),
        children: menuItems.map(item => ({
          key: `sidebar-${key}-${item.key}`,
          label: item.label,
          onClick: () => setSelectedMenuId(`sidebar-${key}-${item.key}`),
        })),
      })),
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Menu Settings',
        type: 'group',
      },
      {
        key: 'global-settings',
        icon: <SettingOutlined />,
        label: 'Global Settings',
        onClick: () => setSelectedMenuId('global-settings'),
      },
    ];

    // Filter items based on search term
    if (searchTerm) {
      return items.filter(item => 
        item.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.children?.some(child => 
          child.label?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return items;
  };

  const handleAddMenu = () => {
    // TODO: Implement add menu functionality
    console.log('Adding new menu...');
  };

  return (
    <Sider
      width={280}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={styles.sidebarContainer}
      theme="light"
    >
      <div style={styles.sidebarContent}>
        {/* Header */}
        <div style={styles.sidebarHeader}>
          {!collapsed && (
            <>
              <Title level={5} style={styles.sidebarTitle}>
                Menu Structure
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                onClick={handleAddMenu}
                style={styles.addButton}
              >
                Add Menu
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        {!collapsed && (
          <div style={styles.searchContainer}>
            <Input
              placeholder="Search menus..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              allowClear
            />
          </div>
        )}

        {/* Menu List */}
        <div style={styles.menuContainer}>
          <Menu
            mode="inline"
            selectedKeys={selectedMenuId ? [selectedMenuId] : []}
            items={getSidebarMenuItems()}
            style={styles.menuStyle}
            inlineCollapsed={collapsed}
          />
        </div>

        {/* Footer Info */}
        {!collapsed && (
          <div style={styles.footerInfo}>
            <Space direction="vertical" size="small">
              <Text type="secondary" style={styles.infoText}>
                Total Menus: {mainMenus.length + Object.keys(sidebarMenus).length}
              </Text>
              <Text type="secondary" style={styles.infoText}>
                Last Modified: {new Date().toLocaleDateString()}
              </Text>
            </Space>
          </div>
        )}
      </div>
    </Sider>
  );
};

export default MenuBuilderSidebar;