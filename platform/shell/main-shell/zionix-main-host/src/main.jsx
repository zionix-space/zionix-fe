import { setRemoteDefinitions } from "@nx/react/mf";

// Show initial loading state (this replaces the HTML loader)
const showInitialLoader = () => {
  // First, hide the HTML loader if it exists
  const htmlLoader = document.getElementById("html-loader");
  if (htmlLoader) {
    htmlLoader.style.display = "none";
  }

  const loadingHTML = `
    <div id="initial-loader" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    ">
      <div style="
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 0, 0, 0.06);
         border-top: 3px solid #8c8c8c;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      "></div>
      <div style="
        color: #595959;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        opacity: 0.8;
      ">Loading Zionix Platform...</div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
