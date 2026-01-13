import axios from 'axios';

// API base URL - can be configured via environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Menu Configuration API Service
 * Handles all API calls related to menu configuration
 */

/**
 * Loads menu configuration from the server
 * @returns {Promise<Object>} Menu configuration object
 */
export const loadMenuConfiguration = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/menu-configuration`);
        return response.data;
    } catch (error) {
        console.error('Failed to load menu configuration:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to load menu configuration'
        );
    }
};

/**
 * Saves menu configuration to the server
 * @param {Object} menuData - Complete menu configuration object
 * @returns {Promise<Object>} Saved menu configuration
 */
export const saveMenuConfiguration = async (menuData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/menu-configuration`, menuData);
        return response.data;
    } catch (error) {
        console.error('Failed to save menu configuration:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to save menu configuration'
        );
    }
};

/**
 * Creates a new menu configuration
 * @param {Object} menuData - Menu configuration object
 * @returns {Promise<Object>} Created menu configuration
 */
export const createMenuConfiguration = async (menuData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/menu-configuration`, menuData);
        return response.data;
    } catch (error) {
        console.error('Failed to create menu configuration:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to create menu configuration'
        );
    }
};

/**
 * Deletes a menu configuration
 * @param {string} configId - Configuration ID
 * @returns {Promise<void>}
 */
export const deleteMenuConfiguration = async (configId) => {
    try {
        await axios.delete(`${API_BASE_URL}/menu-configuration/${configId}`);
    } catch (error) {
        console.error('Failed to delete menu configuration:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to delete menu configuration'
        );
    }
};

/**
 * Validates menu configuration structure
 * @param {Object} menuData - Menu configuration to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateMenuConfiguration = async (menuData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/menu-configuration/validate`, menuData);
        return response.data;
    } catch (error) {
        console.error('Failed to validate menu configuration:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to validate menu configuration'
        );
    }
};
