/**
 * @fileoverview Menu API Service
 * 
 * Centralized API service for menu-related operations.
 * Fetches user-specific menu permissions from the backend.
 * 
 * @author Zionix Platform Team
 * @version 2.0.0
 */

import axiosClient from "@zionix/apiCore";

/**
 * Dummy menu data for testing
 * TODO: Remove this when backend API is ready
 */
export const dummyMenuData = {
  /** Main navigation menus - displayed in topbar and their children in sidebar */
  mainNavigation: [
    {
      key: 'testing-app',
      label: 'Admin App',
      icon: '',
      description: 'Manage applications and configurations',
      badge: null,
      sectionTitle: 'Application section',
      children: [
        {
          key: 'app-management',
          label: 'App setup',
          icon: 'ri-apps-2-line',
          description: 'Manage applications and configurations',
          badge: null,
          sectionTitle: 'Application dfdf',
          children: [
            {
              key: 'domains', label: 'Domains', icon: null, description: 'Manage domain configurations', badge: null, children: [
                { key: 'lowcfgfgfode', label: 'gffgfgf', icon: null, description: 'Low code form viewer', badge: null, children: [] },
                { key: 'fgfg', label: 'fgfg', icon: null, description: 'Button components and styles', badge: null, children: [] }
              ]

            },
            { key: 'apps', label: 'Apps', icon: null, description: 'Application management', badge: { count: 5, color: 'blue' }, children: [] },
            { key: 'menus', label: 'Menus', icon: null, description: 'Menu configuration and management', badge: null, children: [] },
            { key: 'forms', label: 'Forms', icon: null, description: 'Form builder and management', badge: { count: 3, color: 'green' }, children: [] },
            { key: 'lowcode', label: 'Low Code Viewer', icon: null, description: 'Low code form viewer', badge: null, children: [] },
            { key: 'buttons', label: 'Buttons', icon: null, description: 'Button components and styles', badge: null, children: [] },
          ],
        },
        {
          key: 'client-management',
          label: 'Client setup',
          icon: 'ri-building-2-line',
          description: 'Client and organizational management',
          badge: null,
          sectionTitle: 'Client Management',
          children: [
            { key: 'clients', label: 'Clients', icon: null, description: 'Client information and management', badge: { count: 12, color: 'orange' }, children: [] },
            { key: 'entities-branches', label: 'Entities/Branches', icon: null, description: 'Organizational entities and branches', badge: null, children: [] },
            { key: 'date-time', label: 'Date & Time', icon: null, description: 'Date and time configurations', badge: null, children: [] },
            { key: 'department', label: 'Department', icon: null, description: 'Department management', badge: { count: 8, color: 'purple' }, children: [] },
            { key: 'divisions', label: 'Divisions', icon: null, description: 'Division and unit management', badge: null, children: [] },
            { key: 'job-code', label: 'Job Code', icon: null, description: 'Job classification and codes', badge: null, children: [] },
            { key: 'authentication-policies', label: 'Authentication Policies', icon: null, description: 'Security and authentication policies', badge: { count: 2, color: 'red' }, children: [] },
          ],
        },
        {
          key: 'user-roles-management',
          label: 'User Roles setup',
          icon: 'ri-user-settings-line',
          description: 'User roles and permissions management',
          badge: null,
          sectionTitle: 'User Management',
          children: [
            { key: 'roles', label: 'Roles', icon: null, description: 'Role definitions and permissions', badge: { count: 6, color: 'cyan' }, children: [] },
            { key: 'users', label: 'Users', icon: null, description: 'User accounts and management', badge: { count: 24, color: 'gold' }, children: [] },
          ],
        },
      ],
    },
    {
      key: 'fdfdf-app',
      label: 'Sourcing App',
      icon: '',
      description: 'Sourcing and procurement management',
      badge: null,
      sectionTitle: 'Sourcing',
      children: [
        {
          key: 'sourcing-management',
          label: 'Sourcing',
          icon: 'ri-shopping-cart-line',
          description: 'Manage sourcing operations',
          badge: null,
          children: [
            { key: 'vendors', label: 'Vendors', icon: null, badge: { count: 15, color: 'blue' }, children: [] },
            { key: 'purchase-orders', label: 'Purchase Orders', icon: null, badge: null, children: [] },
          ],
        },
      ],
    },
    {
      key: 'dfdfdf-app',
      label: 'Health App',
      icon: '',
      description: 'Healthcare management system',
      badge: null,
      sectionTitle: 'Healthcare',
      children: [
        {
          key: 'health-management',
          label: 'Health Records',
          icon: 'ri-heart-pulse-line',
          description: 'Manage health records',
          badge: null,
          children: [
            { key: 'patients', label: 'Patients', icon: null, badge: { count: 42, color: 'green' }, children: [] },
            { key: 'appointments', label: 'Appointments', icon: null, badge: null, children: [] },
          ],
        },
      ],
    },
    {
      key: 'sdsds-app',
      label: 'Report App',
      icon: '',
      description: 'Reporting and analytics',
      badge: null,
      sectionTitle: 'Reports',
      children: [
        {
          key: 'report-management',
          label: 'Reports',
          icon: 'ri-file-chart-line',
          description: 'Generate and view reports',
          badge: null,
          sectionTitle: 'Reports',
          children: [
            { key: 'analytics', label: 'Analytics', icon: null, badge: null, children: [] },
            { key: 'dashboards', label: 'Dashboards', icon: null, badge: { count: 7, color: 'purple' }, children: [] },
          ],
        },


        {
          key: 'report',
          label: 'Finance',
          icon: 'ri-file-chart-line',
          description: 'Generate and view reports',
          badge: null,
          sectionTitle: 'Finance',
          children: [
            { key: 'fdf', label: 'dfdfdf', icon: null, badge: null, children: [] },
            { key: 'dfd', label: 'dfdf', icon: null, badge: { count: 7, color: 'purple' }, children: [] },
          ],
        },
      ],
    },
  ],

  /** Profile section - bottom section of sidebar with user information and dropdown */
  profileSection: {
    type: 'profile',
    key: 'profile-section',
    userData: {
      name: 'John Doe',
      email: 'john@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: 'Administrator',
      status: 'online',
    },
    menuItems: [
      { key: 'profile', label: 'Profile', icon: 'ri-user-line', children: [] },
      { key: 'upgrade', label: 'Upgrade to Pro', icon: 'ri-star-line', badge: { count: 'NEW', color: 'gold' }, children: [] },
      { type: 'divider', key: 'profile-divider' },
      { key: 'logout', label: 'Logout', icon: 'ri-logout-box-line', children: [] },
    ],
  },

  /** Menu configuration and metadata */
  config: {
    version: '2.1.0',
    lastUpdated: '2024-01-15T10:30:00Z',
    dataHash: 'abc123def456',
    defaultExpandedKeys: [],
    defaultSelectedKeys: [],
    theme: 'light',
    mode: 'inline',
    collapsible: true,
    selectable: true,
    multiple: false,
  },
};

/**
 * Menu API service
 * @namespace menuService
 */
export const menuService = {
  /**
   * Fetch user's permitted menus from the backend
   * This endpoint returns menus based on user's role and permissions
   * @param {Object} options - Request options
   * @param {AbortSignal} options.signal - Abort signal for request cancellation
   * @returns {Promise} API response with menu structure
   */
  getMenus: ({ signal } = {}) => {
    // TODO: Uncomment this when backend is ready
    // return axiosClient.get("/permissions/menus", { signal });

    // For testing: Return dummy data with a simulated delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyMenuData);
      }, 500); // 500ms delay to simulate network request
    });
  },
};

export default menuService;