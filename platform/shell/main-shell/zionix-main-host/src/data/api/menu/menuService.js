/**
 * @fileoverview Menu API Service
 * 
 * Centralized API service for menu-related operations.
 * Fetches user-specific menu permissions from the backend.
 * 
 * @author Zionix Platform Team
 * @version 2.1.0
 */

import axiosClient from "@zionix/apiCore";

/**
 * Transform API response to ensure consistent structure
 * Parse badge JSON strings and handle empty strings
 * @param {Object} apiResponse - Raw API response
 * @returns {Object} Transformed menu data
 */
const transformMenuResponse = (apiResponse) => {
  if (!apiResponse) return { mainNavigation: [], profileSection: null, config: {} };

  // Helper function to parse and clean badge data recursively
  const parseBadges = (items) => {
    if (!items || !Array.isArray(items)) return items;

    return items.map(item => {
      const newItem = { ...item };

      // Parse badge if it's a JSON string
      if (typeof newItem.badge === 'string') {
        // Try to parse as JSON
        try {
          const trimmed = newItem.badge.trim();
          if (trimmed === '' || trimmed === '""') {
            // Empty string or quoted empty string - set to null
            newItem.badge = null;
          } else if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            // Looks like JSON - try to parse
            newItem.badge = JSON.parse(trimmed);
          }
          // Otherwise keep as string (but will be filtered by getBadgeCount if empty)
        } catch (e) {
          // Not valid JSON, keep as string
          // But if it's empty, set to null
          if (newItem.badge === '' || newItem.badge.trim() === '') {
            newItem.badge = null;
          }
        }
      }

      // Recursively process children
      if (newItem.children && Array.isArray(newItem.children)) {
        newItem.children = parseBadges(newItem.children);
      }

      return newItem;
    });
  };

  // If response is already in correct format, parse badges and return
  if (apiResponse.mainNavigation && apiResponse.profileSection) {
    return {
      ...apiResponse,
      mainNavigation: parseBadges(apiResponse.mainNavigation),
      profileSection: apiResponse.profileSection ? {
        ...apiResponse.profileSection,
        items: parseBadges(apiResponse.profileSection.items || [])
      } : null
    };
  }

  // Handle legacy format or unexpected structure
  return {
    mainNavigation: parseBadges(Array.isArray(apiResponse) ? apiResponse : []),
    profileSection: apiResponse.profileSection || null,
    config: apiResponse.config || {},
  };
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
  getMenus: async ({ signal } = {}) => {
    try {
      const response = await axiosClient.get("/menus/login-user-menus", { signal });
      // axiosClient interceptor already unwraps response.data
      // Transform and return the data
      return transformMenuResponse(response);
    } catch (error) {
      console.error('Menu API Error:', error);
      throw error;
    }
  },
};

export default menuService;