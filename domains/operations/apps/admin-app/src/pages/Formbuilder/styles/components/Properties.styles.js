import styled from "styled-components";
import { colors, elevation, motionCurves } from "../theme";

// Properties panel - Lowcode style
export const PropertiesPanelContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e8eaed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 10;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Collapsible state for focus mode */
  &.collapsed {
    width: 40px !important;
    min-width: 40px;

    .properties-content {
      opacity: 0;
      pointer-events: none;
    }

    .collapse-toggle {
      transform: rotate(180deg);
    }
  }

  /* Focus mode - hide when canvas is in focus */
  &.focus-mode {
    transform: translateX(100%);
    opacity: 0;
  }
`;

// Properties panel header - Lowcode style
export const PropertiesHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e8eaed;
  background: #ffffff;
  position: relative;

  /* Lowcode visual hierarchy */
  font-size: 13px;
`;

// Header title - Lowcode style
export const HeaderTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;

  .anticon {
    color: #3b82f6;
    font-size: 14px;
  }
`;

// Header subtitle - Lowcode style
export const HeaderSubtitle = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
  line-height: 1.4;
`;

// Properties content area - Lowcode style
export const PropertiesContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;

  /* Lowcode spacing and typography */
  font-size: 13px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }

  /* Form styling - Lowcode style */
  .ant-form {
    .ant-form-item {
      margin-bottom: 16px;

      .ant-form-item-label {
        padding-bottom: 6px;

        label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          height: auto;

          &::after {
            display: none;
          }
        }
      }

      .ant-form-item-control {
        .ant-input,
        .ant-input-number,
        .ant-select-selector,
        .ant-picker {
          font-size: 13px;
          border-radius: 6px;
          border-color: #d1d5db;
          background: #ffffff;
          height: 36px;
          transition: all 0.2s ease;

          &:focus,
          &.ant-input-focused,
          &.ant-select-focused .ant-select-selector {
            border-color: #3b82f6;
          }
        }

        .ant-checkbox-wrapper {
          font-size: 13px;
          color: #374151;

          .ant-checkbox {
            .ant-checkbox-inner {
              border-radius: 4px;
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }

  /* Tabs styling - Lowcode style */
  .ant-tabs {
    margin: -16px -16px 0 -16px;

    .ant-tabs-nav {
      margin-bottom: 0;
      background: #fafbfc;
      padding: 0 16px;

      &::before {
        border-bottom: 1px solid #e5e7eb;
      }

      .ant-tabs-nav-wrap {
        .ant-tabs-nav-list {
          .ant-tabs-tab {
            padding: 12px 16px;
            margin: 0 4px 0 0;
            border: none;
            background: transparent;
            border-radius: 6px 6px 0 0;
            position: relative;

            .ant-tabs-tab-btn {
              font-size: 13px;
              font-weight: 500;
              color: #6b7280;
              display: flex;
              align-items: center;
              gap: 6px;

              .anticon {
                font-size: 13px;
              }
            }

            &.ant-tabs-tab-active {
              background: #ffffff;
              border-bottom: 1px solid #ffffff;
              margin-bottom: -1px;

              .ant-tabs-tab-btn {
                color: #3b82f6;
                font-weight: 600;
              }
            }
          }

          .ant-tabs-ink-bar {
            display: none;
          }
        }
      }
    }

    .ant-tabs-content-holder {
      background: #ffffff;
      border-top: 1px solid #e5e7eb;

      .ant-tabs-content {
        .ant-tabs-tabpane {
          padding: 16px;
        }
      }
    }
  }

  /* Button styling */
  .ant-btn {
    font-size: 13px;
    height: 32px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;

    &.ant-btn-dashed {
      border-color: #d1d5db;
      color: #6b7280;
    }

    &.ant-btn-text {
      color: #ef4444;
    }

    &.ant-btn-primary {
      background: #3b82f6;
      border-color: #3b82f6;
    }
  }

  /* Space component styling */
  .ant-space {
    width: 100%;

    .ant-space-item {
      flex: 1;
    }
  }
`;

// Empty state styling
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  padding: 24px;
`;

export const EmptyIcon = styled.div`
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;

  .anticon {
    font-size: 48px;
  }
`;

export const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

export const EmptyDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  max-width: 240px;
`;

// Tab navigation styling
export const TabNavigation = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  margin: -16px -16px 16px -16px;
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #374151;
    background: #f3f4f6;
  }

  &.active {
    color: #3b82f6;
    background: #ffffff;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #3b82f6;
    }
  }

  .anticon {
    margin-right: 4px;
    font-size: 12px;
  }
`;

// Property group styling
export const PropertyGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PropertyGroupTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f3f4f6;
`;

// Option list styling
export const OptionList = styled.div`
  .option-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding: 8px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }

    .option-input {
      flex: 1;
    }

    .option-actions {
      display: flex;
      gap: 4px;
    }
  }

  .add-option-btn {
    width: 100%;
    margin-top: 8px;
    border-style: dashed;
    border-color: #d1d5db;
    color: #6b7280;

    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  }
`;

// Validation indicator
export const ValidationIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  margin-top: 4px;

  &.error {
    color: #ef4444;
  }

  &.warning {
    color: #f59e0b;
  }

  &.success {
    color: #10b981;
  }

  .anticon {
    font-size: 11px;
  }
`;

// Color picker wrapper
export const ColorPickerWrapper = styled.div`
  .ant-color-picker-trigger {
    width: 100%;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #d1d5db;

    &:hover {
      border-color: #9ca3af;
    }
  }
`;

// Advanced section styling
export const AdvancedSection = styled.div`
  .code-editor {
    .ant-input {
      font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
      font-size: 11px;
      line-height: 1.4;
    }
  }
`;
