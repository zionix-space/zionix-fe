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
 * @param {Object} apiResponse - Raw API response
 * @returns {Object} Transformed menu data
 */
const transformMenuResponse = (apiResponse) => {
  if (!apiResponse) return { mainNavigation: [], profileSection: null, config: {} };

  // If response is already in correct format, return as is
  if (apiResponse.mainNavigation && apiResponse.profileSection) {
    return apiResponse;
  }

  // Handle legacy format or unexpected structure
  return {
    mainNavigation: Array.isArray(apiResponse) ? apiResponse : [],
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