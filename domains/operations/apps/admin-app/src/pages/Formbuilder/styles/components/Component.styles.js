import styled from "styled-components";
import { colors, elevation, motionCurves } from "../theme";

// Component styling with Lowcode design
export const Component = styled.div`
  min-height: 60px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0px;
  margin: 6px 0;
  cursor: move;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;

  /* Component controls removed from hover - only show when selected */

  /* Selected state with clean single border */
  &.selected {
    border: 2px solid #3b82f6;
    background: #f8fafc;
    padding: 11px; /* Adjust padding to compensate for thicker border */

    .component-controls {
      opacity: 1;
      visibility: visible;
    }
  }

  &:active:not(.dragging) {
    transform: translateY(0);
    transition: all 0.1s ease;
  }

  /* Component type indicator */
  .component-type-indicator {
    position: absolute;
    top: 4px;
    left: 4px;
    background: #f3f4f6;
    color: #6b7280;
    font-size: 8px;
    font-weight: 500;
    padding: 1px 4px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &.selected .component-type-indicator {
    opacity: 1;
  }

  /* Enhanced reveal effect */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(59, 130, 246, 0.08) 0%,
      rgba(59, 130, 246, 0.04) 40%,
      transparent 70%
    );
    border-radius: 6px;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s ease;
    pointer-events: none;
  }

  /* Dragging state with Lowcode visual feedback */
  &.dragging {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    border-color: #3b82f6;
    background: #ffffff;
    transition: none;
  }

  /* Form item styling for Lowcode visual hierarchy */
  .ant-form-item {
    margin-bottom: 16px;
    pointer-events: none;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }

    .ant-form-item-label {
      padding-bottom: 6px;

      > label {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        line-height: 1.5;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
      }
    }
  }

  /* Lowcode input styling */
  .ant-input,
  .ant-input-number,
  .ant-select-selector,
  .ant-picker,
  .ant-input-affix-wrapper {
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    font-size: 14px;
    padding: 8px 12px;
    transition: all 0.2s ease;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;

    &:focus,
    &.ant-input-focused,
    &.ant-select-focused .ant-select-selector,
    &.ant-picker-focused {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
  }

  /* Button styling for Lowcode consistency */
  .ant-btn {
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    height: 36px;
    padding: 0 16px;
    transition: all 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;

    &.ant-btn-primary {
      background: #3b82f6;
      border-color: #3b82f6;
    }
  }

  .ant-radio-group,
  .ant-checkbox-group {
    pointer-events: none;

    .ant-radio-wrapper,
    .ant-checkbox-wrapper {
      margin-bottom: 6px;
      font-size: 14px;
      color: #374151;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, sans-serif;
    }
  }

  /* Component selection overlay for easier clicking */
  cursor: pointer;

  /* High-priority invisible overlay to capture clicks for selection */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    pointer-events: auto;
    background: transparent;
  }

  /* Form fields should be interactive when component is selected */
  &.selected {
    .ant-form-item,
    .ant-input,
    .ant-select-selector,
    .ant-input-affix-wrapper,
    .ant-input-number,
    .ant-picker,
    .ant-radio-group,
    .ant-checkbox-group {
      pointer-events: auto;
      position: relative;
      z-index: 10;
    }

    /* Disable selection overlay when component is selected */
    &::after {
      pointer-events: none;
    }
  }

  /* Lowcode focus ring */
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;
