/**
 * @fileoverview Authentication Service
 * 
 * Handles all authentication-related API calls including login, logout,
 * password reset, and token refresh operations. Uses shared API client.
 * 
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import apiClient from '@zionix/apiCore';

/**
 * Login user with email and password
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {boolean} credentials.remember_me - Remember me flag
 * @param {string} credentials.device_fingerprint - Device fingerprint (optional)
 * @returns {Promise<Object>} Login response with tokens and user data
 */
export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/login', {
            email: credentials.email,
            password: credentials.password,
            remember_me: credentials.remember_me || false,
            device_fingerprint: credentials.device_fingerprint || '',
        });

        // Note: axiosClient interceptor already unwraps response.data
        // So response here is actually the data object from the API
        const {
            access_token,
            refresh_token,
            session_id,
            user,
            expires_in,
            is_password_change,
        } = response.data || response;

        return {
            success: true,
            accessToken: access_token,
            refreshToken: refresh_token,
            sessionId: session_id,
            user,
            expiresIn: expires_in,
            isPasswordChange: is_password_change,
        };
    } catch (error) {
        console.error('Login API error:', error);

        const errorMessage = error.response?.data?.message
            || error.response?.data?.error
            || 'Login failed. Please check your credentials.';

        throw new Error(errorMessage);
    }
};

/**
 * Logout user and clear session
 * @returns {Promise<void>}
 */
export const logout = async () => {
    try {
        // Call logout endpoint if available
        await apiClient.post('/logout');
    } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local logout even if API call fails
    } finally {
        // Dispatch logout event for all microfrontends
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export const refreshAccessToken = async (refreshToken) => {
    try {
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken,
        });

        // Note: axiosClient interceptor already unwraps response.data
        const { access_token, refresh_token: newRefreshToken } = response.data || response;

        return {
            accessToken: access_token,
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        console.error('Token refresh error:', error);
        throw new Error('Session expired. Please login again.');
    }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Password reset response
 */
export const forgotPassword = async (email) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', {
            email,
        });

        return {
            success: true,
            message: response.message || 'Password reset email sent successfully',
        };
    } catch (error) {
        console.error('Forgot password error:', error);

        const errorMessage = error.response?.data?.message
            || error.response?.data?.error
            || 'Failed to send password reset email.';

        throw new Error(errorMessage);
    }
};

/**
 * Reset password with token
 * @param {Object} data - Reset password data
 * @param {string} data.token - Reset token from email
 * @param {string} data.newPassword - New password
 * @returns {Promise<Object>} Reset password response
 */
export const resetPassword = async (data) => {
    try {
        const response = await apiClient.post('/auth/reset-password', {
            token: data.token,
            new_password: data.newPassword,
        });

        return {
            success: true,
            message: response.message || 'Password reset successfully',
        };
    } catch (error) {
        console.error('Reset password error:', error);

        const errorMessage = error.response?.data?.message
            || error.response?.data?.error
            || 'Failed to reset password.';

        throw new Error(errorMessage);
    }
};

/**
 * Change password for authenticated user
 * @param {Object} data - Change password data
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @returns {Promise<Object>} Change password response
 */
export const changePassword = async (data) => {
    try {
        const response = await apiClient.post('/auth/change-password', {
            current_password: data.currentPassword,
            new_password: data.newPassword,
        });

        return {
            success: true,
            message: response.message || 'Password changed successfully',
        };
    } catch (error) {
        console.error('Change password error:', error);

        const errorMessage = error.response?.data?.message
            || error.response?.data?.error
            || 'Failed to change password.';

        throw new Error(errorMessage);
    }
};

/**
 * Verify user session
 * @returns {Promise<Object>} User data if session is valid
 */
export const verifySession = async () => {
    try {
        const response = await apiClient.get('/auth/verify');

        return {
            success: true,
            user: response.user,
        };
    } catch (error) {
        console.error('Session verification error:', error);
        throw new Error('Invalid session');
    }
};
