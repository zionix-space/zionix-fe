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
   * @returns {Promise} API response with menu structure
   */
  getMenus: () => axiosClient.get("/permissions/menus"),
};

export default menuService;