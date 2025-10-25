/**
 * @fileoverview Core Theme Provider for Zionix Design System
 *
 * This is the central theme management system for the entire Zionix platform.
 * It provides consistent theming across all apps, shells, and components.
 *
 * Features:
 * - Light/Dark mode support
 * - RTL/LTR direction support
 * - Ant Design integration
 * - Consistent design tokens
 * - Global theme state management
 *
 * Usage:
 * ```jsx
 * import { ThemeProvider, useTheme } from '@zionix/design-system';
 *
 * // Wrap your app
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * // Use in components
 * const { isDarkMode, toggleTheme, isRTL, toggleRTL } = useTheme();
 * ```
 *
 * @author Zionix Design System Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

/**
 * Theme context for managing global theme state
 * @private
 */
const ThemeContext = createContext();

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context value containing theme state and controls
 * @throws {Error} When used outside of ThemeProvider
 *
 * @example
 * ```jsx
 * const { isDarkMode, toggleTheme, isRTL, toggleRTL, theme } = useTheme();
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/**
 * Core Theme Provider Component
 *
 * Provides theme management for the entire Zionix platform including:
 * - Light/Dark mode switching
 * - RTL/LTR direction support
 * - Ant Design theme configuration
 * - Global design tokens
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Theme provider wrapper
 *
 * @example
 * ```jsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  /**
   * Toggle between LTR and RTL directions
   */
  const toggleRTL = () => {
    setIsRTL(!isRTL);
  };

  // Set HTML document direction when RTL changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.setAttribute(
      "data-direction",
      isRTL ? "rtl" : "ltr"
    );
  }, [isRTL]);

  /**
   * Light theme configuration
   * Defines the design tokens for light mode
   */
  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
      colorPrimary: "#1f40fc",
      colorBgContainer: "#ffffff",
      colorBgLayout: "#f5f5f5",
      colorBorderSecondary: "#e8e8e8",
      colorTextSecondary: "#666666",
      colorWhite: "#ffffff",
      colorSuccess: "#52c41a",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    },
  };

  /**
   * Dark theme configuration
   * Defines the design tokens for dark mode
   */
  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: "#979cf0",
      colorBgContainer: "#1f1f1f",
      colorBgLayout: "#141414",
      colorBorderSecondary: "#303030",
      colorTextSecondary: "#a6a6a6",
      colorWhite: "#ffffff",
      colorSuccess: "#52c41a",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    },
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  /**
   * Theme context value containing all theme state and controls
   */
  const themeContextValue = {
    isDarkMode,
    toggleTheme,
    isRTL,
    toggleRTL,
    theme: currentTheme,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ConfigProvider direction={isRTL ? "rtl" : "ltr"} theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
