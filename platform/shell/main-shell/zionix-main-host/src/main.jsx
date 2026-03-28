import { setRemoteDefinitions } from "@nx/react/mf";

// Show initial loading state (this replaces the HTML loader)
const showInitialLoader = () => {
  // First, hide the HTML loader if it exists
  const htmlLoader = document.getElementById("html-loader");
  if (htmlLoader) {
    htmlLoader.style.display = "none";
  }

  // Get theme settings from localStorage
  const primaryColor = localStorage.getItem('zionix-theme-primary-color') || '#0565ff';
  const isDarkMode = localStorage.getItem('zionix-theme-mode') === 'dark';

  // Theme-aware colors
  const bgColor = isDarkMode ? '#141414' : '#ffffff';
  const textColor = isDarkMode ? '#e0e0e0' : '#444444';
  const barBgColor = isDarkMode ? '#2a2a2a' : '#e0e0e0';

  const loadingHTML = `
    <div id="initial-loader" style="
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(1rem, 5vw, 2rem);
      text-align: center;
      background: ${bgColor};
      z-index: 9999;
    ">
      <!-- Brand Name -->
      <div style="
        font-size: clamp(2rem, 6vw, 3.5rem);
        font-weight: 700;
        color: ${primaryColor};
        margin-bottom: clamp(2rem, 5vw, 3rem);
        letter-spacing: -0.02em;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">Zionix</div>
      
      <!-- Premium Bar Loader -->
      <div style="
        width: clamp(200px, 80vw, 400px);
        height: clamp(3px, 0.8vw, 4px);
        background: ${barBgColor};
        border-radius: clamp(2px, 0.5vw, 4px);
        position: relative;
        overflow: hidden;
        margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, transparent, ${primaryColor}, ${primaryColor}, transparent);
          border-radius: clamp(2px, 0.5vw, 4px);
          animation: shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          box-shadow: 0 0 clamp(8px, 2vw, 12px) ${primaryColor}33;
        "></div>
      </div>
      
      <!-- Loading Text -->
      <div style="
        margin-top: clamp(0.5rem, 2vw, 1rem);
        font-size: clamp(0.875rem, 2.5vw, 1rem);
        color: ${textColor};
        font-weight: 400;
        letter-spacing: 0.3px;
        opacity: 0.7;
      ">Loading your workspace…</div>
      
      <style>
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      </style>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", loadingHTML);
};

// Remove initial loading state
const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.3s ease-out";
    setTimeout(() => loader.remove(), 300);
  }
};

// Show loader immediately
showInitialLoader();

fetch("/assets/module-federation.manifest.json")
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import("./bootstrap").catch((err) => console.error(err))) // eslint-disable-line no-console
  .finally(() => {
    // Hide loader after a brief delay to ensure smooth transition
    setTimeout(hideInitialLoader, 500);
  });
