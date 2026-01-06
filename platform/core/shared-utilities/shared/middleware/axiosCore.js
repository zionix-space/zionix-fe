/**
 * @fileoverview Centralized API Client for All Microfrontends
 * 
 * Single axios instance shared across ALL apps in the platform.
 * Handles authentication, token refresh, and error handling.
 * 
 * IMPORTANT: This is the ONLY API client - all apps should use this!
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import axios from "axios";

// Single API Base URL for entire platform
// Configure via .env-cmdrc file: NX_PUBLIC_API_BASE=https://your-api.com/api/v1
const API_BASE_URL = process.env.NX_PUBLIC_API_BASE || 'https://zionix-be-v1-2.onrender.com/api/v1';

console.log('🌐 API Base URL:', API_BASE_URL);

/**
 * Shared axios instance for all microfrontends
 */
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to true if backend requires credentials
});

/**
 * Request Interceptor
 * Automatically adds authentication token to ALL requests
 */
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("zionix_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor
 * Handles token refresh and error responses for ALL apps
 */
axiosClient.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    // Handle request cancellation
    if (axios.isCancel(err)) {
      console.log('Request cancelled:', err.message);
      return Promise.reject({ cancelled: true, message: err.message });
    }

    const originalRequest = err.config;

    // Handle 429 Rate Limiting
    if (err.response?.status === 429) {
      const retryAfter = err.response.headers['retry-after'] || 5;
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);

      // Dispatch rate limit event for UI notification
      window.dispatchEvent(new CustomEvent('api:rate-limited', {
        detail: { retryAfter }
      }));

      return Promise.reject({
        status: 429,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        retryAfter
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("zionix_refresh_token");

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { access_token, refresh_token } = response.data;

        // Store new tokens (shared across all microfrontends)
        localStorage.setItem("zionix_access_token", access_token);
        if (refresh_token) {
          localStorage.setItem("zionix_refresh_token", refresh_token);
        }

        // Dispatch event to update Zustand store
        window.dispatchEvent(new CustomEvent('auth:token-refreshed', {
          detail: { access_token, refresh_token }
        }));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and dispatch logout event
        localStorage.removeItem("zionix_access_token");
        localStorage.removeItem("zionix_refresh_token");
        localStorage.removeItem("zionix_session_id");
        localStorage.removeItem("zionix_user_data");
        localStorage.removeItem("zionix_token_expiry");

        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    // Normalize error response for consistent handling
    const normalizedError = {
      status: err.response?.status,
      message: err.response?.data?.message || err.message || 'An error occurred',
      code: err.code,
      data: err.response?.data,
      isNetworkError: !err.response && err.request,
      isServerError: err.response?.status >= 500,
      isClientError: err.response?.status >= 400 && err.response?.status < 500,
    };

    return Promise.reject(normalizedError);
  }
);

export default axiosClient;
