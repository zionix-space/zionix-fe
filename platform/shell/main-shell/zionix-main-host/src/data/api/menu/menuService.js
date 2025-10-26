/**
 * @fileoverview Menu API Service
 * 
 * Centralized API service for all menu-related operations.
 * This service handles CRUD operations for menus and navigation data.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import axiosClient from "@zionix/apiCore";

/**
 * Menu API service with CRUD operations
 * @namespace menuService
 */
export const menuService = {
  // --- READ APIs ---
  
  /**
   * Fetch all menu items
   * @returns {Promise} API response with menu list
   */
  getMenuList: () => axiosClient.get("/menus"),
  
  /**
   * Fetch specific menu item by ID
   * @param {string|number} id - Menu item ID
   * @returns {Promise} API response with menu item
   */
  getMenuItem: (id) => axiosClient.get(`/menus/${id}`),
  
  /**
   * Fetch navigation structure
   * @returns {Promise} API response with navigation data
   */
  getNavigation: () => axiosClient.get("/menus/navigation"),

  // --- CREATE APIs ---
  
  /**
   * Create new menu item
   * @param {Object} payload - Menu item data
   * @returns {Promise} API response with created menu item
   */
  createMenu: (payload) => axiosClient.post("/menus", payload),

  // --- UPDATE APIs ---
  
  /**
   * Update existing menu item
   * @param {Object} params - Update parameters
   * @param {string|number} params.id - Menu item ID
   * @param {Object} params.payload - Updated menu item data
   * @returns {Promise} API response with updated menu item
   */
  updateMenu: ({ id, payload }) => axiosClient.put(`/menus/${id}`, payload),
  
  /**
   * Partially update menu item
   * @param {Object} params - Patch parameters
   * @param {string|number} params.id - Menu item ID
   * @param {Object} params.payload - Partial menu item data
   * @returns {Promise} API response with updated menu item
   */
  patchMenu: ({ id, payload }) => axiosClient.patch(`/menus/${id}`, payload),

  // --- DELETE APIs ---
  
  /**
   * Delete menu item
   * @param {string|number} id - Menu item ID
   * @returns {Promise} API response
   */
  deleteMenu: (id) => axiosClient.delete(`/menus/${id}`),
  
  /**
   * Bulk delete menu items
   * @param {Array<string|number>} ids - Array of menu item IDs
   * @returns {Promise} API response
   */
  bulkDeleteMenus: (ids) => axiosClient.delete("/menus/bulk", { data: { ids } }),
};

// Legacy export for backward compatibility
export const hostAppService = menuService;

export default menuService;