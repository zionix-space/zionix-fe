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

const { Sider } = Layout;
const { useToken } = theme;

// CSS-in-JS styles with zx-host prefix for module federation isolation
const useStyles = (token) => ({
  zxHostSidebarContainer: {
    background: token.colorBgContainer,
    height: 'calc(100vh - 64px)',
    position: 'fixed',
    top: '64px',
    insetInlineStart: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
  },
  
  zxHostSidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 'calc(100vh - 64px)',
  },
  
  zxHostMainContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: token.paddingXS,
  },
  
  zxHostToggleContainer: {
    padding: token.padding,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: token.colorFillQuaternary,
  },
  
  zxHostToggleButton: {
    width: '32px',
    height: '32px',
    borderRadius: token.borderRadius,
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
    position: 'relative',
  },
  
  zxHostToggleButtonHover: {
    backgroundColor: `${token.colorPrimary}10`,
    borderColor: `${token.colorPrimary}30`,
  },
  
  zxHostToggleIcon: {
    fontSize: '16px',
    color: token.colorTextSecondary,
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
  },
  
  zxHostToggleIconHover: {
    color: token.colorPrimary,
  },
  
  zxHostSectionHeader: {
    padding: `${token.padding}px ${token.padding}px ${token.paddingSM}px ${token.padding}px`,
    fontSize: '11px',
    fontWeight: 600,
    color: token.colorTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: token.paddingSM,
  },
  
  zxHostSectionHeaderCollapsed: {
    height: token.padding,
    margin: `${token.paddingSM}px 0`,
  },
  
  zxHostSectionDivider: {
    flex: 1,
    height: '1px',
  },
  
  zxHostMenuContainer: {
    padding: '0 8px',
  },
  
  zxHostMenuItemBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  zxHostProfileSection: {
    flexShrink: 0,
    marginTop: 'auto',
  },
  
  zxHostProfileContainer: {
    padding: token.padding,
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
  },
  
  zxHostProfileContainerCollapsed: {
    padding: token.paddingSM,
  },
  
  zxHostProfileContent: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: token.paddingSM,
    borderRadius: token.borderRadius,
    transition: `background-color ${token.motionDurationMid} ${token.motionEaseInOut}`,
    justifyContent: 'flex-start',
  },
  
  zxHostProfileContentCollapsed: {
    padding: token.paddingXS,
    justifyContent: 'center',
  },
  
  zxHostProfileContentHover: {
    backgroundColor: token.colorFillSecondary,
  },
  
  zxHostProfileInfo: {
    marginLeft: token.padding,
    flex: 1,
  },
  
  zxHostProfileName: {
    fontWeight: 600,
    color: token.colorText,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    marginBottom: '2px',
  },
  
  zxHostProfileEmail: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    lineHeight: token.lineHeightSM,
  },
  
  zxHostSearchContainer: {
    padding: `${token.paddingSM}px ${token.padding}px ${token.padding}px ${token.padding}px`,
  },
  
  zxHostSearchInput: {
    borderRadius: token.borderRadius,
  }
});

