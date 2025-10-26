import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
import { initializeWarningSuppression } from "./utils/suppressWarnings";

// Initialize warning suppression for known Ant Design issues
initializeWarningSuppression();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
