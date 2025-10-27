/**
 * @fileoverview Color Utility Functions for Zionix Design System
 *
 * This module provides comprehensive color manipulation utilities for dynamic
 * theme generation. It includes functions for color conversion, mixing, and
 * transformation operations.
 *
 * Features:
 * - Hex to RGB conversion
 * - RGB to Hex conversion
 * - Color lightening and darkening
 * - Alpha channel manipulation
 * - Color mixing operations
 *
 * @author Zionix Design System Team
 * @version 1.0.0
 */

/**
 * Color utility functions for dynamic color generation
 */
export const colorUtils = {
  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color string (e.g., '#ff0000')
   * @returns {Object|null} RGB object with r, g, b properties or null if invalid
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  /**
   * Convert RGB to hex
   * @param {number} r - Red value (0-255)
   * @param {number} g - Green value (0-255)
   * @param {number} b - Blue value (0-255)
   * @returns {string} Hex color string
   */
  rgbToHex: (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /**
   * Lighten a color by percentage
   * @param {string} hex - Hex color string
   * @param {number} percent - Percentage to lighten (0-100)
   * @returns {string} Lightened hex color string
   */
  lighten: (hex, percent) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;

    const amount = Math.round(2.55 * percent);
    const r = Math.min(255, rgb.r + amount);
    const g = Math.min(255, rgb.g + amount);
    const b = Math.min(255, rgb.b + amount);

    return colorUtils.rgbToHex(r, g, b);
  },

  /**
   * Darken a color by percentage
   * @param {string} hex - Hex color string
   * @param {number} percent - Percentage to darken (0-100)
   * @returns {string} Darkened hex color string
   */
  darken: (hex, percent) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;

    const amount = Math.round(2.55 * percent);
    const r = Math.max(0, rgb.r - amount);
    const g = Math.max(0, rgb.g - amount);
    const b = Math.max(0, rgb.b - amount);

    return colorUtils.rgbToHex(r, g, b);
  },

  /**
   * Add alpha to a color
   * @param {string} hex - Hex color string
   * @param {number} alpha - Alpha value (0-1)
   * @returns {string} RGBA color string
   */
  addAlpha: (hex, alpha) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  },

  /**
   * Mix two colors
   * @param {string} color1 - First hex color string
   * @param {string} color2 - Second hex color string
   * @param {number} weight - Weight of the second color (0-1, default 0.5)
   * @returns {string} Mixed hex color string
   */
  mix: (color1, color2, weight = 0.5) => {
    const rgb1 = colorUtils.hexToRgb(color1);
    const rgb2 = colorUtils.hexToRgb(color2);
    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r * (1 - weight) + rgb2.r * weight);
    const g = Math.round(rgb1.g * (1 - weight) + rgb2.g * weight);
    const b = Math.round(rgb1.b * (1 - weight) + rgb2.b * weight);

    return colorUtils.rgbToHex(r, g, b);
  },
};
