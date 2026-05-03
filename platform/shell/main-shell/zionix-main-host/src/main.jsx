// Keep HTML loader visible, don't remove it here
// It will be removed by React after the app renders

// Use dynamic import for @nx/react/mf to avoid loadShareSync error
Promise.all([
  fetch("/assets/module-federation.manifest.json").then((res) => res.json()),
  import("@nx/react/mf")
])
  .then(([definitions, { setRemoteDefinitions }]) => setRemoteDefinitions(definitions))
  .then(() => import("./bootstrap").catch((err) => console.error(err))); // eslint-disable-line no-console