const AppSidebar = ({ collapsed = false, onCollapse }) => {
  const { token } = useToken();
  const { isRTL } = useTheme();
  const styles = useStyles(token);
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [openKeys, setOpenKeys] = useState(["dashboard", "products"]);



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
      setIsTablet(
        width < tabletBreakpoint &&
          width >= mobileBreakpoint
      );

      // Auto-collapse on mobile
      if (width < mobileBreakpoint && !collapsed) {
        onCollapse(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed, onCollapse, token]);

  // 4-level nested menu items configuration (simulating backend response)
  const menuItems = [
    {
      key: "dashboard",
      icon: <i className="ri-dashboard-line" />,
      label: "Dashboard",
      children: [
        {
          key: "dashboard-overview",
          icon: <i className="ri-apps-line" />,
          label: "Overview",
          children: [
            {
              key: "dashboard-overview-main",
              label: "Main Dashboard",
              children: [
                { key: "dashboard-overview-main-widgets", label: "Widgets" },
                { key: "dashboard-overview-main-charts", label: "Charts" },
                { key: "dashboard-overview-main-metrics", label: "Metrics" },
              ]
            },
            {
              key: "dashboard-overview-custom",
              label: "Custom Views",
              children: [
                { key: "dashboard-overview-custom-personal", label: "Personal" },
                { key: "dashboard-overview-custom-team", label: "Team" },
                { key: "dashboard-overview-custom-company", label: "Company" },
              ]
            }
          ]
        },
        {
          key: "dashboard-analytics",
          icon: <i className="ri-line-chart-line" />,
          label: "Analytics",
          badge: "3",
          children: [
            {
              key: "dashboard-analytics-reports",
              label: "Reports",
              children: [
                { key: "dashboard-analytics-reports-daily", label: "Daily Reports" },
                { key: "dashboard-analytics-reports-weekly", label: "Weekly Reports" },
                { key: "dashboard-analytics-reports-monthly", label: "Monthly Reports" },
              ]
            },
            {
              key: "dashboard-analytics-insights",
              label: "Insights",
              children: [
                { key: "dashboard-analytics-insights-trends", label: "Trends" },
                { key: "dashboard-analytics-insights-predictions", label: "Predictions" },
              ]
            }
          ]
        }
      ]
    },
    {
      key: "products",
      icon: <i className="ri-shopping-bag-line" />,
      label: "Products",
      children: [
        {
          key: "products-catalog",
          icon: <i className="ri-price-tag-line" />,
          label: "Catalog",
          children: [
            {
              key: "products-catalog-items",
              label: "Items",
              children: [
                { key: "products-catalog-items-active", label: "Active Items" },
                { key: "products-catalog-items-draft", label: "Draft Items" },
                { key: "products-catalog-items-archived", label: "Archived Items" },
              ]
            },
            {
              key: "products-catalog-categories",
              label: "Categories",
              children: [
                { key: "products-catalog-categories-main", label: "Main Categories" },
                { key: "products-catalog-categories-sub", label: "Sub Categories" },
                { key: "products-catalog-categories-tags", label: "Tags" },
              ]
            }
          ]
        },
        {
          key: "products-inventory",
          icon: <i className="ri-database-line" />,
          label: "Inventory",
          badge: "12",
          children: [
            {
              key: "products-inventory-stock",
              label: "Stock Management",
              children: [
                { key: "products-inventory-stock-levels", label: "Stock Levels" },
                { key: "products-inventory-stock-alerts", label: "Low Stock Alerts" },
                { key: "products-inventory-stock-transfers", label: "Transfers" },
              ]
            },
            {
              key: "products-inventory-warehouses",
              label: "Warehouses",
              children: [
                { key: "products-inventory-warehouses-main", label: "Main Warehouse" },
                { key: "products-inventory-warehouses-secondary", label: "Secondary" },
              ]
            }
          ]
        },
        {
          key: "products-orders",
          icon: <i className="ri-store-line" />,
          label: "Orders",
          children: [
            {
              key: "products-orders-management",
              label: "Order Management",
              children: [
                { key: "products-orders-management-pending", label: "Pending Orders" },
                { key: "products-orders-management-processing", label: "Processing" },
                { key: "products-orders-management-completed", label: "Completed" },
                { key: "products-orders-management-cancelled", label: "Cancelled" },
              ]
            }
          ]
        }
      ]
    },
    {
      key: "schedule",
      icon: <i className="ri-calendar-line" />,
      label: "Schedule",
      children: [
        {
          key: "schedule-calendar",
          icon: <i className="ri-calendar-line" />,
          label: "Calendar",
          children: [
            {
              key: "schedule-calendar-personal",
              label: "Personal",
              children: [
                { key: "schedule-calendar-personal-events", label: "Events" },
                { key: "schedule-calendar-personal-reminders", label: "Reminders" },
              ]
            },
            {
              key: "schedule-calendar-team",
              label: "Team",
              children: [
                { key: "schedule-calendar-team-meetings", label: "Meetings" },
                { key: "schedule-calendar-team-deadlines", label: "Deadlines" },
              ]
            }
          ]
        }
      ]
    },
    {
      key: "my-task",
      icon: <i className="ri-file-text-line" />,
      label: "My Tasks",
      badge: "4",
      children: [
        {
          key: "my-task-active",
          icon: <i className="ri-folder-line" />,
          label: "Active Tasks",
          children: [
            {
              key: "my-task-active-high",
              label: "High Priority",
              children: [
                { key: "my-task-active-high-urgent", label: "Urgent" },
                { key: "my-task-active-high-important", label: "Important" },
              ]
            },
            {
              key: "my-task-active-normal",
              label: "Normal Priority",
              children: [
                { key: "my-task-active-normal-today", label: "Due Today" },
                { key: "my-task-active-normal-week", label: "This Week" },
              ]
            }
          ]
        },
        {
          key: "my-task-completed",
          icon: <i className="ri-trophy-line" />,
          label: "Completed",
          children: [
            {
              key: "my-task-completed-recent",
              label: "Recent",
              children: [
                { key: "my-task-completed-recent-today", label: "Today" },
                { key: "my-task-completed-recent-week", label: "This Week" },
              ]
            }
          ]
        }
      ]
    },
    {
      key: "reporting",
      icon: <i className="ri-bar-chart-line" />,
      label: "Reporting",
      children: [
        {
          key: "reporting-analytics",
          icon: <i className="ri-pie-chart-line" />,
          label: "Analytics",
          children: [
            {
              key: "reporting-analytics-sales",
              label: "Sales Analytics",
              children: [
                { key: "reporting-analytics-sales-revenue", label: "Revenue" },
                { key: "reporting-analytics-sales-conversion", label: "Conversion" },
                { key: "reporting-analytics-sales-trends", label: "Trends" },
              ]
            },
            {
              key: "reporting-analytics-performance",
              label: "Performance",
              children: [
                { key: "reporting-analytics-performance-kpi", label: "KPI Dashboard" },
                { key: "reporting-analytics-performance-metrics", label: "Metrics" },
              ]
            }
          ]
        },
        {
          key: "reporting-financial",
          icon: <i className="ri-funds-line" />,
          label: "Financial",
          children: [
            {
              key: "reporting-financial-statements",
              label: "Statements",
              children: [
                { key: "reporting-financial-statements-income", label: "Income Statement" },
                { key: "reporting-financial-statements-balance", label: "Balance Sheet" },
                { key: "reporting-financial-statements-cashflow", label: "Cash Flow" },
              ]
            }
          ]
        }
      ]
    }
  ];



  // Advanced section separator component
  const SectionSeparator = ({
    title,
    collapsed,
    accentColor = token.colorPrimary,
  }) => {
    if (collapsed) {
      // Return minimal spacing only - no visual indicators
      return (
        <div
          style={styles.zxHostSectionHeaderCollapsed}
          aria-label={title}
        />
      );
    }

    return (
      <div style={styles.zxHostSectionHeader}>
        <span>{title}</span>
        <div 
          style={{ 
            ...styles.zxHostSectionDivider,
            background: `linear-gradient(90deg, ${accentColor}30, transparent)` 
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
      items: menuItems
    },
    {
      type: "section", 
      id: "account",
      title: "Account Settings",
      accentColor: "#10b981",
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
      ]
    },
    {
      type: "profile",
      id: "user-profile",
      userData: {
        name: "John Doe",
        email: "john@company.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      menuItems: [
        {
          key: "profile",
          icon: <i className="ri-user-line" />,
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
      ]
    }
  ];

  // Convert menu items to Ant Design Menu format
  const formatMenuItems = (items) => {
    return items.map(item => {
      const menuItem = {
        key: item.key,
        icon: item.icon,
        label: item.badge ? (
          <div style={styles.zxHostMenuItemBadge}>
            <span>{item.label}</span>
            <Badge count={item.badge} size="small" />
          </div>
        ) : item.label,
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
          <div style={{
            ...styles.zxHostProfileContainer,
            ...(collapsed ? styles.zxHostProfileContainerCollapsed : {})
          }}>
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
                  ...(isProfileHovered ? styles.zxHostProfileContentHover : {})
                }}
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              >
                <Avatar
                  size={collapsed ? 28 : 40}
                  src={section.userData.avatar}
                  style={{
                    border: `2px solid ${token.colorBorder}`,
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
            onOpenChange={setOpenKeys}
            onSelect={({ key }) => setSelectedKey(key)}
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
              size="small"
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
              ...(isToggleHovered ? styles.zxHostToggleButtonHover : {})
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
                className="ri-menu-unfold-line" 
                style={{
                  ...styles.zxHostToggleIcon,
                  ...(isToggleHovered ? styles.zxHostToggleIconHover : {})
                }}
              />
            ) : (
              <i 
                className="ri-menu-fold-line" 
                style={{
                  ...styles.zxHostToggleIcon,
                  ...(isToggleHovered ? styles.zxHostToggleIconHover : {})
                }}
              />
            )}
          </div>
        </Tooltip>
      </div>
    );
  };

  return (
    <Sider
      collapsed={collapsed}
      width={260}
      collapsedWidth={64}
      style={{
        ...styles.zxHostSidebarContainer,
        [isRTL ? "borderLeft" : "borderRight"]: `1px solid ${token.colorBorderSecondary}`,
      }}
      theme="light"
      trigger={null}
    >
      <div style={styles.zxHostSidebarContent}>
        {/* Integrated Header with Toggle */}
        <IntegratedToggle />

        {/* Main Content */}
        <div style={styles.zxHostMainContent}>
          {/* Dynamic Sections Rendering */}
          {backendMenuSections.map((section, index) => 
            renderSection(section, index)
          )}
        </div>
      </div>
    </Sider>
  );
};

export default AppSidebar;
