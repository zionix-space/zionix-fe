// Import Inter font for optimal performance
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Import Remix Icons CSS
import 'remixicon/fonts/remixicon.css';

// Import custom styles last to allow overrides
import "./styles.scss";
import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import App from "./app/app";
const root = ReactDOM.createRoot(document.getElementById("main-module"));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
