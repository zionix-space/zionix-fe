// Import Inter font for optimal performance
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Import Remix Icons CSS
import 'remixicon/fonts/remixicon.css';

// Import custom styles last to allow overrides
import "./styles.scss";
import React, { StrictMode, useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import { initializeWarningSuppression } from "./utils/suppressWarnings";

// Initialize warning suppression for known Ant Design issues
initializeWarningSuppression();

// App wrapper with loading state
const AppWithLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization time and ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
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
    const textColor = isDarkMode ? '#e0e0e0' : '#444444';
    const barBgColor = isDarkMode ? '#2a2a2a' : '#e0e0e0';

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 5vw, 2rem)',
        textAlign: 'center',
        background: bgColor,
        zIndex: 9999,
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
      }}>
        <div style={{
          width: 'clamp(48px, 15vw, 80px)',
          height: 'clamp(48px, 15vw, 80px)',
          border: 'clamp(5px, 1.5vw, 8px) solid transparent',
          borderTop: `clamp(5px, 1.5vw, 8px) solid`,
          borderImage: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}dd) 1`,
          borderRadius: '50%',
          marginBottom: 'clamp(1rem, 4vw, 2rem)',
          animation: 'spin 1s linear infinite',
          boxShadow: `0 0 clamp(8px, 2vw, 12px) ${primaryColor}33`,
          willChange: 'transform'
        }}></div>
        <div style={{
          width: 'clamp(200px, 80vw, 400px)',
          height: 'clamp(4px, 1vw, 5px)',
          background: barBgColor,
          borderRadius: 'clamp(2px, 0.5vw, 4px)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}dd)`,
            borderRadius: 'clamp(2px, 0.5vw, 4px)',
            animation: 'shimmer 1.2s linear infinite',
            filter: 'blur(1px)'
          }}></div>
        </div>
        <div style={{
          marginTop: 'clamp(1rem, 3vw, 1.5rem)',
          fontSize: 'clamp(0.875rem, 2.5vw, 1.1rem)',
          color: textColor,
          letterSpacing: '0.3px'
        }}>Initializing Application…</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
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
