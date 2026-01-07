import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  Layout,
  Input,
  Menu,
  Badge,
  Avatar,
  Dropdown,
  Tooltip,
  theme,
  ColorPicker,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix/design-system';
import { useMenuData } from '../../../../data/hooks/menu';
import { useStyles } from './DesktopSidebar.style';
import { logout } from '@zionix/authentication';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';

// Inject CSS for webkit scrollbar styles and Ant Design component overrides
const injectSidebarCSS = (token) => {
  const styleId = 'desktop-sidebar-styles';

  // Remove existing style if it exists to allow re-injection with new token values
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
      /* Webkit scrollbar styles */
      .zx-host-main-content::-webkit-scrollbar {
        width: 4px;
      }
      .zx-host-main-content::-webkit-scrollbar-track {
        background: transparent;
      }
      .zx-host-main-content::-webkit-scrollbar-thumb {
        background: ${token.colorBorderSecondary};
        border-radius: ${token.borderRadiusSM}px;
        transition: background 0.2s ease;
      }
      .zx-host-main-content::-webkit-scrollbar-thumb:hover {
        background: ${token.colorBorder};
      }

      /* Ant Design Input Clear Icon Styling */
      .zx-host-search-input .ant-input-clear-icon {
        font-size: 14px;
        color: ${token.colorTextTertiary};
        right: 8px;
        transition: color 0.2s ease;
      }
      
      .zx-host-search-input .ant-input-clear-icon:hover {
        color: ${token.colorText};
      }
      
      .zx-host-search-input .ant-input-clear-icon .anticon {
        font-size: 14px;
      }

      /* Premium sidebar menu items - Apple/macOS style */
      .zx-host-menu-container .ant-menu-inline,
      .zx-host-menu-container .ant-menu-vertical {
        border: none !important;
        background: transparent !important;
      }

      .zx-host-menu-container .ant-menu-item {
        border-radius: 10px !important;
        margin: 3px 8px !important;
        padding: 0 14px !important;
        height: 40px !important;
        line-height: 40px !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: ${token.colorText} !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: -0.011em !important;
      }

      .zx-host-menu-container .ant-menu-item .ant-menu-title-content {
        color: ${token.colorText} !important;
        font-weight: 500 !important;
      }

      .zx-host-menu-container .ant-menu-item .anticon,
      .zx-host-menu-container .ant-menu-item i {
        font-size: 18px !important;
        margin-right: 12px !important;
        color: ${token.colorTextSecondary} !important;
        transition: color 0.25s ease !important;
      }

      .zx-host-menu-container .ant-menu-item:hover {
        background: ${token.colorFillQuaternary}80 !important;
        color: ${token.colorText} !important;
        transform: translateX(2px) !important;
      }

      .zx-host-menu-container .ant-menu-item:hover .ant-menu-title-content {
        color: ${token.colorText} !important;
      }

      .zx-host-menu-container .ant-menu-item:hover .anticon,
      .zx-host-menu-container .ant-menu-item:hover i {
        color: ${token.colorPrimary} !important;
      }

      .zx-host-menu-container .ant-menu-item-selected {
        background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%) !important;
        color: ${token.colorWhite} !important;
        box-shadow: 0 4px 12px ${token.colorPrimary}35, inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        font-weight: 600 !important;
        transform: translateX(0) !important;
      }

      .zx-host-menu-container .ant-menu-item-selected .ant-menu-title-content,
      .zx-host-menu-container .ant-menu-item-selected .anticon,
      .zx-host-menu-container .ant-menu-item-selected i {
        color: ${token.colorWhite} !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title {
        border-radius: 10px !important;
        margin: 3px 8px !important;
        padding: 0 14px !important;
        height: 40px !important;
        line-height: 40px !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: ${token.colorText} !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        letter-spacing: -0.011em !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title .anticon,
      .zx-host-menu-container .ant-menu-submenu-title i {
        font-size: 18px !important;
        margin-right: 12px !important;
        color: ${token.colorTextSecondary} !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title:hover {
        background: ${token.colorFillQuaternary}80 !important;
        color: ${token.colorText} !important;
        transform: translateX(2px) !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title:hover .anticon,
      .zx-host-menu-container .ant-menu-submenu-title:hover i {
        color: ${token.colorPrimary} !important;
      }

      /* Submenu items - slightly indented */
      .zx-host-menu-container .ant-menu-sub .ant-menu-item {
        padding-left: 46px !important;
        font-size: 13px !important;
        height: 36px !important;
        line-height: 36px !important;
      }

      /* Collapsed sidebar - perfectly centered circular buttons */
      .ant-layout-sider-collapsed .zx-host-menu-container {
        padding: 3px !important;
        margin: 0 16px 12px 16px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 4px !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu {
        width: 100% !important;
        margin-right:20px !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item {
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        max-width: 48px !important;
        border-radius: 12px !important;
        padding: 0 !important;
        margin: 0 auto 4px auto !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        overflow: visible !important;
      }

      /* CRITICAL: Center icons in collapsed mode - user tested this exact value */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-inline-collapsed > .ant-menu-item {
        margin-right: 20px !important;
      }

      /* Override Ant Design's icon margin and positioning */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item .ant-menu-item-icon {
        margin-inline-end: 0 !important;
        margin-inline-start: 0 !important;
        margin-right: 0 !important;
        margin-left: 0 !important;
      }

      /* Icon styling - perfectly centered */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item .ant-menu-item-icon,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item .anticon,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item i {
        font-size: 22px !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Hover and selected states */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item:hover {
        background: ${token.colorFillQuaternary}80 !important;
        transform: scale(1.05) !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item-selected {
        background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%) !important;
        box-shadow: 0 4px 12px ${token.colorPrimary}35, inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item-selected .anticon,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item-selected i {
        color: ${token.colorWhite} !important;
      }

      /* Submenu items - remove empty spaces */
      .zx-host-menu-container .ant-menu-sub {
        background: transparent !important;
      }

      .zx-host-menu-container .ant-menu-sub .ant-menu-item {
        margin: 2px 8px !important;
        padding: 0 14px !important;
      }

      /* Remove empty space from submenu */
      .zx-host-menu-container .ant-menu-submenu > .ant-menu {
        background: transparent !important;
      }

      .zx-host-menu-container .ant-menu-submenu-open > .ant-menu-submenu-title {
        background: ${token.colorFillQuaternary}60 !important;
      }

      /* Collapsed sidebar dropdown menu styling - GLOBAL selectors for portal-rendered menus */
      /* Target the popup menu container */
      .ant-menu-submenu-popup.ant-menu-submenu-placement-rightTop,
      .ant-menu-submenu-popup.ant-menu-submenu-placement-rightBottom {
        margin-left: 8px !important;
      }

      /* Dropdown menu container styling - WIDER to prevent text cutoff */
      .ant-menu-submenu-popup .ant-menu-vertical {
        border-radius: 12px !important;
        padding: 6px !important;
        min-width: 200px !important;
        width: auto !important;
        background: ${token.colorBgElevated} !important;
        box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
        backdrop-filter: blur(20px) !important;
      }

      /* CRITICAL: Override ALL Ant Design menu item styles in popup */
      .ant-menu-submenu-popup .ant-menu-vertical > .ant-menu-item,
      .ant-menu-submenu-popup .ant-menu-vertical .ant-menu-item {
        border-radius: 8px !important;
        margin: 2px 0 !important;
        margin-bottom: 2px !important;
        padding: 0 12px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        height: 36px !important;
        max-height: 36px !important;
        min-height: 36px !important;
        line-height: 36px !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: -0.011em !important;
        display: flex !important;
        align-items: center !important;
        white-space: nowrap !important;
        overflow: visible !important;
      }

      /* Override Ant Design's margin-block styles */
      .ant-menu-submenu-popup .ant-menu-vertical .ant-menu-item {
        margin-block: 2px !important;
        margin-inline: 0 !important;
      }

      /* Title content - NO text cutoff, allow full width */
      .ant-menu-submenu-popup .ant-menu-item .ant-menu-title-content {
        flex: 1 !important;
        overflow: visible !important;
        white-space: nowrap !important;
        line-height: 36px !important;
        display: flex !important;
        align-items: center !important;
        min-width: 0 !important;
      }

      /* Icons - fixed size */
      .ant-menu-submenu-popup .ant-menu-item .ant-menu-item-icon,
      .ant-menu-submenu-popup .ant-menu-item .anticon,
      .ant-menu-submenu-popup .ant-menu-item i {
        font-size: 16px !important;
        margin-right: 10px !important;
        margin-inline-end: 10px !important;
        color: ${token.colorTextSecondary} !important;
        flex-shrink: 0 !important;
        line-height: 1 !important;
      }

      /* Badge wrapper - inline and no extra space */
      .ant-menu-submenu-popup .ant-menu-item .ant-menu-title-content > div {
        display: flex !important;
        align-items: center !important;
        line-height: 36px !important;
        width: 100% !important;
        gap: 8px !important;
      }

      /* Badge itself */
      .ant-menu-submenu-popup .ant-menu-item .ant-badge {
        line-height: 1 !important;
        display: inline-flex !important;
        align-items: center !important;
        margin-left: auto !important;
        flex-shrink: 0 !important;
      }

      /* Hover state */
      .ant-menu-submenu-popup .ant-menu-item:hover {
        background: ${token.colorFillQuaternary}80 !important;
        color: ${token.colorText} !important;
      }

      .ant-menu-submenu-popup .ant-menu-item:hover .anticon,
      .ant-menu-submenu-popup .ant-menu-item:hover i {
        color: ${token.colorPrimary} !important;
      }

      /* Selected state - PREMIUM GRADIENT like sidebar */
      .ant-menu-submenu-popup .ant-menu-item-selected,
      .ant-menu-submenu-popup .ant-menu-item.ant-menu-item-selected {
        background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%) !important;
        color: ${token.colorWhite} !important;
        box-shadow: 0 4px 12px ${token.colorPrimary}35, inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        font-weight: 600 !important;
      }

      .ant-menu-submenu-popup .ant-menu-item-selected .ant-menu-item-icon,
      .ant-menu-submenu-popup .ant-menu-item-selected .anticon,
      .ant-menu-submenu-popup .ant-menu-item-selected i,
      .ant-menu-submenu-popup .ant-menu-item-selected .ant-menu-title-content,
      .ant-menu-submenu-popup .ant-menu-item-selected .ant-menu-title-content span {
        color: ${token.colorWhite} !important;
      }

      /* Submenu title in dropdown */
      .ant-menu-submenu-popup .ant-menu-submenu-title {
        border-radius: 8px !important;
        margin: 2px 0 !important;
        margin-block: 2px !important;
        padding: 0 12px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        height: 36px !important;
        max-height: 36px !important;
        min-height: 36px !important;
        line-height: 36px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        letter-spacing: -0.011em !important;
        display: flex !important;
        align-items: center !important;
        white-space: nowrap !important;
        overflow: visible !important;
      }

      .ant-menu-submenu-popup .ant-menu-submenu-title .anticon,
      .ant-menu-submenu-popup .ant-menu-submenu-title i {
        font-size: 16px !important;
        margin-right: 10px !important;
        flex-shrink: 0 !important;
        line-height: 1 !important;
      }

      /* Nested submenu items */
      .ant-menu-submenu-popup .ant-menu-sub .ant-menu-item {
        padding-left: 32px !important;
        font-size: 13px !important;
        height: 32px !important;
        max-height: 32px !important;
        min-height: 32px !important;
        line-height: 32px !important;
        margin-block: 2px !important;
      }

      .ant-menu-submenu-popup .ant-menu-sub .ant-menu-item .ant-menu-title-content {
        line-height: 32px !important;
      }
    `;
  document.head.appendChild(style);
};

// Using Remix Icons CSS classes for optimal performance

const { Sider } = Layout;
const { useToken } = theme;

const AppSidebar = ({ collapsed = false, onCollapse }) => {
  const { token } = useToken();
  const { isRTL, isDarkMode, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const styles = useStyles(token);
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  // Get menu data and UI state from the unified hook
  const {
    sidebarMenus,
    selectedMainMenu,
    selectedSidebarKey,
    setSelectedSidebarKey,
    openSidebarKeys,
    setOpenSidebarKeys,
    profileSection: profileSectionData,
  } = useMenuData();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu selection handlers
  const handleMenuSelect = async (key) => {
    setSelectedSidebarKey(key);
    console.log('Selected menu item:', key);

    // Handle logout action
    if (key === 'logout') {
      try {
        // Clear auth store (this also clears localStorage)
        clearAuth();

        // Dispatch logout event for all microfrontends
        window.dispatchEvent(new CustomEvent('auth:logout'));

        // Navigate to login page
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Ensure navigation happens even if there's an error
        navigate('/login');
      }
    }
  };

  const handleOpenChange = (keys) => {
    setOpenSidebarKeys(keys);
  };

  // Search functionality - Memoized to prevent re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Recursive function to filter menu items based on search query
  const filterMenuItems = (items, query) => {
    if (!query.trim()) return items;

    const lowercaseQuery = query.toLowerCase();

    return items
      .filter((item) => {
        // Check if current item matches
        const itemMatches =
          item.label?.toLowerCase().includes(lowercaseQuery) ||
          item.key?.toLowerCase().includes(lowercaseQuery);

        // Check if any children match (for nested menus)
        const hasMatchingChildren =
          item.children && filterMenuItems(item.children, query).length > 0;

        return itemMatches || hasMatchingChildren;
      })
      .map((item) => {
        // If item has children, filter them recursively
        if (item.children) {
          return {
            ...item,
            children: filterMenuItems(item.children, query),
          };
        }
        return item;
      });
  };

  // Filter sections based on search query
  const getFilteredSections = (sections) => {
    if (!searchQuery.trim()) return sections;

    return sections
      .map((section) => {
        if (section.type === 'profile') {
          // Filter profile menu items
          const filteredMenuItems = filterMenuItems(
            section.menuItems || [],
            searchQuery
          );
          return {
            ...section,
            menuItems: filteredMenuItems,
            hasResults: filteredMenuItems.length > 0,
          };
        } else {
          // Filter regular section items
          const filteredItems = filterMenuItems(
            section.items || [],
            searchQuery
          );
          return {
            ...section,
            items: filteredItems,
            hasResults: filteredItems.length > 0,
          };
        }
      })
      .filter((section) => section.hasResults);
  };

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed !== null) {
      onCollapse(JSON.parse(savedCollapsed));
    }
  }, [onCollapse]);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+B or Cmd+B to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        onCollapse(!collapsed);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, onCollapse]);

  // Inject sidebar CSS - use useLayoutEffect for synchronous injection before paint
  useLayoutEffect(() => {
    injectSidebarCSS(token);
  }, [token]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Using Ant Design's standard breakpoints
      const mobileBreakpoint = token.screenSM || 576; // Small screen
      const tabletBreakpoint = token.screenMD || 768; // Medium screen

      setIsMobile(width < mobileBreakpoint);
      setIsTablet(width < tabletBreakpoint && width >= mobileBreakpoint);

      // Auto-collapse on mobile
      if (width < mobileBreakpoint && !collapsed) {
        onCollapse(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, onCollapse, token]);

  // Advanced section separator component
  const SectionSeparator = ({
    title,
    collapsed,
    accentColor = token.colorPrimary,
  }) => {
    if (collapsed) {
      // Return minimal spacing only - no visual indicators
      return (
        <div style={styles.zxHostSectionHeaderCollapsed} aria-label={title} />
      );
    }

    return (
      <div style={styles.zxHostSectionHeader}>
        <span>{title}</span>
        <div
          style={{
            ...styles.zxHostSectionDivider,
            background: `linear-gradient(90deg, ${accentColor}30, transparent)`,
          }}
        />
      </div>
    );
  };

  // Create menu sections directly from menu data - supports multiple sections per parent menu
  // Create menu sections directly from menu data - supports multiple sections per parent menu
  const createMenuSections = () => {
    const sections = [];

    // Main navigation - create separate sections for each child with sectionTitle
    if (sidebarMenus.length > 0) {
      if (collapsed) {
        // In collapsed mode: Show parent items (the ones with sectionTitle and icons) as menu items
        // This way users see icons for each section
        const itemsWithIcons = sidebarMenus.filter(item => item.icon);
        if (itemsWithIcons.length > 0) {
          sections.push({
            type: 'section',
            id: 'navigation-collapsed',
            title: selectedMainMenu?.sectionTitle || 'Navigation',
            accentColor: token.colorPrimary,
            items: itemsWithIcons, // Show the section parents as items
          });
        }
      } else {
        // In expanded mode: Show sections with their children
        sidebarMenus.forEach((menuItem, index) => {
          const sectionTitle = menuItem.sectionTitle || selectedMainMenu?.sectionTitle || 'Navigation Menu';
          const items = menuItem.children || [];

          if (items.length > 0) {
            sections.push({
              type: 'section',
              id: `navigation-${menuItem.key || index}`,
              title: sectionTitle,
              accentColor: token.colorPrimary,
              items: items,
            });
          }
        });
      }
    }

    // Profile section - direct access from profileSectionData
    if (profileSectionData) {
      sections.push({
        ...profileSectionData,
        items: profileSectionData.menuItems || [], // Ensure it's always an array
      });
    }
    return sections;
  };


  const backendMenuSections = createMenuSections();

  // Helper function to get badge count from badge object
  const getBadgeCount = (badge) => {
    if (!badge) return null;
    if (
      typeof badge === 'object' &&
      badge !== null &&
      badge.count !== undefined
    ) {
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

  // Format menu items for Ant Design Menu component
  const formatMenuItems = (items) => {
    // Add null check to prevent TypeError
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
          <div style={styles.zxHostMenuItemBadge}>
            <span>{item.label}</span>
            <Badge count={badgeCount} size="small" color={badgeColor} />
          </div>
        ) : (
          item.label
        ),
      };

      if (item.children && item.children.length > 0) {
        menuItem.children = formatMenuItems(item.children);
      }

      return menuItem;
    });
  };

  // Render a single section with its menu items
  const renderSection = (section, index) => {
    // Handle profile section differently
    if (section.type === 'profile') {
      return renderProfileSection(section);
    }

    // Handle regular sections
    return (
      <div key={section.id}>
        {/* Section Separator */}
        <SectionSeparator
          title={section.title}
          collapsed={collapsed}
          accentColor={section.accentColor}
        />

        {/* Section Menu Items */}
        <div
          style={styles.zxHostMenuContainer}
          className="zx-host-menu-container"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedSidebarKey]}
            openKeys={openSidebarKeys}
            onOpenChange={handleOpenChange}
            onSelect={({ key }) => handleMenuSelect(key)}
            inlineCollapsed={collapsed}
            inlineIndent={0}
            items={formatMenuItems(section.items)}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>
    );
  };

  // Render profile section with user info and dropdown
  const renderProfileSection = (profileSection) => {
    const { userData, menuItems } = profileSection;

    if (collapsed) {
      // Collapsed profile - just avatar
      return (
        <div key={profileSection.id} style={styles.zxHostProfileCollapsed}>
          <Dropdown
            menu={{
              items: formatMenuItems(
                menuItems.filter((item) => item.type !== 'divider')
              ),
              onClick: ({ key }) => handleMenuSelect(key),
            }}
            placement="rightTop"
            trigger={['click']}
          >
            <Avatar
              src={userData.avatar}
              size={40}
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        </div>
      );
    }

    // Expanded profile - full user info with dropdown
    return (
      <div key={profileSection.id} style={styles.zxHostProfileExpanded}>
        <Dropdown
          menu={{
            items: formatMenuItems(
              menuItems.filter((item) => item.type !== 'divider')
            ),
            onClick: ({ key }) => handleMenuSelect(key),
          }}
          placement="topLeft"
          trigger={['click']}
        >
          <div style={styles.zxHostProfileContent}>
            <Avatar src={userData.avatar} size={40} />
            <div style={styles.zxHostProfileInfo}>
              <div style={styles.zxHostProfileName}>{userData.name}</div>
              <div style={styles.zxHostProfileEmail}>{userData.email}</div>
            </div>
            <i className="ri-more-2-line" style={styles.zxHostProfileMore} />
          </div>
        </Dropdown>
      </div>
    );
  };

  // Simple Toggle Button Component - No memoization needed
  const ToggleButton = () => {
    const toggleTooltip = collapsed
      ? `Expand sidebar (Ctrl+B)`
      : `Collapse sidebar (Ctrl+B)`;

    return (
      <Tooltip
        title={toggleTooltip}
        placement={collapsed ? 'right' : 'bottom'}
      >
        <div
          style={{
            ...styles.zxHostToggleButton,
            ...(isToggleHovered ? styles.zxHostToggleButtonHover : {}),
          }}
          onClick={() => onCollapse(!collapsed)}
          onMouseEnter={() => setIsToggleHovered(true)}
          onMouseLeave={() => setIsToggleHovered(false)}
          role="button"
          aria-label={toggleTooltip}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCollapse(!collapsed);
            }
          }}
        >
          {collapsed ? (
            <i
              className="ri-menu-line"
              style={{
                fontSize: '20px',
                ...styles.zxHostToggleIcon,
                ...(isToggleHovered ? styles.zxHostToggleIconHover : {}),
              }}
            />
          ) : (
            <i
              className="ri-menu-fold-line"
              style={{
                fontSize: '20px',
                ...styles.zxHostToggleIcon,
                ...(isToggleHovered ? styles.zxHostToggleIconHover : {}),
              }}
            />
          )}
        </div>
      </Tooltip>
    );
  };

  // Get filtered sections based on search query
  const filteredSections = getFilteredSections(backendMenuSections);
  const navigationSections = filteredSections.filter(
    (section) => section.type !== 'profile'
  );
  const profileSection = filteredSections.find(
    (section) => section.type === 'profile'
  );

  return (
    <Sider
      collapsed={collapsed}
      width={260}
      collapsedWidth={80}
      style={styles.zxHostSidebarContainer}
      theme="light"
      trigger={null}
    >
      <div style={styles.zxHostSidebarContent}>
        {/* Header - Finora Style: Hamburger + Theme Toggle (side by side when expanded) */}
        <div style={styles.zxHostTopSection}>
          <div style={collapsed ? styles.zxHostControlsCollapsed : styles.zxHostControlsExpanded}>
            {/* Hamburger Toggle Button */}
            <ToggleButton />

            {/* Theme Toggle Capsule - Finora Style */}
            <div style={{
              ...styles.zxHostThemeCapsule,
              flexDirection: collapsed ? 'column' : 'row', // Vertical when collapsed, horizontal when expanded
            }}>
              <Tooltip title="Light mode" placement="right">
                <div
                  style={{
                    ...styles.zxHostThemeButton,
                    ...((!isDarkMode) ? styles.zxHostThemeButtonActive : {}),
                  }}
                  onClick={() => !isDarkMode || toggleTheme()}
                  role="button"
                  aria-label="Switch to light mode"
                  tabIndex={0}
                >
                  <i className="ri-sun-line" style={{ fontSize: '18px' }} />
                </div>
              </Tooltip>
              <Tooltip title="Dark mode" placement="right">
                <div
                  style={{
                    ...styles.zxHostThemeButton,
                    ...(isDarkMode ? styles.zxHostThemeButtonActive : {}),
                  }}
                  onClick={() => isDarkMode || toggleTheme()}
                  role="button"
                  aria-label="Switch to dark mode"
                  tabIndex={0}
                >
                  <i className="ri-moon-line" style={{ fontSize: '18px' }} />
                </div>
              </Tooltip>
              <Tooltip title="Change primary color" placement="right">
                <ColorPicker
                  value={primaryColor}
                  onChange={(color) => setPrimaryColor(color.toHexString())}
                  size="small"
                  showText={false}
                  disabledAlpha={true}
                  presets={[
                    {
                      label: 'Recommended',
                      colors: [
                        token.colorPrimary || '#0050d8',
                        '#0050d8',
                        '#52c41a',
                        '#fa8c16',
                        '#ff4d4f',
                        '#722ed1',
                        '#13c2c2',
                        '#eb2f96',
                      ],
                    },
                  ]}
                >
                  <div style={styles.zxHostThemeButton}>
                    <i className="ri-palette-line" style={{ fontSize: '18px' }} />
                  </div>
                </ColorPicker>
              </Tooltip>
            </div>
          </div>

          {/* Search Section */}
          {!collapsed && (
            <div style={styles.zxHostSearchContainer}>
              <Input
                placeholder="Search..."
                prefix={<i className="ri-search-line" />}
                style={styles.zxHostSearchInput}
                className="zx-host-search-input"
                size="middle"
                value={searchQuery}
                onChange={handleSearchChange}
                allowClear
              />
            </div>
          )}
        </div>

        {/* Scrollable Navigation Content */}
        <div style={styles.zxHostMainContent} className="zx-host-main-content">
          {/* Show "No results found" message when search has no results */}
          {searchQuery.trim() &&
            navigationSections.length === 0 &&
            !profileSection ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: token.colorTextSecondary,
                fontSize: '14px',
              }}
            >
              <i
                className="ri-search-line"
                style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              />
              No results found for {searchQuery}
            </div>
          ) : (
            /* Dynamic Navigation Sections Rendering (excluding profile) */
            navigationSections.map((section, index) =>
              renderSection(section, index)
            )
          )}
        </div>

        {/* Fixed Profile Section at Bottom */}
        {profileSection &&
          renderSection(profileSection, backendMenuSections.length - 1)}
      </div>
    </Sider>
  );
};

export default AppSidebar;
