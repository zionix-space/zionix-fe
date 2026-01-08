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
    colorBgContainer: colorUtils.mix(primaryColor, '#1f1f1f', 0.97), // Very subtle primary tint (3% primary + 97% dark)
    colorBgLayout: colorUtils.mix(primaryColor, '#141414', 0.96), // Slightly more primary tint (4% primary + 96% darker)
    colorBgElevated: colorUtils.mix(primaryColor, '#262626', 0.98), // Elevated surfaces with subtle tint
    colorBgSpotlight: colorUtils.mix(primaryColor, '#1a1a1a', 0.97), // Highlighted areas with primary tint
    colorBgMask: colorUtils.addAlpha('#000000', 0.65), // Overlay backgrounds

    // Essential text colors for dark theme
    colorText: 'rgba(255, 255, 255, 0.85)', // Primary text color
    colorTextBase: 'rgba(255, 255, 255, 0.85)', // Base text color
    colorTextHeading: 'rgba(255, 255, 255, 0.85)', // Heading text color
    colorTextLabel: 'rgba(255, 255, 255, 0.85)', // Label text color
    colorTextDescription: 'rgba(255, 255, 255, 0.65)', // Description text
    colorTextDisabled: 'rgba(255, 255, 255, 0.25)', // Disabled text
    colorTextPlaceholder: 'rgba(255, 255, 255, 0.25)', // Placeholder text

    // Essential border colors for dark theme
    colorBorder: 'rgba(255, 255, 255, 0.15)', // Primary border color
    colorBorderSecondary: 'rgba(255, 255, 255, 0.06)', // Secondary border color

    // Dynamic semantic tokens based on primary color (dark theme)
    colorTextSecondary: colorUtils.mix(primaryColor, '#a6a6a6', 0.85), // Subtle primary tint in secondary text
    colorWhite: '#ffffff',
    // colorTextLightSolid removed - using global CSS for tooltips

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
