// Import only essential font weights for faster initial load
import "@fontsource/inter/400.css"; // Regular - most used
import "@fontsource/inter/600.css"; // Semi-bold - for headings

// Import Remix Icons CSS
import 'remixicon/fonts/remixicon.css';

// Import Design System styles
import '@zionix-space/design-system/styles.css';

// Import custom styles last to allow overrides
import "./styles.scss";

// Lazy load additional font weights after initial render
setTimeout(() => {
  import("@fontsource/inter/300.css"); // Light
  import("@fontsource/inter/500.css"); // Medium
  import("@fontsource/inter/700.css"); // Bold
  import("@fontsource/inter/800.css"); // Extra Bold
}, 100);
import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import { initializeWarningSuppression } from "./utils/suppressWarnings";

// Suppress ResizeObserver errors (harmless, caused by React rendering cycles)
const resizeObserverErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
    return;
  }
};
window.addEventListener('error', resizeObserverErrorHandler);

// Initialize warning suppression for known Ant Design issues
initializeWarningSuppression();

// App wrapper
const AppWithLoader = () => {
  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById("main-module"));

root.render(
  <StrictMode>
    <AppWithLoader />
  </StrictMode>
);
