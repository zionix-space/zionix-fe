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
 * Global Scrollbar Styles Component
 * Injects clean, professional scrollbar styling using current theme tokens
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
      /* Clean SaaS Scrollbar Styling */
      :root {
        --scrollbar-width: 8px;
        --scrollbar-track-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'
      };
        --scrollbar-thumb-color: ${themeTokens.colorBorderSecondary ||
      (isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)')
      };
        --scrollbar-thumb-hover-color: ${themeTokens.colorBorder ||
      (isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)')
      };
        --scrollbar-thumb-active-color: ${themeTokens.colorPrimary || '#1f40fc'
      };
      }

      /* Webkit Scrollbars (Chrome, Safari, Edge) */
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

      /* Firefox Scrollbars */
      * {
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#001968'); // Dynamic primary color state
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
   */
  const getComponentTokens = (isDark) => ({
    Select: {
      // Ensure consistent Select component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16, // Consistent caret size
      sizeUnit: 4,
      borderRadius: 6,
      // Override responsive tokens for Select specifically
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    Input: {
      // Consistent Input component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16,
      sizeUnit: 4,
      borderRadius: 6,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    Button: {
      // Consistent Button component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16,
      sizeUnit: 4,
      // ROUNDED BUTTON STYLING - Calculate border radius based on button height for perfect rounded appearance
      borderRadius: 16, // Half of controlHeight (32/2) for perfectly rounded default buttons
      controlHeightSM: 24,
      controlHeightLG: 40,
      // Rounded styling for different button sizes
      borderRadiusSM: 12, // Half of controlHeightSM (24/2) for perfectly rounded small buttons
      borderRadiusLG: 20, // Half of controlHeightLG (40/2) for perfectly rounded large buttons
      // CRITICAL: Explicit text colors for buttons
      colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
      colorTextDisabled: isDark
        ? 'rgba(255, 255, 255, 0.25)'
        : 'rgba(0, 0, 0, 0.25)',
    },
    DatePicker: {
      // Consistent DatePicker component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16,
      sizeUnit: 4,
      borderRadius: 6,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    TreeSelect: {
      // Consistent TreeSelect component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16,
      sizeUnit: 4,
      borderRadius: 6,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    Cascader: {
      // Consistent Cascader component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16,
      sizeUnit: 4,
      borderRadius: 6,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    AutoComplete: {
      // Consistent AutoComplete component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16,
      sizeUnit: 4,
      borderRadius: 6,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
    TimePicker: {
      // Consistent TimePicker component sizing
      controlHeight: 32,
      fontSize: 14,
      fontSizeIcon: 16,
      sizeUnit: 4,
      borderRadius: 6,
      controlHeightSM: 24,
      controlHeightLG: 40,
    },
  });

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
    setPrimaryColor,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <GlobalScrollbarStyles
        themeTokens={currentTheme.token}
        isDarkMode={isDarkMode}
      />
      <ConfigProvider direction={isRTL ? 'rtl' : 'ltr'} theme={currentTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
