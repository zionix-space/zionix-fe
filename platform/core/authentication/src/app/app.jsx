/**
 * @fileoverview Main Authentication App Component for Zionix Platform
 *
 * Root component for the authentication module that provides routing,
 * theme integration, and global providers for the authentication system.
 *
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import { ThemeProvider } from '@zionix-space/design-system';
import AuthRouter from '../components/AuthRouter';

/**
 * Main Authentication Application Component
 *
 * Features:
 * - React Router integration for SPA navigation (provided by host)
 * - Zionix design system theme provider
 * - Shared Zustand store for cross-microfrontend auth state
 * - Ant Design configuration provider
 * - Responsive design support
 * - Dark/light theme support
 * - RTL/LTR direction support
 *
 * Note: BrowserRouter is provided by the host application (main-shell).
 * This app uses the router context from the host.
 * Authentication state is managed via shared Zustand store accessible by all microfrontends.
 *
 * @returns {JSX.Element} Main authentication app component
 */
export function App() {
  return (
    <ThemeProvider>
      <AuthRouter />
    </ThemeProvider>
  );
}

export default App;
