/**
 * @fileoverview Semantic Color Generator for Zionix Design System
 *
 * This module generates semantic color tokens from a primary color for both
 * light and dark themes. It provides consistent color derivatives that maintain
 * proper contrast and accessibility standards.
 *
 * Features:
 * - Primary color derivatives
 * - Background color variations
 * - Border color variations
 * - Text color variations
 * - Hover and active states
 * - Theme-aware color generation
 *
 * @author Zionix Design System Team
 * @version 1.0.0
 */

import { colorUtils } from './colorUtils';

/**
 * Generate semantic colors from primary color
 * @param {string} primaryColor - The primary color in hex format
 * @param {boolean} isDark - Whether this is for dark theme
 * @returns {Object} Object containing all semantic color tokens
 */
export const generateSemanticColors = (primaryColor, isDark = false) => {
  if (isDark) {
    // Dark theme color generation
    return {
      colorPrimary: primaryColor,
      colorPrimaryBg: colorUtils.mix(primaryColor, '#000000', 0.9), // Very dark primary for backgrounds
      colorPrimaryBgHover: colorUtils.mix(primaryColor, '#000000', 0.8), // Slightly lighter for hover states
      colorPrimaryBorder: colorUtils.mix(primaryColor, '#000000', 0.6), // Primary-tinted borders
      colorPrimaryBorderHover: colorUtils.mix(primaryColor, '#000000', 0.4), // Primary border hover
      colorPrimaryHover: colorUtils.lighten(primaryColor, 10), // Primary hover state
      colorPrimaryActive: colorUtils.lighten(primaryColor, 20), // Primary active state
      colorPrimaryText: primaryColor, // Primary for text
      colorPrimaryTextHover: colorUtils.lighten(primaryColor, 10), // Primary text hover
      colorPrimaryTextActive: colorUtils.lighten(primaryColor, 20), // Primary text active
    };
  } else {
    // Light theme color generation
    return {
      colorPrimary: primaryColor,
      colorPrimaryBg: colorUtils.mix(primaryColor, '#ffffff', 0.9), // Very light primary for backgrounds
      colorPrimaryBgHover: colorUtils.mix(primaryColor, '#ffffff', 0.8), // Slightly darker for hover states
      colorPrimaryBorder: colorUtils.mix(primaryColor, '#ffffff', 0.6), // Primary-tinted borders
      colorPrimaryBorderHover: colorUtils.mix(primaryColor, '#ffffff', 0.4), // Primary border hover
      colorPrimaryHover: colorUtils.lighten(primaryColor, 10), // Primary hover state
      colorPrimaryActive: colorUtils.darken(primaryColor, 10), // Primary active state
      colorPrimaryText: primaryColor, // Primary for text
      colorPrimaryTextHover: colorUtils.lighten(primaryColor, 10), // Primary text hover
      colorPrimaryTextActive: colorUtils.darken(primaryColor, 10), // Primary text active
    };
  }
};