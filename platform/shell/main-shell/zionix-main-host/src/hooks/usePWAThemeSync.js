/**
 * PWA Theme Synchronization Hook
 * 
 * Dynamically updates PWA theme-color meta tag and manifest
 * to match the current app theme settings.
 * 
 * This ensures the browser's top bar/status bar color matches
 * the app's primary color in both light and dark modes.
 * 
 * @author Zionix Platform Team
 * @module hooks/usePWAThemeSync
 */

import { useEffect } from 'react';

/**
 * Updates the PWA theme-color meta tag dynamically
 * @param {string} color - Hex color code
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
const updateThemeColorMeta = (color, isDarkMode) => {
    // Update the theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }

    // Use the primary color directly for the theme
    metaThemeColor.content = color;

    // Also update apple-mobile-web-app-status-bar-style for iOS
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');

    if (!appleStatusBar) {
        appleStatusBar = document.createElement('meta');
        appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
        document.head.appendChild(appleStatusBar);
    }

    // iOS supports: default, black, black-translucent
    // Use 'default' to allow custom color, or 'black-translucent' for dark mode
    appleStatusBar.content = isDarkMode ? 'black-translucent' : 'default';
};

/**
 * Updates the PWA manifest dynamically
 * @param {string} color - Hex color code
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
const updateManifest = (color, isDarkMode) => {
    // Create a dynamic manifest with updated theme colors
    const manifest = {
        name: 'Zionix Solutions',
        short_name: 'Zionix',
        description: 'Zionix Solutions - Healthcare Management Platform',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: color,
        background_color: isDarkMode ? '#141414' : '#ffffff',
        categories: ['business', 'healthcare', 'productivity'],
        icons: [
            {
                src: '/assets/pwa-icons/icon-72x72.png',
                sizes: '72x72',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-144x144.png',
                sizes: '144x144',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-152x152.png',
                sizes: '152x152',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/assets/pwa-icons/icon-192x192-maskable.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/assets/pwa-icons/icon-512x512-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ]
    };

    // Convert manifest to blob and create object URL
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(manifestBlob);

    // Update or create manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]');

    if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
    }

    // Store the old URL to revoke it later
    const oldURL = manifestLink.href;

    // Update to new manifest
    manifestLink.href = manifestURL;

    // Revoke old blob URL to prevent memory leaks
    if (oldURL && oldURL.startsWith('blob:')) {
        URL.revokeObjectURL(oldURL);
    }
};

/**
 * Hook to synchronize PWA theme with app theme
 * 
 * @param {string} primaryColor - Current primary color from theme
 * @param {boolean} isDarkMode - Current dark mode state
 * 
 * @example
 * ```jsx
 * const { primaryColor, isDarkMode } = useTheme();
 * usePWAThemeSync(primaryColor, isDarkMode);
 * ```
 */
export const usePWAThemeSync = (primaryColor, isDarkMode) => {
    useEffect(() => {
        if (!primaryColor) return;

        // Update meta tag immediately
        updateThemeColorMeta(primaryColor, isDarkMode);

        // Update manifest
        updateManifest(primaryColor, isDarkMode);

        // Cleanup function to revoke blob URL on unmount
        return () => {
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink && manifestLink.href.startsWith('blob:')) {
                URL.revokeObjectURL(manifestLink.href);
            }
        };
    }, [primaryColor, isDarkMode]);
};

export default usePWAThemeSync;
