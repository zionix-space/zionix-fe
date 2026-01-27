import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { MicrofrontendLoader } from '@zionix-space/design-system';
import App from "./app/app";
import { initializeWarningSuppression } from "./utils/suppressWarnings";

// Performance optimization: Preload critical resources
const preloadCriticalResources = () => {
  // Preload critical CSS for Ant Design
  const antdStyleLink = document.createElement('link');
  antdStyleLink.rel = 'preload';
  antdStyleLink.as = 'style';
  antdStyleLink.href = '/antd.css';
  document.head.appendChild(antdStyleLink);

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  fontLink.href = '/fonts/inter.woff2';
  document.head.appendChild(fontLink);

  // Prefetch likely-to-be-needed chunks
  const prefetchFormBuilder = document.createElement('link');
  prefetchFormBuilder.rel = 'prefetch';
  prefetchFormBuilder.href = '/form-builder.js';
  document.head.appendChild(prefetchFormBuilder);
};

// Initialize performance optimizations
preloadCriticalResources();

// Initialize warning suppression for known Ant Design issues
initializeWarningSuppression();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <MicrofrontendLoader appName="Admin">
      <App />
    </MicrofrontendLoader>
  </StrictMode>
);
