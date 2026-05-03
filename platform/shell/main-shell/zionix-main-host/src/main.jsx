// Keep HTML loader visible, don't remove it here
// It will be removed by React after the app renders

// Use dynamic import for @nx/react/mf to avoid loadShareSync error
Promise.all([
  fetch("/assets/module-federation.manifest.json").then((res) => res.json()),
  import("@nx/react/mf")
])
  .then(([definitions, { setRemoteDefinitions }]) => {
    // Add preconnect hints for remote apps dynamically
    Object.values(definitions).forEach((remoteUrl) => {
      try {
        const url = new URL(remoteUrl);
        const origin = url.origin;

        // Add preconnect hint
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = origin;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);

        // Add dns-prefetch as fallback
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = origin;
        document.head.appendChild(dnsPrefetch);
      } catch (e) {
        // Ignore invalid URLs
      }
    });

    setRemoteDefinitions(definitions);
  })
  .then(() => import("./bootstrap").catch((err) => console.error(err))); // eslint-disable-line no-console
