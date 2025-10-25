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

import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";

/**
 * Color utility functions for dynamic color generation
 */
const colorUtils = {
  /**
   * Convert hex to RGB
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Convert RGB to hex
   */
  rgbToHex: (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /**
   * Lighten a color by percentage
   */
  lighten: (hex, percent) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    
    const amount = Math.round(2.55 * percent);
    const r = Math.min(255, rgb.r + amount);
    const g = Math.min(255, rgb.g + amount);
    const b = Math.min(255, rgb.b + amount);
    
    return colorUtils.rgbToHex(r, g, b);
  },

  /**
   * Darken a color by percentage
   */
  darken: (hex, percent) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    
    const amount = Math.round(2.55 * percent);
    const r = Math.max(0, rgb.r - amount);
    const g = Math.max(0, rgb.g - amount);
    const b = Math.max(0, rgb.b - amount);
    
    return colorUtils.rgbToHex(r, g, b);
  },

  /**
   * Add alpha to a color
   */
  addAlpha: (hex, alpha) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  },

  /**
   * Mix two colors
   */
  mix: (color1, color2, weight = 0.5) => {
    const rgb1 = colorUtils.hexToRgb(color1);
    const rgb2 = colorUtils.hexToRgb(color2);
    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r * (1 - weight) + rgb2.r * weight);
    const g = Math.round(rgb1.g * (1 - weight) + rgb2.g * weight);
    const b = Math.round(rgb1.b * (1 - weight) + rgb2.b * weight);

    return colorUtils.rgbToHex(r, g, b);
  }
};

/**
 * Generate semantic colors from primary color
 * @param {string} primaryColor - The primary color in hex format
 * @param {boolean} isDark - Whether this is for dark theme
 * @returns {Object} Object containing all semantic color tokens
 */
