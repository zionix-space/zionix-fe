/**
 * @fileoverview Light Theme Token Generator for Zionix Design System
 *
 * This module generates dynamic light theme tokens based on the selected primary color.
 * It provides consistent color schemes and design tokens for light mode across the platform.
 *
 * Features:
 * - Dynamic primary color derivatives
 * - Light theme optimized fill colors
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
 * Generate dynamic light theme tokens based on selected primary color
 * @param {string} primaryColor - The primary color in hex format (e.g., '#1890ff')
 * @returns {Object} Complete set of light theme design tokens
 */
export const generateLightTokens = (primaryColor) => {
  const semanticColors = generateSemanticColors(primaryColor, false);

  return {
    // Dynamic primary color derivatives
    ...semanticColors,

    // Fill colors for different interaction states (light theme)
    colorFillQuaternary: colorUtils.addAlpha('#000000', 0.02), // Lightest fill
    colorFillTertiary: colorUtils.addAlpha('#000000', 0.04), // Light fill
    colorFillSecondary: colorUtils.addAlpha('#000000', 0.06), // Medium fill
    colorFill: colorUtils.addAlpha('#000000', 0.08), // Standard fill

    // Dynamic background colors with subtle primary tint
    colorBgContainer: colorUtils.mix(primaryColor, '#ffffff', 0.98), // Very subtle primary tint (2% primary + 98% white)
    colorBgLayout: colorUtils.mix(primaryColor, '#ffffff', 0.95), // Slightly more primary tint (5% primary + 95% white)
    colorBgElevated: '#ffffff', // Pure white for elevated surfaces
    colorBgSpotlight: colorUtils.mix(primaryColor, '#ffffff', 0.97), // Subtle highlight with primary tint
    colorBgMask: colorUtils.addAlpha('#000000', 0.45), // Overlay backgrounds

    // Essential text colors for light theme
    colorText: 'rgba(0, 0, 0, 0.88)', // Primary text color
    colorTextBase: 'rgba(0, 0, 0, 0.88)', // Base text color
    colorTextHeading: 'rgba(0, 0, 0, 0.88)', // Heading text color
    colorTextLabel: 'rgba(0, 0, 0, 0.88)', // Label text color
    colorTextDescription: 'rgba(0, 0, 0, 0.65)', // Description text
    colorTextDisabled: 'rgba(0, 0, 0, 0.25)', // Disabled text
    colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)', // Placeholder text

    // Essential border colors for light theme
    colorBorder: 'rgba(0, 0, 0, 0.15)', // Primary border color
    colorBorderSecondary: 'rgba(0, 0, 0, 0.06)', // Secondary border color

    // Dynamic semantic tokens based on primary color
    colorTextSecondary: colorUtils.mix(primaryColor, '#666666', 0.85), // Subtle primary tint in secondary text
    colorWhite: '#ffffff',
    // colorTextLightSolid removed - using global CSS for tooltips

    // Success colors
    colorSuccess: '#52c41a',

    // Error colors for light theme
    colorError: '#ff4d4f', // Standard red for error states
    colorErrorBg: '#fff2f0', // Light red background
    colorErrorBorder: '#ffccc7', // Light red border

    // Typography
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  };
};
