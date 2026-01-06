/**
 * @fileoverview Shared Authentication Zustand Store
 *
 * Global authentication store shared across all microfrontends.
 * Manages user state, tokens, and authentication status.
 *
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

/**
 * Authentication store interface
 * @typedef {Object} AuthStore
 * @property {Object|null} user - Current user data
 * @property {string|null} accessToken - JWT access token
 * @property {string|null} refreshToken - JWT refresh token
 * @property {string|null} sessionId - Session identifier
 * @property {number|null} tokenExpiry - Token expiry timestamp
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} isPasswordChangeRequired - Password change flag
 * @property {boolean} isLoading - Loading state
 * @property {Function} setAuth - Set authentication data
 * @property {Function} setUser - Update user data
 * @property {Function} setTokens - Update tokens
 * @property {Function} clearAuth - Clear all auth data
 * @property {Function} setLoading - Set loading state
 * @property {Function} isTokenExpired - Check if token is expired
 */

/**
 * Shared Zustand store for authentication across all microfrontends
 *
 * @example
 * ```js
 * import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';
 *
 * const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
 * ```
 */
export const useAuthStore = create(
    devtools(
        persist(
            (set, get) => ({
                // --- STATE ---

                /** @type {Object|null} Current authenticated user */
                user: null,

                /** @type {string|null} JWT access token */
                accessToken: null,

                /** @type {string|null} JWT refresh token */
                refreshToken: null,

                /** @type {string|null} Session identifier */
                sessionId: null,

                /** @type {number|null} Token expiry timestamp (milliseconds) */
                tokenExpiry: null,

                /** @type {boolean} Authentication status */
                isAuthenticated: false,

                /** @type {boolean} Password change required flag */
                isPasswordChangeRequired: false,

                /** @type {boolean} Loading state for auth operations */
                isLoading: false,

                // --- ACTIONS ---

                /**
                 * Set complete authentication data after login
                 * @param {Object} authData - Authentication data
                 * @param {string} authData.accessToken - JWT access token
                 * @param {string} authData.refreshToken - JWT refresh token
                 * @param {string} authData.sessionId - Session ID
                 * @param {Object} authData.user - User data
                 * @param {number} authData.expiresIn - Token expiry in seconds
                 * @param {boolean} authData.isPasswordChange - Password change required
                 */
                setAuth: (authData) => {
                    const expiryTime = authData.expiresIn
                        ? Date.now() + authData.expiresIn * 1000
                        : null;

                    // Also store in localStorage for axios interceptor
                    if (authData.accessToken) {
                        localStorage.setItem('zionix_access_token', authData.accessToken);
                    }
                    if (authData.refreshToken) {
                        localStorage.setItem('zionix_refresh_token', authData.refreshToken);
                    }
                    if (authData.sessionId) {
                        localStorage.setItem('zionix_session_id', authData.sessionId);
                    }
                    if (authData.user) {
                        localStorage.setItem('zionix_user_data', JSON.stringify(authData.user));
                    }
                    if (expiryTime) {
                        localStorage.setItem('zionix_token_expiry', expiryTime.toString());
                    }

                    set(
                        {
                            user: authData.user,
                            accessToken: authData.accessToken,
                            refreshToken: authData.refreshToken,
                            sessionId: authData.sessionId,
                            tokenExpiry: expiryTime,
                            isAuthenticated: true,
                            isPasswordChangeRequired: authData.isPasswordChange || false,
                            isLoading: false,
                        },
                        false,
                        'setAuth'
                    );
                },

                /**
                 * Update user data
                 * @param {Object} userData - Updated user data
                 */
                setUser: (userData) => {
                    if (userData) {
                        localStorage.setItem('zionix_user_data', JSON.stringify(userData));
                    }
                    set({ user: userData }, false, 'setUser');
                },

                /**
                 * Update tokens (for token refresh)
                 * @param {string} accessToken - New access token
                 * @param {string} refreshToken - New refresh token (optional)
                 * @param {number} expiresIn - Token expiry in seconds (optional)
                 */
                setTokens: (accessToken, refreshToken, expiresIn) => {
                    const expiryTime = expiresIn
                        ? Date.now() + expiresIn * 1000
                        : get().tokenExpiry;

                    // Update localStorage
                    if (accessToken) {
                        localStorage.setItem('zionix_access_token', accessToken);
                    }
                    if (refreshToken) {
                        localStorage.setItem('zionix_refresh_token', refreshToken);
                    }
                    if (expiryTime) {
                        localStorage.setItem('zionix_token_expiry', expiryTime.toString());
                    }

                    set(
                        {
                            accessToken,
                            refreshToken: refreshToken || get().refreshToken,
                            tokenExpiry: expiryTime,
                        },
                        false,
                        'setTokens'
                    );
                },

                /**
                 * Clear all authentication data (logout)
                 */
                clearAuth: () => {
                    // Clear localStorage
                    localStorage.removeItem('zionix_access_token');
                    localStorage.removeItem('zionix_refresh_token');
                    localStorage.removeItem('zionix_session_id');
                    localStorage.removeItem('zionix_user_data');
                    localStorage.removeItem('zionix_token_expiry');

                    set(
                        {
                            user: null,
                            accessToken: null,
                            refreshToken: null,
                            sessionId: null,
                            tokenExpiry: null,
                            isAuthenticated: false,
                            isPasswordChangeRequired: false,
                            isLoading: false,
                        },
                        false,
                        'clearAuth'
                    );
                },

                /**
                 * Set loading state
                 * @param {boolean} loading - Loading state
                 */
                setLoading: (loading) =>
                    set({ isLoading: Boolean(loading) }, false, 'setLoading'),

                /**
                 * Set password change required flag
                 * @param {boolean} required - Password change required
                 */
                setPasswordChangeRequired: (required) =>
                    set(
                        { isPasswordChangeRequired: Boolean(required) },
                        false,
                        'setPasswordChangeRequired'
                    ),

                // --- COMPUTED/GETTERS ---

                /**
                 * Check if token is expired
                 * @returns {boolean} True if token is expired
                 */
                isTokenExpired: () => {
                    const state = get();
                    if (!state.tokenExpiry) return true;
                    return Date.now() >= state.tokenExpiry;
                },

                /**
                 * Get user role IDs
                 * @returns {Array} Array of role IDs
                 */
                getUserRoles: () => {
                    const state = get();
                    return state.user?.roles || [];
                },

                /**
                 * Check if user has specific role
                 * @param {string} roleId - Role ID to check
                 * @returns {boolean} True if user has role
                 */
                hasRole: (roleId) => {
                    const state = get();
                    return state.user?.roles?.includes(roleId) || false;
                },

                /**
                 * Get user full name
                 * @returns {string} User full name
                 */
                getUserFullName: () => {
                    const state = get();
                    if (!state.user) return '';
                    return `${state.user.firstname || ''} ${state.user.lastname || ''}`.trim();
                },
            }),
            {
                name: 'auth-store', // localStorage key
                storage: createJSONStorage(() => localStorage),

                // Persist all auth data
                partialize: (state) => ({
                    user: state.user,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                    sessionId: state.sessionId,
                    tokenExpiry: state.tokenExpiry,
                    isAuthenticated: state.isAuthenticated,
                    isPasswordChangeRequired: state.isPasswordChangeRequired,
                }),

                // Rehydrate and validate on load
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        // Check if token is expired on rehydration
                        if (state.tokenExpiry && Date.now() >= state.tokenExpiry) {
                            // Token expired, clear auth
                            state.clearAuth();
                        }
                    }
                },

                // Version for migration support
                version: 1,
            }
        ),
        {
            name: 'auth-store', // DevTools name
        }
    )
);

export default useAuthStore;
