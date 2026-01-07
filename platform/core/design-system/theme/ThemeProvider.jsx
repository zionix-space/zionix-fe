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
 * Global Glassmorphism Styles Component
 * Injects premium Apple-style glassmorphism for all Ant Design components
 * @private
 */
const GlobalGlassmorphismStyles = ({ isDarkMode }) => {
  useEffect(() => {
    const existingStyle = document.getElementById('zionix-glassmorphism-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'zionix-glassmorphism-styles';
    style.textContent = `
      /* Premium Apple Glassmorphism for All Ant Design Components */
      
      /* Global Premium Apple Icon Styling - Bold stroke weight for all icons */
      i[class*="ri-"],
      .anticon,
      [class*="icon-"] {
        font-weight: 600 !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }

      /* Ensure Remix Icons have proper rendering */
      i[class*="ri-"] {
        font-style: normal !important;
        line-height: 1 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

   
      /* Card Components - Keep glassmorphism */
      .ant-card {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
        box-shadow: 
          0 4px 16px rgba(0, 0, 0, ${isDarkMode ? '0.2' : '0.08'}),
          0 2px 8px rgba(0, 0, 0, ${isDarkMode ? '0.15' : '0.04'}),
          inset 0 1px 0 rgba(255, 255, 255, ${isDarkMode ? '0.1' : '0.5'}) !important;
      }

      /* Modal & Drawer */
      .ant-modal-content,
      .ant-drawer-content {
        backdrop-filter: blur(60px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(60px) saturate(180%) !important;
        box-shadow: 
          0 12px 40px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.15'}),
          0 6px 20px rgba(0, 0, 0, ${isDarkMode ? '0.25' : '0.1'}),
          inset 0 1px 0 rgba(255, 255, 255, ${isDarkMode ? '0.15' : '0.6'}) !important;
      }

      /* Dropdown & Popover */
      .ant-dropdown,
      .ant-popover-inner,
      .ant-select-dropdown,
      .ant-picker-dropdown,
      .ant-cascader-dropdown {
        backdrop-filter: blur(60px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(60px) saturate(180%) !important;
        box-shadow: 
          0 8px 24px rgba(0, 0, 0, ${isDarkMode ? '0.25' : '0.12'}),
          0 4px 12px rgba(0, 0, 0, ${isDarkMode ? '0.2' : '0.08'}),
          inset 0 1px 0 rgba(255, 255, 255, ${isDarkMode ? '0.12' : '0.5'}) !important;
      }

      /* Table */
      .ant-table {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
      }

      .ant-table-thead > tr > th {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
      }

      /* Tabs */
      .ant-tabs-nav {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
      }

      /* Message & Notification */
      .ant-message-notice-content,
      .ant-notification-notice {
        backdrop-filter: blur(60px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(60px) saturate(180%) !important;
        box-shadow: 
          0 8px 24px rgba(0, 0, 0, ${isDarkMode ? '0.25' : '0.12'}),
          0 4px 12px rgba(0, 0, 0, ${isDarkMode ? '0.2' : '0.08'}),
          inset 0 1px 0 rgba(255, 255, 255, ${isDarkMode ? '0.12' : '0.5'}) !important;
      }

      /* Tooltip */
      .ant-tooltip-inner {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
      }

      /* Button hover effects */
      .ant-btn:not(.ant-btn-primary):not(.ant-btn-text):not(.ant-btn-link) {
        backdrop-filter: blur(20px) saturate(150%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      .ant-btn:not(.ant-btn-primary):not(.ant-btn-text):not(.ant-btn-link):hover {
        backdrop-filter: blur(30px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(30px) saturate(180%) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, ${isDarkMode ? '0.2' : '0.12'}) !important;
      }

      /* Primary button premium gradient */
      .ant-btn-primary {
        background: linear-gradient(135deg, var(--ant-primary-color) 0%, var(--ant-primary-color-hover) 100%) !important;
        box-shadow: 
          0 4px 12px rgba(var(--primary-rgb), 0.35),
          0 2px 6px rgba(var(--primary-rgb), 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      .ant-btn-primary:hover {
        transform: translateY(-1px) !important;
        box-shadow: 
          0 6px 16px rgba(var(--primary-rgb), 0.4),
          0 3px 8px rgba(var(--primary-rgb), 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
      }

   
      /* Prefix icons in inputs */
      .ant-input-prefix,
      .ant-input-suffix {
        color: ${isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'} !important;
        opacity: 1 !important;
      }

      /* Disabled state */
      .ant-input:disabled,
      .ant-input-disabled,
      .ant-input[disabled] {
        color: ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById('zionix-glassmorphism-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [isDarkMode]);

  return null;
};

/**
 * Global Scrollbar Styles Component
 * Injects clean, professional scrollbar styling using current theme tokens
 * Hidden by default, shows on hover
 * @private
 */
const GlobalScrollbarStyles = ({ themeTokens, isDarkMode }) => {
  useEffect(() => {
    // Remove existing scrollbar styles
    const existingStyle = document.getElementById('zionix-scrollbar-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element with theme-aware scrollbar styles
    const style = document.createElement('style');
    style.id = 'zionix-scrollbar-styles';
    style.textContent = `
      /* Clean SaaS Scrollbar Styling - Hidden by default, shows on hover */
      :root {
        --scrollbar-width: 8px;
        --scrollbar-track-color: transparent;
        --scrollbar-thumb-color: transparent;
        --scrollbar-thumb-hover-color: ${themeTokens.colorBorder ||
      (isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)')
      };
        --scrollbar-thumb-active-color: ${themeTokens.colorPrimary || '#1f40fc'
      };
      }

      /* Webkit Scrollbars (Chrome, Safari, Edge) - Hidden by default */
      ::-webkit-scrollbar {
        width: var(--scrollbar-width);
        height: var(--scrollbar-width);
      }

      ::-webkit-scrollbar-track {
        background: var(--scrollbar-track-color);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb-color);
        border-radius: 4px;
        transition: background-color 0.2s ease, box-shadow 0.2s ease;
      }

      /* Show scrollbar on hover */
      *:hover::-webkit-scrollbar-thumb {
        background: ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-thumb-hover-color);
        box-shadow: 0 0 0 1px var(--scrollbar-thumb-hover-color);
      }

      ::-webkit-scrollbar-thumb:active {
        background: var(--scrollbar-thumb-active-color);
      }

      ::-webkit-scrollbar-corner {
        background: var(--scrollbar-track-color);
      }

      /* Firefox Scrollbars - Hidden by default */
      * {
        scrollbar-width: none;
      }
      
      *:hover {
        scrollbar-width: thin;
        scrollbar-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'} transparent;
      }

      /* Enhanced scrollbar for specific containers */
      .ant-layout,
      .ant-layout-content,
      .ant-drawer-body,
      .ant-modal-body,
      .ant-table-body,
      .ant-select-dropdown,
      .ant-cascader-dropdown,
      .ant-tree-select-dropdown {
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
      }

      .ant-layout::-webkit-scrollbar,
      .ant-layout-content::-webkit-scrollbar,
      .ant-drawer-body::-webkit-scrollbar,
      .ant-modal-body::-webkit-scrollbar,
      .ant-table-body::-webkit-scrollbar,
      .ant-select-dropdown::-webkit-scrollbar,
      .ant-cascader-dropdown::-webkit-scrollbar,
      .ant-tree-select-dropdown::-webkit-scrollbar {
        width: var(--scrollbar-width);
        height: var(--scrollbar-width);
      }

      .ant-layout::-webkit-scrollbar-track,
      .ant-layout-content::-webkit-scrollbar-track,
      .ant-drawer-body::-webkit-scrollbar-track,
      .ant-modal-body::-webkit-scrollbar-track,
      .ant-table-body::-webkit-scrollbar-track,
      .ant-select-dropdown::-webkit-scrollbar-track,
      .ant-cascader-dropdown::-webkit-scrollbar-track,
      .ant-tree-select-dropdown::-webkit-scrollbar-track {
        background: var(--scrollbar-track-color);
        border-radius: 4px;
      }

      .ant-layout::-webkit-scrollbar-thumb,
      .ant-layout-content::-webkit-scrollbar-thumb,
      .ant-drawer-body::-webkit-scrollbar-thumb,
      .ant-modal-body::-webkit-scrollbar-thumb,
      .ant-table-body::-webkit-scrollbar-thumb,
      .ant-select-dropdown::-webkit-scrollbar-thumb,
      .ant-cascader-dropdown::-webkit-scrollbar-thumb,
      .ant-tree-select-dropdown::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb-color);
        border-radius: 4px;
        transition: background-color 0.2s ease, box-shadow 0.2s ease;
      }

      .ant-layout::-webkit-scrollbar-thumb:hover,
      .ant-layout-content::-webkit-scrollbar-thumb:hover,
      .ant-drawer-body::-webkit-scrollbar-thumb:hover,
      .ant-modal-body::-webkit-scrollbar-thumb:hover,
      .ant-table-body::-webkit-scrollbar-thumb:hover,
      .ant-select-dropdown::-webkit-scrollbar-thumb:hover,
      .ant-cascader-dropdown::-webkit-scrollbar-thumb:hover,
      .ant-tree-select-dropdown::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-thumb-hover-color);
        box-shadow: 0 0 0 1px var(--scrollbar-thumb-hover-color);
      }

      /* Mobile-friendly scrollbar (thinner on mobile) */
      @media (max-width: 768px) {
        :root {
          --scrollbar-width: 6px;
        }
        
        ::-webkit-scrollbar {
          width: var(--scrollbar-width);
          height: var(--scrollbar-width);
        }
      }

      /* Hide scrollbar on very small screens but keep functionality */
      @media (max-width: 480px) {
        :root {
          --scrollbar-width: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb:hover,
        ::-webkit-scrollbar-thumb:active {
          background: var(--scrollbar-thumb-hover-color);
        }
      }
    `;

    document.head.appendChild(style);

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById('zionix-scrollbar-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [themeTokens, isDarkMode]);

  return null; // This component only injects styles
};

/**
 * Primary Color CSS Variables Component
 * Injects CSS variables for primary color RGB values for glassmorphism effects
 * @private
 */
const PrimaryCSSVariables = ({ primaryColor }) => {
  useEffect(() => {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
        : { r: 0, g: 80, b: 216 }; // Default blue
    };

    const rgb = hexToRgb(primaryColor);

    // Set CSS variables on root
    document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    document.documentElement.style.setProperty('--ant-primary-color', primaryColor);

    // Calculate hover color (slightly lighter/darker)
    const hoverRgb = {
      r: Math.min(255, rgb.r + 20),
      g: Math.min(255, rgb.g + 20),
      b: Math.min(255, rgb.b + 20),
    };
    document.documentElement.style.setProperty('--ant-primary-color-hover', `rgb(${hoverRgb.r}, ${hoverRgb.g}, ${hoverRgb.b})`);
  }, [primaryColor]);

  return null;
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
    // Typography - smaller for mobile (but not affecting component-specific tokens)
    fontSize: 12,
    fontSizeSM: 10,
    fontSizeLG: 14,
    fontSizeXL: 16,
    // fontSizeIcon removed - let component tokens handle this

    // Control heights - reduced for mobile (but component tokens will override)
    // These are fallback values for components without specific tokens
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
    // Typography - standard sizes for desktop (but not affecting component-specific tokens)
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    // fontSizeIcon removed - let component tokens handle this

    // Control heights - standard for desktop (but component tokens will override)
    // These are fallback values for components without specific tokens
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
    // Preserve essential text colors from base tokens (CRITICAL - don't override these)
    colorText: baseTokens.colorText,
    colorTextBase: baseTokens.colorTextBase,
    colorTextHeading: baseTokens.colorTextHeading,
    colorTextLabel: baseTokens.colorTextLabel,
    colorTextDescription: baseTokens.colorTextDescription,
    colorTextDisabled: baseTokens.colorTextDisabled,
    colorTextPlaceholder: baseTokens.colorTextPlaceholder,
    colorTextSecondary: baseTokens.colorTextSecondary,
    // Preserve essential border colors from base tokens
    colorBorder: baseTokens.colorBorder,
    colorBorderSecondary: baseTokens.colorBorderSecondary,
    // Add device type for components to use
    deviceType,
    isMobile,
    isDesktop: !isMobile,
  };
};

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context value containing theme state and controls
 * 
 * NOTE: This hook now provides default values when used outside ThemeProvider,
 * making it safe to use anywhere in the application. However, for full functionality,
 * it's recommended to wrap your app with ThemeProvider.
 *
 * @example
 * ```jsx
 * const { isDarkMode, toggleTheme, isRTL, toggleRTL, theme, token } = useTheme();
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  // If no context (not wrapped in ThemeProvider), return safe defaults
  if (!context) {
    console.warn(
      'useTheme: No ThemeProvider found. Using default theme values. ' +
      'Wrap your app with <ThemeProvider> for full theme functionality.'
    );

    // Return default theme values that work without context
    const defaultLightTokens = generateLightTokens('#001968');
    const defaultDeviceType = typeof window !== 'undefined' && window.innerWidth <= 767 ? 'mobile' : 'desktop';

    return {
      isDarkMode: false,
      toggleTheme: () => console.warn('toggleTheme: ThemeProvider not found'),
      isRTL: false,
      toggleRTL: () => console.warn('toggleRTL: ThemeProvider not found'),
      theme: {
        algorithm: theme.defaultAlgorithm,
        token: createResponsiveTokens(defaultLightTokens, defaultDeviceType),
      },
      token: createResponsiveTokens(defaultLightTokens, defaultDeviceType),
      deviceType: defaultDeviceType,
      isMobile: defaultDeviceType === 'mobile',
      isDesktop: defaultDeviceType === 'desktop',
      primaryColor: '#001968',
      setPrimaryColor: () => console.warn('setPrimaryColor: ThemeProvider not found'),
    };
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
  // Load persisted theme preferences from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zionix-theme-mode');
      return saved === 'dark';
    }
    return false;
  });

  const [isRTL, setIsRTL] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zionix-theme-direction');
      return saved === 'rtl';
    }
    return false;
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zionix-theme-primary-color');
      return saved || '#001968';
    }
    return '#001968';
  });

  const { deviceType, isMobile, isDesktop } = useDeviceDetection();

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('zionix-theme-mode', newValue ? 'dark' : 'light');
      }
      return newValue;
    });
  };

  /**
   * Toggle between LTR and RTL directions
   */
  const toggleRTL = () => {
    setIsRTL((prev) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('zionix-theme-direction', newValue ? 'rtl' : 'ltr');
      }
      return newValue;
    });
  };

  /**
   * Update primary color and persist to localStorage
   */
  const updatePrimaryColor = (color) => {
    setPrimaryColor(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zionix-theme-primary-color', color);
    }
  };

  // Set HTML document direction when RTL changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute(
      'data-direction',
      isRTL ? 'rtl' : 'ltr'
    );
  }, [isRTL]);

  // Set HTML document theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    );
  }, [isDarkMode]);

  // Generate dynamic tokens based on current primary color
  const baseLightTokens = generateLightTokens(primaryColor);
  const baseDarkTokens = generateDarkTokens(primaryColor);

  /**
   * Component-specific token configuration to ensure consistent sizing
   * This overrides responsive tokens for specific components
   * PREMIUM APPLE GLASSMORPHISM STYLING
   */
  const getComponentTokens = (isDark) => {
    // Solid backgrounds for better readability - NO glassmorphism for inputs
    const solidBackground = isDark
      ? 'rgba(30, 30, 30, 1)'
      : 'rgba(255, 255, 255, 1)';
    const glassBorder = isDark
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.08)';
    const textColor = isDark
      ? 'rgba(255, 255, 255, 0.95)'
      : 'rgba(0, 0, 0, 0.95)';
    const placeholderColor = isDark
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(0, 0, 0, 0.5)';

    return {
      Select: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        // Solid background for readability
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      Input: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        // Solid background for readability
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      InputNumber: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      Button: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 16,
        controlHeightSM: 24,
        controlHeightLG: 40,
        borderRadiusSM: 12,
        borderRadiusLG: 20,
        colorText: textColor,
        colorTextDisabled: isDark
          ? 'rgba(255, 255, 255, 0.25)'
          : 'rgba(0, 0, 0, 0.25)',
      },
      DatePicker: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      TreeSelect: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      Cascader: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      AutoComplete: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      TimePicker: {
        controlHeight: 32,
        fontSize: 14,
        fontSizeIcon: 16,
        sizeUnit: 4,
        borderRadius: 12,
        controlHeightSM: 24,
        controlHeightLG: 40,
        colorBgContainer: solidBackground,
        colorBorder: glassBorder,
        colorText: textColor,
        colorTextPlaceholder: placeholderColor,
      },
      Card: {
        borderRadius: 16,
        colorBgContainer: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        colorBorder: glassBorder,
      },
      Modal: {
        borderRadius: 16,
        colorBgElevated: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        colorText: textColor,
      },
      Drawer: {
        colorBgElevated: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        colorText: textColor,
      },
      Dropdown: {
        borderRadius: 12,
        colorBgElevated: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        colorText: textColor,
      },
      Popover: {
        borderRadius: 12,
        colorBgElevated: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        colorText: textColor,
      },
      Tooltip: {
        borderRadius: 8,
        colorBgSpotlight: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(50, 50, 50, 0.95)',
        colorTextLightSolid: 'rgba(255, 255, 255, 0.95)',
      },
      Table: {
        borderRadius: 12,
        colorBgContainer: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        colorText: textColor,
      },
      Tabs: {
        borderRadius: 12,
        colorText: textColor,
      },
      Form: {
        colorText: textColor,
      },
      Checkbox: {
        borderRadius: 4,
        colorText: textColor,
      },
      Radio: {
        colorText: textColor,
      },
      Switch: {
        borderRadius: 100,
      },
      Slider: {
        borderRadius: 100,
      },
    };
  };

  /**
   * Light theme configuration with responsive tokens and component overrides
   */
  const lightTheme = {
    algorithm: theme.defaultAlgorithm,
    token: createResponsiveTokens(baseLightTokens, deviceType),
    components: getComponentTokens(false), // false = light theme
  };

  /**
   * Dark theme configuration with responsive tokens and component overrides
   */
  const darkTheme = {
    algorithm: theme.darkAlgorithm,
    token: createResponsiveTokens(baseDarkTokens, deviceType),
    components: getComponentTokens(true), // true = dark theme
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
    setPrimaryColor: updatePrimaryColor, // Use the persisting version
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <GlobalGlassmorphismStyles isDarkMode={isDarkMode} />
      <GlobalScrollbarStyles
        themeTokens={currentTheme.token}
        isDarkMode={isDarkMode}
      />
      <PrimaryCSSVariables primaryColor={primaryColor} />
      <ConfigProvider direction={isRTL ? 'rtl' : 'ltr'} theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
