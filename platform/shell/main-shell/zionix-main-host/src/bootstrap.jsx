// Import Inter font for optimal performance
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Import Remix Icons CSS
import 'remixicon/fonts/remixicon.css';

// Import custom styles last to allow overrides
import "./styles.scss";
import React, { StrictMode, useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import { initializeWarningSuppression } from "./utils/suppressWarnings";

// Inject global Apple-inspired font styles
const injectGlobalFontStyles = () => {
  const styleId = 'zionix-global-fonts';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
      
      body,
      html,
      #main-module,
      .ant-app,
      .ant-layout,
      .ant-menu,
      .ant-btn,
      .ant-input,
      .ant-select,
      .ant-table,
      .ant-modal,
      .ant-drawer,
      .ant-dropdown,
      .ant-tooltip,
      .ant-popover,
      .ant-notification,
      .ant-message,
      .ant-alert,
      .ant-card,
      .ant-form,
      .ant-typography {
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
      }
      
      code,
      pre,
      .ant-typography-code,
      .ant-input-textarea {
        font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Inject fonts immediately
injectGlobalFontStyles();

// Initialize warning suppression for known Ant Design issues
initializeWarningSuppression();

// App wrapper with loading state
const AppWithLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const mountTimeRef = useRef(Date.now());

  useEffect(() => {
    const MIN_DISPLAY_TIME = 400; // Minimum time to show loader for visual feedback

    // Wait for critical resources to load and DOM to be ready
    const handleLoad = () => {
      // Calculate elapsed time since mount
      const elapsedTime = Date.now() - mountTimeRef.current;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

      // Wait for minimum display time + ensure content is painted
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsLoading(false);
          });
        });
      }, remainingTime);
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Also listen for DOMContentLoaded as fallback
      document.addEventListener('DOMContentLoaded', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
        document.removeEventListener('DOMContentLoaded', handleLoad);
      };
    }
  }, []);

  if (isLoading) {
    // Get theme settings from localStorage
    const primaryColor = typeof window !== 'undefined'
      ? (localStorage.getItem('zionix-theme-primary-color') || '#001968')
      : '#001968';
    const isDarkMode = typeof window !== 'undefined'
      ? (localStorage.getItem('zionix-theme-mode') === 'dark')
      : false;

    // Theme-aware colors
    const bgColor = isDarkMode ? '#141414' : '#ffffff';

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: bgColor,
        zIndex: 99999,
      }}>
        {/* Top Loading Bar - Indeterminate flowing style */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'transparent',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              background: `linear-gradient(90deg, transparent, ${primaryColor}, ${primaryColor}, transparent)`,
              animation: 'bootstrapFlowLoader 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              boxShadow: `0 0 10px ${primaryColor}`,
            }}
          />
        </div>
        <style>{`
          @keyframes bootstrapFlowLoader {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(350%);
            }
          }
        `}</style>
      </div>
    );
  }

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById("main-module"));

root.render(
  <StrictMode>
    <AppWithLoader />
  </StrictMode>
);
