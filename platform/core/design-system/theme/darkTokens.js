/**
 * @fileoverview Dark Theme Token Generator for Zionix Design System
 *
 * This module generates dynamic dark theme tokens based on the selected primary color.
 * It provides consistent color schemes and design tokens for dark mode across the platform.
 *
 * Features:
 * - Dynamic primary color derivatives
 * - Dark theme optimized fill colors
 * - Background colors with subtle primary tints
 * - Semantic color tokens
 * - Error state colors
 * - Typography tokens
 *
 * @author Zionix Design System Team
 * @version 1.0.0
 */

import { colorUtils } from './colorUtils';
import { generateSemanticColors } from './semanticColors';

/**
 * Generate dynamic dark theme tokens based on selected primary color
 * @param {string} primaryColor - The primary color in hex format (e.g., '#1890ff')
 * @returns {Object} Complete set of dark theme design tokens
 */
export const generateDarkTokens = (primaryColor) => {
  const semanticColors = generateSemanticColors(primaryColor, true);

  return {
    // Dynamic primary color derivatives
    ...semanticColors,

    // Fill colors for different interaction states (dark theme)
    colorFillQuaternary: colorUtils.addAlpha('#ffffff', 0.02), // Lightest fill
    colorFillTertiary: colorUtils.addAlpha('#ffffff', 0.04), // Light fill
    colorFillSecondary: colorUtils.addAlpha('#ffffff', 0.06), // Medium fill
    colorFill: colorUtils.addAlpha('#ffffff', 0.08), // Standard fill

    // Dynamic background colors with subtle primary tint (dark theme)
    colorBgContainer: colorUtils.mix(primaryColor, '#1f1f1f', 0.95), // Very subtle primary tint (5% primary + 95% dark)
    colorBgLayout: colorUtils.mix(primaryColor, '#141414', 0.92), // Slightly more primary tint (8% primary + 92% darker)
    colorBgElevated: colorUtils.mix(primaryColor, '#262626', 0.97), // Elevated surfaces with subtle tint
    colorBgSpotlight: colorUtils.mix(primaryColor, '#1a1a1a', 0.94), // Highlighted areas with primary tint
    colorBgMask: colorUtils.addAlpha('#000000', 0.65), // Overlay backgrounds

    // Dynamic semantic tokens based on primary color (dark theme)
    colorBorderSecondary: colorUtils.mix(primaryColor, '#303030', 0.9), // Subtle primary tint in borders
    colorTextSecondary: colorUtils.mix(primaryColor, '#a6a6a6', 0.85), // Subtle primary tint in secondary text
    colorWhite: '#ffffff',
    // colorTextLightSolid: '#ffffff', // Light text for dark backgrounds (tooltips)

    // Success colors
    colorSuccess: '#73d13d',

    // Error colors for dark theme
    colorError: '#ff7875', // Lighter red for dark backgrounds
    colorErrorBg: '#2a1215', // Dark red background
    colorErrorBorder: '#58181c', // Dark red border

    // Typography
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  };
};
