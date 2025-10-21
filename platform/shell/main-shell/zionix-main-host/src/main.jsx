import { setRemoteDefinitions } from '@nx/react/mf';

fetch('/assets/module-federation.manifest.json')
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch((err) => console.error(err))); // eslint-disable-line no-console
