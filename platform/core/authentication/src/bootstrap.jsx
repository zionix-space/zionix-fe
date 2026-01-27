import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { MicrofrontendLoader } from '@zionix-space/design-system';
import App from './app/app';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// When running standalone, wrap with BrowserRouter
// When loaded as a remote module, the host provides the router
root.render(
  <StrictMode>
    <MicrofrontendLoader appName="Authentication">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MicrofrontendLoader>
  </StrictMode>
);
