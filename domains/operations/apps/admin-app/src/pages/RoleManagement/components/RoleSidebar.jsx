import { useLayoutEffect, useState } from 'react';
import { Layout, Menu, theme, Tooltip, Avatar, Dropdown, Badge } from 'antd';
import { useStyles } from './RoleSidebar.style';

const { Sider } = Layout;
const { useToken } = theme;

// Inject CSS for menu styling
const injectSidebarCSS = (token, isDarkMode) => {
  const styleId = 'menu-sidebar-styles';
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Webkit scrollbar styles */
    .menu-main-content::-webkit-scrollbar {
      width: 6px;
    }
    .menu-main-content::-webkit-scrollbar-track {
      background: transparent;
    }
    .menu-main-content::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 3px;
      transition: background 0.2s ease;
    }
    .menu-main-content:hover::-webkit-scrollbar-thumb {
      background: ${token.colorTextQuaternary}40;
    }

    /* Menu items styling */
    .menu-menu-container .ant-menu-inline,
    .menu-menu-container .ant-menu-vertical {
      border: none !important;
      background: transparent !important;
    }

    .menu-menu-container .ant-menu-item {
      border-radius: 0 !important;
      margin-block: 2px !important;
      margin-inline: 6px !important;
      padding: 0 14px !important;
      height: 38px !important;
      line-height: 38px !important;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      color: ${token.colorText} !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      letter-spacing: -0.01em !important;
      position: relative !important;
      border-left: 3px solid transparent !important;
      opacity: 0.75 !important;
    }

    .menu-menu-container .ant-menu-item .anticon,
    .menu-menu-container .ant-menu-item i {
      font-size: 20px !important;
      font-weight: 600 !important;
      margin-right: 14px !important;
      color: ${token.colorText} !important;
      transition: all 0.3s ease !important;
      opacity: 0.9 !important;
    }

    .menu-menu-container .ant-menu-item:hover {
      background: ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'} !important;
      color: ${token.colorText} !important;
      transform: translateX(3px) scale(1.01) !important;
      opacity: 1 !important;
    }

    .menu-menu-container .ant-menu-item:hover .anticon,
    .menu-menu-container .ant-menu-item:hover i {
      color: ${token.colorPrimary} !important;
      opacity: 1 !important;
      transform: scale(1.15) !important;
    }

    .menu-menu-container .ant-menu-item-selected {
      background: ${token.colorPrimaryBg} !important;
      color: ${token.colorPrimary} !important;
      font-weight: 600 !important;
      border-left: 3px solid ${token.colorPrimary} !important;
      box-shadow: none !important;
      opacity: 1 !important;
    }

    .menu-menu-container .ant-menu-item-selected .ant-menu-title-content {
      color: ${token.colorPrimary} !important;
      font-weight: 600 !important;
      opacity: 1 !important;
    }

    .menu-menu-container .ant-menu-item-selected .anticon,
    .menu-menu-container .ant-menu-item-selected i {
      color: ${token.colorPrimary} !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
};