const generateSemanticColors = (primaryColor, isDark = false) => {
  if (isDark) {
    // Dark theme color generation
    return {
      colorPrimary: primaryColor,
      colorPrimaryBg: colorUtils.mix(primaryColor, "#000000", 0.9),           // Very dark primary for backgrounds
      colorPrimaryBgHover: colorUtils.mix(primaryColor, "#000000", 0.8),      // Slightly lighter for hover states
      colorPrimaryBorder: colorUtils.mix(primaryColor, "#000000", 0.6),       // Primary-tinted borders
      colorPrimaryBorderHover: colorUtils.mix(primaryColor, "#000000", 0.4),  // Primary border hover
      colorPrimaryHover: colorUtils.lighten(primaryColor, 10),                // Primary hover state
      colorPrimaryActive: colorUtils.lighten(primaryColor, 20),               // Primary active state
      colorPrimaryText: primaryColor,                                         // Primary for text
      colorPrimaryTextHover: colorUtils.lighten(primaryColor, 10),            // Primary text hover
      colorPrimaryTextActive: colorUtils.lighten(primaryColor, 20),           // Primary text active
    };
  } else {
    // Light theme color generation
    return {
      colorPrimary: primaryColor,
      colorPrimaryBg: colorUtils.mix(primaryColor, "#ffffff", 0.9),           // Very light primary for backgrounds
      colorPrimaryBgHover: colorUtils.mix(primaryColor, "#ffffff", 0.8),      // Slightly darker for hover states
      colorPrimaryBorder: colorUtils.mix(primaryColor, "#ffffff", 0.6),       // Primary-tinted borders
      colorPrimaryBorderHover: colorUtils.mix(primaryColor, "#ffffff", 0.4),  // Primary border hover
      colorPrimaryHover: colorUtils.lighten(primaryColor, 10),                // Primary hover state
      colorPrimaryActive: colorUtils.darken(primaryColor, 10),                // Primary active state
      colorPrimaryText: primaryColor,                                         // Primary for text
      colorPrimaryTextHover: colorUtils.lighten(primaryColor, 10),            // Primary text hover
      colorPrimaryTextActive: colorUtils.darken(primaryColor, 10),            // Primary text active
    };
  }
};

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
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

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
    isDesktop: deviceType === 'desktop'
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
  const [primaryColor, setPrimaryColor] = useState("#1f40fc"); // Dynamic primary color state
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
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.setAttribute(
      "data-direction",
      isRTL ? "rtl" : "ltr"
    );
  }, [isRTL]);

  /**
   * Generate dynamic light theme tokens based on selected primary color
   */
  const generateLightTokens = (primaryColor) => {
    const semanticColors = generateSemanticColors(primaryColor, false);
    
    return {
      // Dynamic primary color derivatives
      ...semanticColors,
      
      // Fill colors for different interaction states (light theme)
      colorFillQuaternary: colorUtils.addAlpha("#000000", 0.02),  // Lightest fill
      colorFillTertiary: colorUtils.addAlpha("#000000", 0.04),    // Light fill
      colorFillSecondary: colorUtils.addAlpha("#000000", 0.06),   // Medium fill
      colorFill: colorUtils.addAlpha("#000000", 0.08),            // Standard fill
      
      // Dynamic background colors with subtle primary tint
      colorBgContainer: colorUtils.mix(primaryColor, "#ffffff", 0.98),  // Very subtle primary tint (2% primary + 98% white)
      colorBgLayout: colorUtils.mix(primaryColor, "#ffffff", 0.95),     // Slightly more primary tint (5% primary + 95% white)
      colorBgElevated: "#ffffff",                                       // Pure white for elevated surfaces
      colorBgSpotlight: colorUtils.mix(primaryColor, "#ffffff", 0.97),  // Subtle highlight with primary tint
      colorBgMask: colorUtils.addAlpha("#000000", 0.45),               // Overlay backgrounds
      
      // Dynamic semantic tokens based on primary color
      colorBorderSecondary: colorUtils.mix(primaryColor, "#f0f0f0", 0.95),  // Subtle primary tint in borders
      colorTextSecondary: colorUtils.mix(primaryColor, "#666666", 0.85),    // Subtle primary tint in secondary text
      colorWhite: "#ffffff",
      colorSuccess: "#52c41a",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    };
  };

  /**
   * Generate dynamic dark theme tokens based on selected primary color
   */
  const generateDarkTokens = (primaryColor) => {
    const semanticColors = generateSemanticColors(primaryColor, true);
    
    return {
      // Dynamic primary color derivatives
      ...semanticColors,
      
      // Fill colors for different interaction states (dark theme)
      colorFillQuaternary: colorUtils.addAlpha("#ffffff", 0.02),  // Lightest fill
      colorFillTertiary: colorUtils.addAlpha("#ffffff", 0.04),    // Light fill
      colorFillSecondary: colorUtils.addAlpha("#ffffff", 0.06),   // Medium fill
      colorFill: colorUtils.addAlpha("#ffffff", 0.08),            // Standard fill
      
      // Dynamic background colors with subtle primary tint (dark theme)
      colorBgContainer: colorUtils.mix(primaryColor, "#1f1f1f", 0.95),  // Very subtle primary tint (5% primary + 95% dark)
      colorBgLayout: colorUtils.mix(primaryColor, "#141414", 0.92),     // Slightly more primary tint (8% primary + 92% darker)
      colorBgElevated: colorUtils.mix(primaryColor, "#262626", 0.97),   // Elevated surfaces with subtle tint
      colorBgSpotlight: colorUtils.mix(primaryColor, "#1a1a1a", 0.94),  // Highlighted areas with primary tint
      colorBgMask: colorUtils.addAlpha("#000000", 0.65),               // Overlay backgrounds
      
      // Dynamic semantic tokens based on primary color (dark theme)
      colorBorderSecondary: colorUtils.mix(primaryColor, "#303030", 0.90),  // Subtle primary tint in borders
      colorTextSecondary: colorUtils.mix(primaryColor, "#a6a6a6", 0.85),    // Subtle primary tint in secondary text
      colorWhite: "#ffffff",
      colorSuccess: "#52c41a",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    };
  };

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
      <ConfigProvider direction={isRTL ? "rtl" : "ltr"} theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
