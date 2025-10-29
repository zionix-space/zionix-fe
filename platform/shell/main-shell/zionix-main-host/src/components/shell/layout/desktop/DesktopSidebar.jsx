import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Input,
  Menu,
  Badge,
  Avatar,
  Dropdown,
  Tooltip,
  theme,
} from 'antd';
import { useTheme } from '@zionix/design-system';
import { useMenuStore } from '../../../../data/stores/menu/useMenuStore';
import { useStyles } from './DesktopSidebar.style';

// Inject CSS for webkit scrollbar styles and Ant Design component overrides
const injectSidebarCSS = (token) => {
  const styleId = 'desktop-sidebar-styles';
  if (!document.getElementById(styleId)) {
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

    `;
    document.head.appendChild(style);
  }
};

// Using Remix Icons CSS classes for optimal performance

const { Sider } = Layout;
const { useToken } = theme;

const AppSidebar = ({ collapsed = false, onCollapse }) => {
  const { token } = useToken();
  const { isRTL } = useTheme();
  const styles = useStyles(token);
  // Get sidebar menu data from Zustand store
  const {
    sidebarMenus,
    selectedMainMenu,
    selectedSidebarKey,
    setSelectedSidebarKey,
    openSidebarKeys,
    setOpenSidebarKeys,
    completeMenuData,
  } = useMenuStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Menu selection handlers
  const handleMenuSelect = (key) => {
    setSelectedSidebarKey(key);
    console.log('Selected menu item:', key);
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

  // Inject sidebar CSS
  useEffect(() => {
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

  // Create menu sections directly from menu data - simple and clean!
  const createMenuSections = () => {
    const sections = [];

    // Main navigation section with children of selected main menu
    if (sidebarMenus.length > 0) {
      // Get section title from selected main menu, with fallback
      const sectionTitle = selectedMainMenu?.sectionTitle || 'Navigation Menu';

      sections.push({
        type: 'section',
        id: 'navigation',
        title: sectionTitle,
        accentColor: token.colorPrimary,
        items: sidebarMenus,
      });
    }

    // Profile section - direct access from completeMenuData
    if (completeMenuData?.profileSection) {
      sections.push({
        ...completeMenuData.profileSection,
        items: completeMenuData.profileSection.menuItems || [], // Ensure it's always an array
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
              size={32}
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
                fontSize: '16px',
                ...styles.zxHostToggleIcon,
                ...(isToggleHovered ? styles.zxHostToggleIconHover : {}),
              }}
            />
          ) : (
            <i
              className="ri-menu-fold-line"
              style={{
                fontSize: '16px',
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
      collapsedWidth={64}
      style={{
        ...styles.zxHostSidebarContainer,
        [isRTL
          ? 'borderLeft'
          : 'borderRight']: `1px solid ${token.colorBorderSecondary}`,
      }}
      theme="light"
      trigger={null}
    >
      <div style={styles.zxHostSidebarContent}>
        {/* Header with Search and Toggle - Separated to prevent re-renders */}
        <div style={styles.zxHostToggleContainer}>
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
          <ToggleButton />
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
