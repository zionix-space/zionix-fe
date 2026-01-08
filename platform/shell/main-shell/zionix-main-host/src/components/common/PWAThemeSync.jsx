/**
 * PWA Theme Synchronization Component
 * 
 * Automatically syncs PWA theme-color meta tag and manifest
 * with the app's current theme settings.
 * 
 * This component should be placed inside ThemeProvider to access
 * the current theme context.
 * 
 * @author Zionix Platform Team
 * @module components/common/PWAThemeSync
 */

import { useTheme } from '@zionix/design-system';
import { usePWAThemeSync } from '../../hooks/usePWAThemeSync';

/**
 * PWAThemeSync Component
 * 
 * Invisible component that syncs PWA theme with app theme.
 * Place this component inside ThemeProvider in your app root.
 * 
 * @example
 * ```jsx
 * <ThemeProvider>
 *   <PWAThemeSync />
 *   <App />
 * </ThemeProvider>
 * ```
 */
const PWAThemeSync = () => {
    const { primaryColor, isDarkMode } = useTheme();

    // Sync PWA theme with app theme
    usePWAThemeSync(primaryColor, isDarkMode);

    // This component doesn't render anything
    return null;
};

export default PWAThemeSync;
