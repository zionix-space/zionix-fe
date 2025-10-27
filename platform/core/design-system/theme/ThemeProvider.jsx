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
 * - Responsive tokens for mobile/desktop
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { generateLightTokens } from './lightTokens';
import { generateDarkTokens } from './darkTokens';



/**
 * Theme context for managing global theme state
 * @private
 */
const ThemeContext = createContext();

/**
 * Device detection hook for responsive tokens
 * @private
 */
const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setDeviceType(width <= 767 ? 'mobile' : 'desktop');
    };

    // Initial detection
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    deviceType,
    screenWidth,
    isMobile: deviceType === 'mobile',
    isDesktop: deviceType === 'desktop',
  };
};

/**
 * Creates responsive tokens based on device type
 * @param {Object} baseTokens - Base Ant Design tokens
 * @param {string} deviceType - 'mobile' or 'desktop'
 * @returns {Object} Enhanced tokens with responsive values
 */
const createResponsiveTokens = (baseTokens, deviceType) => {
  const isMobile = deviceType === 'mobile';

  // Mobile-specific token overrides
  const mobileTokens = {
    // Typography - smaller for mobile
    fontSize: 12,
    fontSizeSM: 10,
    fontSizeLG: 14,
    fontSizeXL: 16,
    fontSizeIcon: 22,

    // Control heights - reduced for mobile
    controlHeight: 28,
    controlHeightSM: 24,
    controlHeightLG: 36,
    controlHeightXL: 40,

    // Spacing - tighter for mobile
    padding: 6,
    paddingXXS: 2,
    paddingXS: 4,
    paddingSM: 6,
    paddingMD: 8,
    paddingLG: 12,
    paddingXL: 16,

    margin: 6,
    marginXXS: 2,
    marginXS: 4,
    marginSM: 6,
    marginMD: 8,
    marginLG: 12,
    marginXL: 16,

    // Border radius - slightly smaller for mobile
    borderRadius: 6,
    borderRadiusSM: 4,
    borderRadiusLG: 8,
    borderRadiusXL: 10,

    // Line heights - optimized for mobile
    lineHeight: 1.4,
    lineHeightSM: 1.3,
    lineHeightLG: 1.5,

    // Motion - faster for mobile
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  };

  // Desktop-specific token overrides
  const desktopTokens = {
    // Typography - standard sizes for desktop
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeIcon: 24,

    // Control heights - standard for desktop
    controlHeight: 32,
    controlHeightSM: 28,
    controlHeightLG: 48,
    controlHeightXL: 56,

    // Spacing - generous for desktop
    padding: 12,
    paddingXXS: 4,
    paddingXS: 8,
    paddingSM: 12,
    paddingMD: 16,
    paddingLG: 24,
    paddingXL: 32,

    margin: 12,
    marginXXS: 4,
    marginXS: 8,
    marginSM: 12,
    marginMD: 16,
    marginLG: 24,
    marginXL: 32,

    // Border radius - standard for desktop
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,
    borderRadiusXL: 16,

    // Line heights - optimized for desktop
    lineHeight: 1.5,
    lineHeightSM: 1.4,
    lineHeightLG: 1.6,

    // Motion - standard timing for desktop
    motionDurationFast: '0.15s',
    motionDurationMid: '0.25s',
    motionDurationSlow: '0.4s',
  };

  // Merge base tokens with responsive overrides
  const responsiveOverrides = isMobile ? mobileTokens : desktopTokens;

  return {
    ...baseTokens,
    ...responsiveOverrides,
    // Add device type for components to use
    deviceType,
    isMobile,
    isDesktop: !isMobile,
  };
};

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context value containing theme state and controls
 * @throws {Error} When used outside of ThemeProvider
 *
 * @example
 * ```jsx
 * const { isDarkMode, toggleTheme, isRTL, toggleRTL, theme, token } = useTheme();
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
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
 * - Responsive tokens for mobile/desktop
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
  const [primaryColor, setPrimaryColor] = useState('#1f40fc'); // Dynamic primary color state
  const { deviceType, isMobile, isDesktop } = useDeviceDetection();

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
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute(
      'data-direction',
      isRTL ? 'rtl' : 'ltr'
    );
  }, [isRTL]);



  // Generate dynamic tokens based on current primary color
  const baseLightTokens = generateLightTokens(primaryColor);
  const baseDarkTokens = generateDarkTokens(primaryColor);

  /**
   * Light theme configuration with responsive tokens
   */
  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: createResponsiveTokens(baseLightTokens, deviceType),
  };

  /**
   * Dark theme configuration with responsive tokens
   */
  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: createResponsiveTokens(baseDarkTokens, deviceType),
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
    token: currentTheme.token, // Direct access to tokens
    deviceType,
    isMobile,
    isDesktop,
    primaryColor,
    setPrimaryColor,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ConfigProvider direction={isRTL ? 'rtl' : 'ltr'} theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
