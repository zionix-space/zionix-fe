/**
 * @fileoverview Authentication Router Component for Zionix Platform
 *
 * Handles routing between authentication pages with smooth transitions
 * and proper navigation flow. Integrates with React Router DOM for
 * seamless page transitions and URL management.
 *
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { baseMessage } from '@zionix-space/design-system';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';
import { login as loginService, forgotPassword, changePassword } from '../services/auth';

/**
 * Authentication Router Component
 *
 * Manages routing between authentication pages with the following routes:
 * - /login - Login page (default)
 * - /forgot-password - Forgot password page
 * - /change-password - Change password page
 *
 * Features:
 * - Smooth page transitions with Framer Motion
 * - Programmatic navigation between pages
 * - URL-based routing for deep linking
 * - Fallback redirect to login for unknown routes
 * - Integrated with shared Zustand store for cross-microfrontend auth
 *
 * @returns {JSX.Element} Authentication router component
 */
const AuthRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, setLoading, isPasswordChangeRequired } = useAuthStore();

  /**
   * Handle login form submission
   */
  const handleLogin = async (loginData) => {
    try {
      setLoading(true);

      const result = await loginService({
        email: loginData.email,
        password: loginData.password,
        remember_me: loginData.rememberMe,
        device_fingerprint: '',
      });

      // Store auth data in shared Zustand store
      setAuth({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        sessionId: result.sessionId,
        user: result.user,
        expiresIn: result.expiresIn,
        isPasswordChange: result.isPasswordChange,
      });

      // Check if password change is required
      if (result.isPasswordChange) {
        baseMessage.warning('Password change required');
        navigate('/change-password');
      } else {
        baseMessage.success('Login successful!');
        // Main router will automatically redirect to /apps via <Navigate>
        // when isAuthenticated becomes true in the shared Zustand store
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle forgot password form submission
   * @param {Object} forgotPasswordData - Forgot password form data
   * @param {string} forgotPasswordData.email - User email
   */
  const handleForgotPassword = async (forgotPasswordData) => {
    try {
      await forgotPassword(forgotPasswordData.email);
      baseMessage.success('Password reset email sent successfully!');

      // Navigate back to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      throw error; // Let the ForgotPasswordPage handle the error display
    }
  };

  /**
   * Handle change password form submission
   * @param {Object} changePasswordData - Change password form data
   * @param {string} changePasswordData.currentPassword - Current password
   * @param {string} changePasswordData.newPassword - New password
   */
  const handleChangePassword = async (changePasswordData) => {
    try {
      await changePassword({
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword,
      });

      baseMessage.success('Password changed successfully!');

      // The main app router will automatically redirect to /apps
      // when the auth store updates
    } catch (error) {
      throw error; // Let the ChangePasswordPage handle the error display
    }
  };

  /**
   * Navigate to login page
   */
  const navigateToLogin = () => {
    navigate('/login');
  };

  /**
   * Navigate to forgot password page
   */
  const navigateToForgotPassword = () => {
    navigate('/forgot-password');
  };

  /**
   * Navigate to change password page
   */
  const navigateToChangePassword = () => {
    navigate('/change-password');
  };

  /**
   * Navigate to sign up page (placeholder for future implementation)
   */
  const navigateToSignUp = () => {
    // TODO: Implement sign up navigation when sign up page is created
    console.log('Sign up navigation - to be implemented');
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Login Route */}
        <Route
          path="/"
          element={
            <LoginPage
              onLogin={handleLogin}
              onForgotPassword={navigateToForgotPassword}
              onSignUp={navigateToSignUp}
            />
          }
        />

        {/* Forgot Password Route */}
        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage
              onForgotPassword={handleForgotPassword}
              onBackToLogin={navigateToLogin}
            />
          }
        />

        {/* Change Password Route */}
        <Route
          path="/change-password"
          element={
            <ChangePasswordPage
              onChangePassword={handleChangePassword}
              onBackToLogin={navigateToLogin}
            />
          }
        />

        {/* Default Route - Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch All Route - Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AuthRouter;
