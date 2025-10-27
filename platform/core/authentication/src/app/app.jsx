/**
 * @fileoverview Main Authentication App Component for Zionix Platform
 *
 * Root component for the authentication module that provides routing,
 * theme integration, and global providers for the authentication system.
 *
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import AuthRouter from '../components/AuthRouter';

/**
 * Main Authentication Application Component
 *
 * Features:
 * - React Router integration for SPA navigation
 * - Zionix design system theme provider
 * - Ant Design configuration provider
 * - Responsive design support
 * - Dark/light theme support
 * - RTL/LTR direction support
 *
 * @returns {JSX.Element} Main authentication app component
 */
export function App() {
  return <AuthRouter />;
}

export default App;
