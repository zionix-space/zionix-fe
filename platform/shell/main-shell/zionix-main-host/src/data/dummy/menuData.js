/**
 * @fileoverview Comprehensive Menu Data Structure
 *
 * Unified menu data structure following Ant Design's menu documentation.
 * This structure includes main navigation, account settings, and profile sections
 * in one comprehensive format that can be replicated by backend developers.
 *
 * @author Zionix Platform Team
 * @version 2.0.0
 */

/**
 * Comprehensive menu structure for the entire application
 * Following Ant Design's menu structure with proper grouping, sections, and expandable states
 *
 * Structure includes:
 * - Main navigation menus (topbar items with children for sidebar)
 * - Account settings section (always visible in sidebar)
 * - Profile section (bottom of sidebar with user data and dropdown)
 *
 * Each menu item follows Ant Design's structure:
 * - key: unique identifier
 * - label: display text
 * - icon: Remix icon class name
 * - type: 'group', 'divider', 'item' (optional, defaults to 'item')
 * - children: nested menu items
 * - badge: notification badge { count, color }
 * - expanded: default expanded state for submenus
 * - disabled: whether item is disabled
 */
export const dummyMenuData = {
  /**
   * Main navigation menus - displayed in topbar and their children in sidebar
   */
  mainNavigation: [
    {
      key: 'app-management',
      label: 'App setup',
      icon: 'ri-apps-line',
      description: 'Manage applications and configurations',
      badge: null,
      children: [
        {
          key: 'domains',
          label: 'Domains',
          icon: 'ri-global-line',
          description: 'Manage domain configurations',
          badge: null,
          children: [],
        },
        {
          key: 'apps',
          label: 'Apps',
          icon: 'ri-smartphone-line',
          description: 'Application management',
          badge: { count: 5, color: 'blue' },
          children: [],
        },
        {
          key: 'menus',
          label: 'Menus',
          icon: 'ri-menu-line',
          description: 'Menu configuration and management',
          badge: null,
          children: [],
        },
        {
          key: 'forms',
          label: 'Forms',
          icon: 'ri-file-list-line',
          description: 'Form builder and management',
          badge: { count: 3, color: 'green' },
          children: [],
        },
        {
          key: 'buttons',
          label: 'Buttons',
          icon: 'ri-checkbox-line',
          description: 'Button components and styles',
          badge: null,
          children: [],
        },
      ],
    },
    {
      key: 'client-management',
      label: 'Client setup',
      icon: 'ri-user-line',
      description: 'Client and organizational management',
      badge: null,
      children: [
        {
          key: 'clients',
          label: 'Clients',
          icon: 'ri-team-line',
          description: 'Client information and management',
          badge: { count: 12, color: 'orange' },
          children: [],
        },
        {
          key: 'entities-branches',
          label: 'Entities/Branches',
          icon: 'ri-building-line',
          description: 'Organizational entities and branches',
          badge: null,
          children: [],
        },
        {
          key: 'date-time',
          label: 'Date & Time',
          icon: 'ri-calendar-line',
          description: 'Date and time configurations',
          badge: null,
          children: [],
        },
        {
          key: 'department',
          label: 'Department',
          icon: 'ri-organization-chart',
          description: 'Department management',
          badge: { count: 8, color: 'purple' },
          children: [],
        },
        {
          key: 'divisions',
          label: 'Divisions',
          icon: 'ri-git-branch-line',
          description: 'Division and unit management',
          badge: null,
          children: [],
        },
        {
          key: 'job-code',
          label: 'Job Code',
          icon: 'ri-briefcase-line',
          description: 'Job classification and codes',
          badge: null,
          children: [],
        },
        {
          key: 'authentication-policies',
          label: 'Authentication Policies',
          icon: 'ri-shield-user-line',
          description: 'Security and authentication policies',
          badge: { count: 2, color: 'red' },
          children: [],
        },
      ],
    },
    {
      key: 'user-roles-management',
      label: 'User Roles setup',
      icon: 'ri-user-settings-line',
      description: 'User roles and permissions management',
      badge: null,
      children: [
        {
          key: 'roles',
          label: 'Roles',
          icon: 'ri-user-settings-line',
          description: 'Role definitions and permissions',
          badge: { count: 6, color: 'cyan' },
          children: [],
        },
        {
          key: 'users',
          label: 'Users',
          icon: 'ri-group-line',
          description: 'User accounts and management',
          badge: { count: 24, color: 'gold' },
          children: [],
        },
      ],
    },
  ],

  /**
   * Account settings section - always visible in sidebar below main navigation
   * This section appears consistently across all main menu selections
   */
  accountSettings: {
    type: 'group',
    key: 'account-settings-group',
    label: 'Account Settings',
    children: [
      {
        type: 'divider',
        key: 'account-divider',
      },
      {
        key: 'messages',
        label: 'Messages',
        icon: 'ri-message-line',
        badge: { count: 3, color: 'red' },
        children: [],
      },
      {
        key: 'notifications',
        label: 'Notifications',
        icon: 'ri-notification-line',
        badge: { count: 12, color: 'orange' },
        children: [],
      },
      {
        key: 'help-support',
        label: 'Help & Support',
        icon: 'ri-question-line',
        badge: null,
        children: [],
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: 'ri-settings-line',
        badge: null,
        children: [],
      },
    ],
  },

  /**
   * Profile section - bottom section of sidebar with user information and dropdown
   * Contains user data and profile-related menu items
   */
  profileSection: {
    type: 'profile',
    key: 'profile-section',
    userData: {
      name: 'John Doe',
      email: 'john@company.com',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'Administrator',
      status: 'online',
    },
    menuItems: [
      {
        key: 'profile',
        label: 'Profile',
        icon: 'ri-user-line',
        children: [],
      },
      {
        key: 'upgrade',
        label: 'Upgrade to Pro',
        icon: 'ri-star-line',
        badge: { count: 'NEW', color: 'gold' },
        children: [],
      },
      {
        key: 'account-settings',
        label: 'Account Settings',
        icon: 'ri-settings-line',
        children: [],
      },
      {
        type: 'divider',
        key: 'profile-divider',
      },
      {
        key: 'logout',
        label: 'Logout',
        icon: 'ri-logout-box-line',
        children: [],
      },
    ],
  },

  /**
   * Menu configuration and metadata
   */
  config: {
    version: '2.1.0', // Increment this when menu structure changes
    lastUpdated: '2024-01-15T10:30:00Z', // Use ISO timestamp from database
    dataHash: 'abc123def456', // Optional: hash of menu data for change detection
    defaultExpandedKeys: [], // Keys that should be expanded by default
    defaultSelectedKeys: [], // Keys that should be selected by default
    theme: 'light', // Menu theme: 'light' | 'dark'
    mode: 'inline', // Menu mode: 'vertical' | 'horizontal' | 'inline'
    collapsible: true, // Whether menu can be collapsed
    selectable: true, // Whether menu items are selectable
    multiple: false, // Whether multiple items can be selected
  },
};

/**
 * Simulate API call to fetch comprehensive menu data with version checking
 * @param {string} currentVersion - Current cached version
 * @returns {Promise<Object|null>} Promise resolving to complete menu structure or null if no update
 */
export const fetchMenuData = async (currentVersion = null) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // In real implementation, this would be an API call like:
  // const response = await fetch('/api/menu-data?version=' + currentVersion);
  // if (response.status === 304) return null; // No changes
  // return response.json();
  
  // For now, always return data (in real app, compare versions)
  return {
    ...dummyMenuData,
    config: {
      ...dummyMenuData.config,
      lastUpdated: new Date().toISOString(), // Current timestamp
    }
  };
};
