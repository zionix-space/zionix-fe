/**
 * @fileoverview Modern Loading Spinner Component for Zionix Platform
 * 
 * A professional loading spinner component that follows Ant Design principles
 * and provides consistent visual feedback across the SaaS platform.
 * 
 * @author Zionix Design System Team
 * @version 1.0.0
 */

import React from 'react';
import { Spin, Typography } from 'antd';
import { useTheme } from '../../theme';

const { Text } = Typography;

// Fallback theme tokens with truly neutral grayscale colors
const FALLBACK_TOKENS = {
  colorPrimary: '#8c8c8c',
  colorTextSecondary: '#595959',
  colorBgContainer: '#fafafa',
  fontSizeSM: 14,
  marginSM: 12,
  marginXS: 8,
  paddingLG: 24,
  borderRadiusSM: 6,
};

// Safe theme hook that provides fallback values
const useSafeTheme = () => {
  try {
    const themeContext = useTheme();
    return {
      token: themeContext.token,
      hasTheme: true
    };
  } catch (error) {
    // Theme context not available, use fallback
    return {
      token: FALLBACK_TOKENS,
      hasTheme: false
    };
  }
};

/**
 * LoadingSpinner Component - Modern loading indicator with customizable options
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='default'] - Size of the spinner ('small', 'default', 'large')
 * @param {string} [props.message] - Optional loading message to display
 * @param {boolean} [props.fullScreen=false] - Whether to display as full screen overlay
 * @param {boolean} [props.centered=true] - Whether to center the spinner
 * @param {string} [props.tip] - Tip text to show below spinner
 * @param {React.ReactNode} [props.children] - Content to wrap with loading state
 * @param {boolean} [props.spinning=true] - Whether the spinner is active
 * @param {number} [props.delay=0] - Delay in milliseconds before showing spinner
 */
export const LoadingSpinner = ({
  size = 'default',
  message,
  fullScreen = false,
  centered = true,
  tip,
  children,
  spinning = true,
  delay = 0,
  ...props
}) => {
  const { token, hasTheme } = useSafeTheme();

  // Base styles for the spinner container
  const baseStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: token.marginSM,
  };

  // Full screen overlay styles
  const fullScreenStyles = {
    ...baseStyles,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: hasTheme 
      ? 'rgba(255, 255, 255, 0.9)' 
      : 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
    backdropFilter: hasTheme ? 'blur(4px)' : 'none',
    zIndex: 9999,
    minHeight: '100vh',
  };

  // Centered container styles
  const centeredStyles = {
    ...baseStyles,
    minHeight: children ? 'auto' : '200px',
    padding: token.paddingLG,
  };

  // Inline styles (when not centered)
  const inlineStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: token.marginXS,
  };

  // Message text styles
  const messageStyles = {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: '300px',
  };

  // Determine container styles based on props
  const containerStyles = fullScreen 
    ? fullScreenStyles 
    : centered 
    ? centeredStyles 
    : inlineStyles;

  // Spinner component with custom styling
  const SpinnerComponent = (
    <Spin
      size={size}
      spinning={spinning}
      delay={delay}
      tip={tip}
      {...props}
    >
      {children}
    </Spin>
  );

  // If we have children, wrap them with the spinner
  if (children) {
    return SpinnerComponent;
  }

  // Standalone spinner with optional message
  return (
    <div style={containerStyles}>
      <Spin
        size={size}
        spinning={spinning}
        delay={delay}
        tip={tip}
        {...props}
      />
      {message && (
        <Text style={messageStyles}>
          {message}
        </Text>
      )}
    </div>
  );
};

/**
 * FullScreenLoader - Convenience component for full-screen loading states
 */
export const FullScreenLoader = ({ message = "Loading...", ...props }) => (
  <LoadingSpinner
    fullScreen
    size="large"
    message={message}
    {...props}
  />
);

/**
 * InlineLoader - Convenience component for inline loading states
 */
export const InlineLoader = ({ message, ...props }) => (
  <LoadingSpinner
    centered={false}
    size="small"
    message={message}
    {...props}
  />
);

/**
 * PageLoader - Convenience component for page-level loading states
 */
export const PageLoader = ({ message = "Loading content...", ...props }) => (
  <LoadingSpinner
    size="large"
    message={message}
    {...props}
  />
);

/**
 * ThemeSafePageLoader - Special loader for use in Suspense fallbacks
 * This component works even when ThemeProvider context is not available
 */
export const ThemeSafePageLoader = ({ message = "Loading content...", ...props }) => {
  const fallbackStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '24px',
    gap: '12px',
  };

  const spinnerStyles = {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(31, 64, 252, 0.1)',
    borderTop: '3px solid #1f40fc',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const textStyles = {
    color: '#595959',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: '300px',
  };

  return (
    <div style={fallbackStyles}>
      <div style={spinnerStyles}></div>
      {message && (
        <div style={textStyles}>
          {message}
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;