// Import Inter font IMMEDIATELY for fastest loading (before React)
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";

// Import Remix Icons CSS
import 'remixicon/fonts/remixicon.css';

// Import Design System styles
import '@zionix-space/design-system/styles.css';

// Import custom styles last to allow overrides
import "./styles.scss";
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
