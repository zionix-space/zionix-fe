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
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #f0f0f0',
          borderTop: '3px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <div style={{
          color: '#666',
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center'
        }}>Initializing Application...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
