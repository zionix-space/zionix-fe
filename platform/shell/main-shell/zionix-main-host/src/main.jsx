import { setRemoteDefinitions } from "@nx/react/mf";

// Keep HTML loader visible, don't remove it here
// It will be removed by React after the app renders

fetch("/assets/module-federation.manifest.json")
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import("./bootstrap").catch((err) => console.error(err))); // eslint-disable-line no-console
