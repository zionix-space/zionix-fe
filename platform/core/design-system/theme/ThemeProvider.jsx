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
      /* Card Components - Premium glassmorphism styling */
      .ant-card {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
        background: ${isDarkMode
        ? 'rgba(255, 255, 255, 0.05) !important'
        : 'rgba(255, 255, 255, 0.7) !important'};
        border: 1px solid ${isDarkMode
        ? 'rgba(255, 255, 255, 0.1) !important'
        : 'rgba(0, 0, 0, 0.06) !important'};
        box-shadow: ${isDarkMode
        ? '0 8px 32px rgba(0, 0, 0, 0.3) !important'
        : '0 8px 32px rgba(0, 0, 0, 0.08) !important'};
      }

      .ant-card-head {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
        background: transparent !important;
        border-bottom: 1px solid ${isDarkMode
        ? 'rgba(255, 255, 255, 0.1) !important'
        : 'rgba(0, 0, 0, 0.06) !important'};
      }

      .ant-card-body {
        backdrop-filter: blur(40px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
        background: transparent !important;
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
  // Return base tokens without any overrides - use Ant Design defaults
  return {
    ...baseTokens,
    // Add device type for components to use
    deviceType,
    isMobile: deviceType === 'mobile',
    isDesktop: deviceType !== 'mobile',
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
   * Component-specific token configuration
   * Use pure Ant Design defaults - no customizations
   */
  const getComponentTokens = (isDark) => {
    return {
      // All components use Ant Design defaults
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
