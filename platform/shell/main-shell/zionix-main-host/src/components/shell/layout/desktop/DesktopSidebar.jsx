import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Menu,
  Badge,
  Avatar,
  Dropdown,
  Tooltip,
  theme,
} from "antd";
import { useTheme } from "@zionix/design-system";
import { useMenuData } from "../shared/MenuDataProvider";
import { useStyles } from "./DesktopSidebar.style";

// Using Remix Icons CSS classes for optimal performance

const { Sider } = Layout;
const { useToken } = theme;

const AppSidebar = ({ collapsed = false, onCollapse }) => {
  const { token } = useToken();
  const { isRTL } = useTheme();
  const styles = useStyles(token);
  const { 
    menuItems, 
    selectedKey, 
    setSelectedKey, 
    openKeys, 
    setOpenKeys,
    handleMenuSelect,
    handleOpenChange 
  } = useMenuData();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed !== null) {
      onCollapse(JSON.parse(savedCollapsed));
    }
  }, [onCollapse]);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+B or Cmd+B to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        onCollapse(!collapsed);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [collapsed, onCollapse]);

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  // Simulate backend response with sections
  const backendMenuSections = [
    {
      type: "section",
      id: "navigation",
      title: "Navigation Menu",
      accentColor: token.colorPrimary,
      items: menuItems,
    },
    {
      type: "section",
      id: "account",
      title: "Account Settings",
      accentColor: token.colorPrimary,
      items: [
        {
          key: "messages",
          icon: <i className="ri-message-line" />,
          label: "Messages",
          badge: "3",
        },
        {
          key: "notifications",
          icon: <i className="ri-notification-line" />,
          label: "Notifications",
          badge: "12",
        },
        {
          key: "help",
          icon: <i className="ri-question-line" />,
          label: "Help & Support",
        },
        {
          key: "settings",
          icon: <i className="ri-settings-line" />,
          label: "Settings",
        },
      ],
    },
    {
      type: "profile",
      id: "user-profile",
      userData: {
        name: "John Doe",
        email: "john@company.com",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      menuItems: [
        {
          key: "profile",
          icon: <i className="ri-dashboard-line" />,
          label: "Profile",
        },
        {
          key: "upgrade",
          icon: <i className="ri-star-line" />,
          label: "Upgrade to pro",
        },
        {
          key: "settings",
          icon: <i className="ri-settings-line" />,
          label: "Settings",
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          icon: <i className="ri-logout-box-line" />,
          label: "Logout",
        },
      ],
    },
  ];

  // Convert menu items to Ant Design Menu format
  const formatMenuItems = (items) => {
    return items.map((item) => {
      const menuItem = {
        key: item.key,
        icon: item.icon,
        label: item.badge ? (
          <div style={styles.zxHostMenuItemBadge}>
            <span>{item.label}</span>
            <Badge count={item.badge} size="small" />
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
    const isLastSection = index === backendMenuSections.length - 1;

    // Handle profile section differently
    if (section.type === "profile") {
      return (
        <div key={section.id} style={styles.zxHostProfileSection}>
          <div
            style={{
              ...styles.zxHostProfileContainer,
              ...(collapsed ? styles.zxHostProfileContainerCollapsed : {}),
            }}
          >
            <Dropdown
              menu={{
                items: section.menuItems,
              }}
              placement="topRight"
              trigger={["click"]}
            >
              <div
                style={{
                  ...styles.zxHostProfileContent,
                  ...(collapsed ? styles.zxHostProfileContentCollapsed : {}),
                  ...(isProfileHovered ? styles.zxHostProfileContentHover : {}),
                }}
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              >
                <Avatar
                  size={collapsed ? 24 : 32}
                  src={section.userData.avatar}
                  style={{
                    border: `1px solid ${token.colorBorder}`,
                  }}
                />
                {!collapsed && (
                  <div style={styles.zxHostProfileInfo}>
                    <div style={styles.zxHostProfileName}>
                      {section.userData.name}
                    </div>
                    <div style={styles.zxHostProfileEmail}>
                      {section.userData.email}
                    </div>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </div>
      );
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
        <div style={styles.zxHostMenuContainer}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            onSelect={({ key }) => handleMenuSelect(key)}
            inlineCollapsed={collapsed}
            items={formatMenuItems(section.items)}
            style={{
              border: "none",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    );
  };

  // Integrated Header Toggle Component
  const IntegratedToggle = () => {
    const toggleTooltip = collapsed
      ? `Expand sidebar (Ctrl+B)`
      : `Collapse sidebar (Ctrl+B)`;

    return (
      <div style={styles.zxHostToggleContainer}>
        {!collapsed && (
          <div style={styles.zxHostSearchContainer}>
            <Input
              placeholder="Search..."
              prefix={<i className="ri-search-line" />}
              style={styles.zxHostSearchInput}
              size="middle"
            />
          </div>
        )}

        <Tooltip
          title={toggleTooltip}
          placement={collapsed ? "right" : "bottom"}
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
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCollapse(!collapsed);
              }
            }}
          >
            {collapsed ? (
              <i
                className="ri-menu-line"
                style={{
                  fontSize: "16px",
                  ...styles.zxHostToggleIcon,
                  ...(isToggleHovered ? styles.zxHostToggleIconHover : {}),
                }}
              />
            ) : (
              <i
                className="ri-menu-fold-line"
                style={{
                  fontSize: "16px",
                  ...styles.zxHostToggleIcon,
                  ...(isToggleHovered ? styles.zxHostToggleIconHover : {}),
                }}
              />
            )}
          </div>
        </Tooltip>
      </div>
    );
  };

  // Separate profile section from navigation sections
  const navigationSections = backendMenuSections.filter(section => section.type !== "profile");
  const profileSection = backendMenuSections.find(section => section.type === "profile");

  return (
    <Sider
      collapsed={collapsed}
      width={260}
      collapsedWidth={64}
      style={{
        ...styles.zxHostSidebarContainer,
        [isRTL
          ? "borderLeft"
          : "borderRight"]: `1px solid ${token.colorBorderSecondary}`,
      }}
      theme="light"
      trigger={null}
    >
      <div style={styles.zxHostSidebarContent}>
        {/* Integrated Header with Toggle */}
        <IntegratedToggle />

        {/* Scrollable Navigation Content */}
        <div style={styles.zxHostMainContent}>
          {/* Dynamic Navigation Sections Rendering (excluding profile) */}
          {navigationSections.map((section, index) =>
            renderSection(section, index)
          )}
        </div>

        {/* Fixed Profile Section at Bottom */}
        {profileSection && renderSection(profileSection, backendMenuSections.length - 1)}
      </div>
    </Sider>
  );
};

export default AppSidebar;