const RoleSidebar = ({ collapsed, onCollapse, menuData, selectedMainMenuKey }) => {
  const { token } = useToken();
  const [isToggleHovered, setIsToggleHovered] = useState(false);

  // Detect dark mode from Ant Design theme - check multiple indicators
  const isDarkMode =
    token.colorBgBase === '#000000' ||
    token.colorBgContainer === '#141414' ||
    token.colorBgElevated === '#1f1f1f' ||
    // Fallback: check if background is darker than text (luminance check)
    (token.colorBgContainer && token.colorBgContainer.startsWith('#') &&
      parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

  const styles = useStyles(token, isDarkMode);

  // Inject CSS on mount and theme change
  useLayoutEffect(() => {
    injectSidebarCSS(token, isDarkMode);
  }, [token, isDarkMode]);

  // Get selected main menu item
  const selectedMainMenu = menuData?.mainNavigation?.find(
    item => item.key === selectedMainMenuKey
  );

  // Helper function to get badge count from badge object
  const getBadgeCount = (badge) => {
    if (!badge) return null;
    if (typeof badge === 'object' && badge !== null && badge.count !== undefined) {
      return badge.count;
    }
    return badge;
  };

  // Helper function to get badge color from badge object
  const getBadgeColor = (badge) => {
    if (!badge || typeof badge !== 'object' || badge === null) {
      return undefined;
    }
    return badge.color || undefined;
  };

  // Format menu items for Ant Design Menu component (recursive for nested items)
  const formatMenuItems = (items) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items.map((item) => {
      const badgeCount = getBadgeCount(item.badge);
      const badgeColor = getBadgeColor(item.badge);

      const menuItem = {
        key: item.key,
        icon: item.icon ? <i className={item.icon} /> : null,
        label: badgeCount ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>{item.label}</span>
            <Badge count={badgeCount} size="small" color={badgeColor} />
          </div>
        ) : (
          item.label
        ),
      };

      // Handle nested children
      if (item.children && item.children.length > 0) {
        menuItem.children = formatMenuItems(item.children);
      }

      return menuItem;
    });
  };

  // Get menu items (children of selected main menu) - support nested structure
  const sidebarMenus = selectedMainMenu?.children || [];

  // Create sections from sidebar menus (similar to DesktopSidebar logic)
  const createMenuSections = () => {
    const sections = [];

    if (sidebarMenus.length > 0) {
      if (collapsed) {
        // In collapsed mode: Show all items that have icons
        const itemsWithIcons = sidebarMenus.filter(item => item.icon);
        if (itemsWithIcons.length > 0) {
          sections.push({
            type: 'section',
            id: 'navigation-collapsed',
            title: selectedMainMenu?.sectionTitle || 'Navigation',
            items: itemsWithIcons,
          });
        }
      } else {
        // In expanded mode: Show sections with their children
        sidebarMenus.forEach((menuItem, index) => {
          const sectionTitle = menuItem.sectionTitle || menuItem.label || selectedMainMenu?.sectionTitle || 'Navigation Menu';
          const items = menuItem.children || [];

          if (items.length > 0) {
            sections.push({
              type: 'section',
              id: `navigation-${menuItem.key || index}`,
              title: sectionTitle,
              items: items,
            });
          } else {
            // If no children, show the item itself
            sections.push({
              type: 'section',
              id: `navigation-${menuItem.key || index}`,
              title: sectionTitle,
              items: [menuItem],
            });
          }
        });
      }
    }

    return sections;
  };

  const menuSections = createMenuSections();

  // Get profile section
  const profileSection = menuData?.profileSection;

  // Toggle button styles (copied from original)
  const toggleButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    border: 'none',
    boxShadow: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    flexShrink: 0,
    ...(isToggleHovered && {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)',
    }),
  };

  const toggleIconStyle = {
    fontSize: '18px',
    fontWeight: 500,
    color: token.colorText,
    opacity: isToggleHovered ? 1 : 0.75,
    transition: 'all 0.2s ease',
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      collapsedWidth={80}
      style={styles.sidebarContainer}
      trigger={null}
    >
      <div style={styles.sidebarContent}>
        {/* Top Section - Hamburger + Theme Controls */}
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              {/* Hamburger Toggle */}
              <Tooltip title="Collapse" placement="right">
                <div
                  style={toggleButtonStyle}
                  onClick={() => onCollapse(!collapsed)}
                  onMouseEnter={() => setIsToggleHovered(true)}
                  onMouseLeave={() => setIsToggleHovered(false)}
                  role="button"
                  aria-label="Collapse sidebar"
                >
                  <i className="ri-menu-fold-line" style={toggleIconStyle} />
                </div>
              </Tooltip>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {/* Hamburger Toggle - Collapsed */}
              <Tooltip title="Expand" placement="right">
                <div
                  style={toggleButtonStyle}
                  onClick={() => onCollapse(!collapsed)}
                  onMouseEnter={() => setIsToggleHovered(true)}
                  onMouseLeave={() => setIsToggleHovered(false)}
                  role="button"
                  aria-label="Expand sidebar"
                >
                  <i className="ri-menu-unfold-line" style={toggleIconStyle} />
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Menu Container */}
        <div className="menu-main-content" style={styles.mainContent}>
          {/* Render all menu sections */}
          {menuSections.map((section, index) => (
            <div key={section.id}>
              {/* Section Header */}
              {!collapsed && (
                <div style={styles.sectionHeader}>
                  <span>{section.title}</span>
                </div>
              )}
              {collapsed && <div style={styles.sectionHeaderCollapsed} />}

              {/* Section Menu Items */}
              {section.items.length > 0 && (
                <div className="menu-menu-container" style={styles.menuContainer}>
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={[]}
                    items={formatMenuItems(section.items)}
                    inlineCollapsed={collapsed}
                    triggerSubMenuAction={collapsed ? "hover" : "click"}
                    style={{ background: 'transparent', border: 'none' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile Section */}
        {profileSection && (
          <div style={collapsed ? styles.profileCollapsed : styles.profileExpanded}>
            {collapsed ? (
              <Dropdown
                menu={{
                  items: profileSection.menuItems?.filter(item => item.type !== 'divider').map(item => ({
                    key: item.key,
                    label: item.label,
                    icon: item.icon ? <i className={item.icon} /> : null,
                  })) || [],
                }}
                placement="rightTop"
                trigger={['click']}
              >
                <Avatar
                  src={profileSection.userData?.avatar}
                  size={40}
                  style={{ cursor: 'pointer' }}
                />
              </Dropdown>
            ) : (
              <Dropdown
                menu={{
                  items: profileSection.menuItems?.filter(item => item.type !== 'divider').map(item => ({
                    key: item.key,
                    label: item.label,
                    icon: item.icon ? <i className={item.icon} /> : null,
                  })) || [],
                }}
                placement="topLeft"
                trigger={['click']}
              >
                <div style={styles.profileContent}>
                  <Avatar src={profileSection.userData?.avatar} size={40} />
                  <div style={styles.profileInfo}>
                    <div style={styles.profileName}>{profileSection.userData?.name}</div>
                    <div style={styles.profileEmail}>{profileSection.userData?.email}</div>
                  </div>
                  <i className="ri-more-2-line" style={styles.profileMore} />
                </div>
              </Dropdown>
            )}
          </div>
        )}
      </div>
    </Sider>
  );
};

export default RoleSidebar;
