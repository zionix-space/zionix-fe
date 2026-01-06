/**
 * @fileoverview Authentication Module Main Export
 * 
 * Central export point for the Zionix authentication module.
 * Provides all authentication services, components, hooks, and utilities.
 * 
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

// Shared Store (from shared-utilities)
export { useAuthStore } from './hooks/useAuthStore';

// Services
export {
    login,
    logout,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    changePassword,
    verifySession,
} from './services/auth';

export { default as apiClient } from './services/api/apiClient';

// Components
export { default as AuthRouter } from './components/AuthRouter';
export { default as LoginPage } from './pages/LoginPage';
export { default as ForgotPasswordPage } from './pages/ForgotPasswordPage';
export { default as ChangePasswordPage } from './pages/ChangePasswordPage';

// Hooks
export { default as useFormValidation } from './hooks/useFormValidation';

// Main App
export { default } from './app/app';
