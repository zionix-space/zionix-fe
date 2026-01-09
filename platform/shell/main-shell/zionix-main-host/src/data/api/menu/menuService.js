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
      // So response here is the actual data from the API
      return response;
    } catch (error) {
      console.error('Menu API Error:', error);
      throw error;
    }
  },
};

export default menuService;