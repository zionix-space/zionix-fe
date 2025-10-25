/**
 * @fileoverview Main Design System exports for Zionix Platform
 * 
 * This is the central export file for the Zionix Design System.
 * It provides easy access to all design system components, themes, and utilities
 * for use across all applications, shells, and remote modules in the platform.
 * 
 * Usage:
 * ```jsx
 * // Import theme components
 * import { ThemeProvider, useTheme } from '@zionix/design-system';
 * 
 * // Import UI components (when available)
 * import { Button, Card } from '@zionix/design-system/ui-components';
 * ```
 * 
 * @author Zionix Design System Team
 * @version 1.0.0
 */

// Theme exports
export { ThemeProvider, useTheme } from './theme';

// UI Components exports
export * from './ui-components';

// Future exports can be added here as the design system grows
// export * from './tokens';
// export * from './icons';
// export * from './layouts';