import { setRemoteDefinitions } from "@nx/react/mf";

// Show initial loading state (this replaces the HTML loader)
const showInitialLoader = () => {
  // First, hide the HTML loader if it exists
  const htmlLoader = document.getElementById("html-loader");
  if (htmlLoader) {
    htmlLoader.style.display = "none";
  }

  // Get theme settings from localStorage
  const primaryColor = localStorage.getItem('zionix-theme-primary-color') || '#001968';
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
      font-family:"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif";
    ">
      <div class="loader-spinner" style="
        width: clamp(48px, 15vw, 80px);
        height: clamp(48px, 15vw, 80px);
        border: clamp(5px, 1.5vw, 8px) solid transparent;
        border-top: clamp(5px, 1.5vw, 8px) solid;
        border-image: linear-gradient(90deg, ${primaryColor}, ${primaryColor}dd) 1;
        border-radius: 50%;
        margin-bottom: clamp(1rem, 4vw, 2rem);
        animation: spin 1s linear infinite;
        box-shadow: 0 0 clamp(8px, 2vw, 12px) ${primaryColor}33;
        will-change: transform;
      "></div>
      <div class="loader-bar" style="
        width: clamp(200px, 80vw, 400px);
        height: clamp(4px, 1vw, 5px);
        background: ${barBgColor};
        border-radius: clamp(2px, 0.5vw, 4px);
        position: relative;
        overflow: hidden;
        margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, ${primaryColor}, ${primaryColor}dd);
          border-radius: clamp(2px, 0.5vw, 4px);
          animation: shimmer 1.2s linear infinite;
          filter: blur(1px);
        "></div>
      </div>
      <div class="loader-text" style="
        margin-top: clamp(1rem, 3vw, 1.5rem);
        font-size: clamp(0.875rem, 2.5vw, 1.1rem);
        color: ${textColor};
        letter-spacing: 0.3px;
      ">Loading...</div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
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
