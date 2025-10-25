import React, { createContext, useContext, useState, useEffect } from 'react';

// Menu Data Context
const MenuDataContext = createContext();

// Custom hook to use menu data
export const useMenuData = () => {
  const context = useContext(MenuDataContext);
  if (!context) {
    throw new Error('useMenuData must be used within a MenuDataProvider');
  }
  return context;
};

/**
 * Menu Data Provider Component - Provides menu data context and state management
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export const MenuDataProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [openKeys, setOpenKeys] = useState(['dashboard', 'products']);
  const [loading, setLoading] = useState(false);

  // Simulated menu data (extracted from AppSidebar.jsx)
  const defaultMenuItems = [
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
              ],
            },
            {
              key: "dashboard-overview-custom",
              label: "Custom Views",
              children: [
                { key: "dashboard-overview-custom-personal", label: "Personal" },
                { key: "dashboard-overview-custom-team", label: "Team" },
                { key: "dashboard-overview-custom-company", label: "Company" },
              ],
            },
          ],
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
              ],
            },
            {
              key: "dashboard-analytics-insights",
              label: "Insights",
              children: [
                { key: "dashboard-analytics-insights-trends", label: "Trends" },
                { key: "dashboard-analytics-insights-predictions", label: "Predictions" },
              ],
            },
          ],
        },
      ],
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
              ],
            },
            {
              key: "products-catalog-categories",
              label: "Categories",
              children: [
                { key: "products-catalog-categories-main", label: "Main Categories" },
                { key: "products-catalog-categories-sub", label: "Sub Categories" },
                { key: "products-catalog-categories-tags", label: "Tags" },
              ],
            },
          ],
        },
        {
          key: "products-inventory",
          icon: <i className="ri-database-line" />,
          label: "Inventory",
          badge: "12",
          children: [
            {
              key: "products-inventory-stock",
              label: "Stock Levels",
              children: [
                { key: "products-inventory-stock-low", label: "Low Stock" },
                { key: "products-inventory-stock-out", label: "Out of Stock" },
                { key: "products-inventory-stock-normal", label: "Normal Stock" },
              ],
            },
            {
              key: "products-inventory-warehouses",
              label: "Warehouses",
              children: [
                { key: "products-inventory-warehouses-main", label: "Main Warehouse" },
                { key: "products-inventory-warehouses-secondary", label: "Secondary" },
                { key: "products-inventory-warehouses-regional", label: "Regional" },
              ],
            },
          ],
        },
      ],
    },
    {
      key: "schedule-calendar",
      icon: <i className="ri-calendar-line" />,
      label: "Calendar",
    },
    {
      key: "my-tasks",
      icon: <i className="ri-task-line" />,
      label: "My Tasks",
      badge: "8",
      children: [
        {
          key: "my-task-active",
          icon: <i className="ri-play-circle-line" />,
          label: "Active Tasks",
          children: [
            {
              key: "my-task-active-high",
              label: "High Priority",
              children: [
                { key: "my-task-active-high-urgent", label: "Urgent" },
                { key: "my-task-active-high-important", label: "Important" },
              ],
            },
            {
              key: "my-task-active-normal",
              label: "Normal Priority",
              children: [
                { key: "my-task-active-normal-today", label: "Due Today" },
                { key: "my-task-active-normal-week", label: "This Week" },
              ],
            },
          ],
        },
        {
          key: "my-task-completed",
          icon: <i className="ri-trophy-line" />,
          label: "Completed",
          children: [
            { key: "my-task-completed-recent", label: "Recent" },
            { key: "my-task-completed-archived", label: "Archived" },
          ],
        },
      ],
    },
    {
      key: "reporting",
      icon: <i className="ri-bar-chart-line" />,
      label: "Reporting",
      children: [
        {
          key: "reporting-sales",
          icon: <i className="ri-money-dollar-circle-line" />,
          label: "Sales Reports",
          children: [
            { key: "reporting-sales-daily", label: "Daily Sales" },
            { key: "reporting-sales-monthly", label: "Monthly Sales" },
            { key: "reporting-sales-yearly", label: "Yearly Sales" },
          ],
        },
        {
          key: "reporting-performance",
          icon: <i className="ri-speed-up-line" />,
          label: "Performance",
          children: [
            { key: "reporting-performance-team", label: "Team Performance" },
            { key: "reporting-performance-individual", label: "Individual" },
          ],
        },
      ],
    },
  ];

  // Initialize menu data
  useEffect(() => {
    setMenuItems(defaultMenuItems);
  }, []);

  // Function to fetch menu data from API (for future implementation)
  const fetchMenuData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/menu');
      // const data = await response.json();
      // setMenuItems(data);
      
      // For now, use default data
      setMenuItems(defaultMenuItems);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setMenuItems(defaultMenuItems);
    } finally {
      setLoading(false);
    }
  };

  // Function to get flattened menu items for mobile bottom navigation
  const getFlatMenuItems = () => {
    const flatItems = [];
    
    const flatten = (items, level = 0) => {
      items.forEach(item => {
        if (level === 0) { // Only top-level items for mobile nav
          flatItems.push({
            key: item.key,
            icon: item.icon,
            label: item.label,
            badge: item.badge
          });
        }
        if (item.children) {
          flatten(item.children, level + 1);
        }
      });
    };
    
    flatten(menuItems);
    return flatItems.slice(0, 5); // Limit to 5 items for mobile bottom nav
  };

  // Function to get menu sections for organized display
  const getMenuSections = () => {
    return [
      {
        type: "section",
        id: "navigation",
        title: "Navigation Menu",
        items: menuItems,
      },
      {
        type: "profile",
        id: "profile",
        title: "Profile Section",
        user: {
          name: "John Doe",
          email: "john@company.com",
          avatar: null
        }
      }
    ];
  };

  const contextValue = {
    menuItems,
    selectedKey,
    setSelectedKey,
    openKeys,
    setOpenKeys,
    loading,
    fetchMenuData,
    getFlatMenuItems,
    getMenuSections,
    // Navigation handlers
    handleMenuSelect: (key) => {
      setSelectedKey(key);
    },
    handleOpenChange: (keys) => {
      setOpenKeys(keys);
    }
  };

  return (
    <MenuDataContext.Provider value={contextValue}>
      {children}
    </MenuDataContext.Provider>
  );
};

export default MenuDataProvider;