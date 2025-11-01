import styled from 'styled-components';
import { colors, elevation, motionCurves } from '../theme';

// Main form builder container - Lowcode inspired design
export const FormBuilderContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f8f9fb;
  overflow: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue',
    Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #2d3748;

  /* Lowcode-style clean layout */
  .form-builder-layout {
    display: flex;
    width: 100%;
    height: 100%;
  }

  /* Responsive behavior */
  @media (max-width: 1200px) {
    .sidebar {
      width: 200px;
    }
    .properties-panel {
      width: 250px;
    }
  }

  @media (max-width: 1024px) {
    .sidebar {
      width: 180px;
    }
    .properties-panel {
      width: 220px;
    }
  }
`;

// Lowcode-style left sidebar for form elements
export const FormBuilderSidebar = styled.div`
  width: 220px;
  min-width: 220px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;

  /* Lowcode-style header */
  .sidebar-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;

    .sidebar-title {
      font-size: 15px;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 4px 0;
      letter-spacing: -0.025em;
    }

    .sidebar-subtitle {
      font-size: 12px;
      color: #718096;
      margin: 0;
      line-height: 1.4;
    }
  }

  /* Search section */
  .sidebar-search {
    padding: 13px;
    border-bottom: 1px solid #e2e8f0;
    background: #f7fafc;
    overflow-y: auto;
  }

  /* Collapsible state for focus mode */
  &.collapsed {
    width: 50px !important;
    min-width: 50px;

    .sidebar-content {
      opacity: 0;
      pointer-events: none;
    }

    .collapse-toggle {
      transform: rotate(180deg);
    }
  }

  /* Focus mode - hide when canvas is in focus */
  &.focus-mode {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

// Lowcode-style main content area
export const FormBuilderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  overflow: hidden;
  position: relative;

  /* Main canvas container */
  .canvas-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
    overflow: hidden;
  }

  .toolbar {
    height: 60px;
    background: #ffffff;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .form-header {
    background: #f8f9fa;
    padding: 24px;
    border-bottom: 1px solid #e1e5e9;
  }

  .form-control-toolbar {
    height: 48px;
    background: #ffffff;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 0 24px;
  }

  .form-canvas {
    flex: 1;
    background: #f8f9fa;
    padding: 24px;
    overflow-y: auto;
    position: relative;
  }
`;

// Compact single-row toolbar
export const FormBuilderToolbar = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  height: 44px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
  }

  .toolbar-center {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .form-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
    max-width: 400px;
  }

  .toolbar-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    background: #ffffff;
    color: #2d3748;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    height: 32px;

    &:hover {
      border-color: #3182ce;
      background: #f7fafc;
      color: #2b6cb0;
    }

    &.primary {
      background: #3182ce;
      border-color: #3182ce;
      color: #ffffff;

      &:hover {
        background: #2c5aa0;
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

// Compact inline form header
export const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
  max-width: 400px;

  .form-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a202c;
    margin: 0;
    border: none;
    background: transparent;
    width: 100%;
    outline: none;
    font-family: inherit;
    line-height: 1.2;
    letter-spacing: -0.025em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:focus {
      background: #f7fafc;
      border-radius: 4px;
      padding: 4px 8px;
      margin: -4px -8px;
      border: 2px solid #3182ce;
      white-space: normal;
      overflow: visible;
      text-overflow: unset;
    }

    &::placeholder {
      color: #a0aec0;
      font-weight: 400;
    }
  }

  .form-description {
    font-size: 11px;
    color: #718096;
    margin: 0;
    border: none;
    background: transparent;
    width: 100%;
    outline: none;
    resize: none;
    min-height: 14px;
    font-family: inherit;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:focus {
      background: #f7fafc;
      border-radius: 4px;
      padding: 4px 8px;
      margin: -4px -8px;
      border: 2px solid #3182ce;
      white-space: normal;
      overflow: visible;
      text-overflow: unset;
      min-height: 40px;
    }

    &::placeholder {
      color: #a0aec0;
      font-weight: 400;
    }
  }
`;

// Removed - functionality merged into FormBuilderToolbar

// Form statistics display - Lowcode style
export const FormStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #718096;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0px 4px;

    .stat-icon {
      font-size: 12px;
      color: #3182ce;
    }

    .stat-value {
      font-weight: 600;
      color: #1a202c;
      font-size: 12px;
    }

    span:last-child {
      font-size: 11px;
      color: #718096;
    }
  }
`;

// Zoom controls - Lowcode style
export const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  background: #ffffff;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  padding: 2px;
  height: 32px;

  .zoom-button {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    color: #718096;

    &:hover:not(:disabled) {
      background: #f7fafc;
      color: #3182ce;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      color: #cbd5e0;
    }
  }

  .zoom-display {
    min-width: 45px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #2d3748;
    padding: 0 4px;
    cursor: pointer;

    &:hover {
      color: #3182ce;
    }
  }
`;

// Layout options - Lowcode style
export const LayoutOptions = styled.div`
  .layout-selector {
    min-width: 130px;
    height: 32px;
    font-size: 12px;
    border-radius: 6px;

    .ant-select-selector {
      border-radius: 6px !important;
      border: 1px solid #cbd5e0 !important;
      box-shadow: none !important;
      height: 32px !important;
      padding: 0 8px !important;

      .ant-select-selection-item {
        line-height: 30px !important;
        font-size: 12px !important;
        color: #2d3748 !important;
      }
    }

    &:hover .ant-select-selector {
      border-color: #3182ce !important;
    }

    &.ant-select-focused .ant-select-selector {
      border-color: #3182ce !important;
      box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.1) !important;
    }
  }
`;

// Undo/Redo controls - Lowcode style
export const UndoRedoControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  background: #ffffff;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  padding: 2px;
  height: 32px;

  .undo-redo-button {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    color: #718096;

    &:hover:not(:disabled) {
      background: #f7fafc;
      color: #3182ce;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      color: #cbd5e0;
    }
  }
`;

// Background color picker - Lowcode style
export const BackgroundColorPicker = styled.div`
  .color-picker-trigger {
    width: 32px;
    height: 32px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    transition: all 0.2s ease;

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .color-preview {
    width: 100%;
    height: 100%;
    border: none;
    cursor: pointer;
  }
`;

// Lowcode-style form canvas
export const FormCanvas = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f8f9fa;
  position: relative;
  z-index: 5;

  /* Form container - Lowcode style */
  .form-container {
    margin: 0 auto;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3);
    border: 1px solid #dadce0;
    overflow: hidden;
    min-height: 500px;
  }

  /* Form header area */
  .form-header-area {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #e8eaed;
    background: #ffffff;
  }

  /* Form content area */
  /* .form-content-area {
    background: #ffffff;
    min-height: 350px;
  } */

  /* Focus mode enhancements */
  &.focus-mode {
    padding: 40px;

    .form-container {
      max-width: 900px;
    }
  }

  /* Lowcode-style scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;

    &:hover {
      background: #a0aec0;
    }
  }
`;

// Section container - Clean and minimal
// Lowcode-style section container
export const SectionContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &.selected {
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.12);
  }

  &:hover {
    border-color: #dadce0;
    box-shadow: 0 1px 3px rgba(60, 64, 67, 0.15);
  }
`;

// Section header with title and actions
// Lowcode-style section header - cleaner design
export const SectionHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;

  .section-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .section-collapse-btn {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #5f6368;

    &:hover {
      background: #f1f3f4;
      color: #1a73e8;
    }
  }

  .section-content {
    flex: 1;
  }

  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: #202124;
    margin: 0 0 2px 0;
    line-height: 1.4;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
    }
  }

  .section-title-input {
    font-size: 14px;
    font-weight: 500;
    color: #202124;
    margin: 0 0 2px 0;
    line-height: 1.4;
    border: 1px solid #4285f4;
    border-radius: 4px;
    padding: 4px 6px;
    background: #ffffff;
    outline: none;
    width: 100%;
    font-family: inherit;
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  }

  .section-description {
    font-size: 12px;
    color: #5f6368;
    margin: 0;
    line-height: 1.4;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #f8f9fa;
    }
  }

  .section-description-input {
    font-size: 12px;
    color: #202124;
    margin: 0;
    line-height: 1.4;
    border: 1px solid #4285f4;
    border-radius: 4px;
    padding: 4px 6px;
    background: #ffffff;
    outline: none;
    width: 100%;
    font-family: inherit;
    resize: vertical;
    min-height: 44px;
  }

  .section-meta {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .section-field-count {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #e8f4fd;
    border: 1px solid #bee3f8;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    color: #2b6cb0;
  }

  .section-actions {
    display: flex;
    gap: 6px;
    opacity: 1;
    position: relative;
    z-index: 10;
  }

  .section-action-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid #e1e5e9;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #7b8794;
    transition: all 0.2s ease;

    &:hover {
      border-color: #4a90e2;
      background: #f8fafc;
    }

    &.success {
      color: #059669;

      &:hover {
        border-color: #059669;
        background: #f0fdf4;
      }
    }

    &.danger {
      color: #dc2626;

      &:hover {
        border-color: #dc2626;
        background: #fef2f2;
      }
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
// Section content area
// Lowcode-style section content
export const SectionContent = styled.div`
  padding: 16px;
  min-height: 80px;
  background: #ffffff;

  &.empty-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    background: #fafbfc;
    border: 1px dashed #dadce0;
    border-radius: 8px;
    margin: 16px;
    position: relative;
    text-align: center;
    transition: all 0.2s ease;

    .empty-section-dropzone {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      border-radius: 8px;

      &.active {
        background: rgba(26, 115, 232, 0.08);
        border: 1px solid #1a73e8;
        border-radius: 8px;
      }
    }

    .empty-icon {
      font-size: 20px;
      color: #9aa0a6;
      margin-bottom: 8px;
      z-index: 2;
      position: relative;
      pointer-events: none;
    }

    .empty-text {
      font-size: 12px;
      color: #5f6368;
      text-align: center;
      margin: 0;
      z-index: 2;
      position: relative;
      pointer-events: none;
      font-weight: 400;
      line-height: 1.4;
      max-width: 180px;
    }

    &:hover {
      border-color: #1a73e8;
      background: #f8f9fa;
    }
  }
`;

// Action buttons container
export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 5px;
  background: #ffffff;
  border-top: 1px solid #f1f3f4;
  justify-content: center;

  .action-button {
    color: #1a73e8;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
  }
`;

// Component drop zone styling
export const ComponentDropZone = styled.div`
  min-height: 60px;
  border: 2px dashed transparent;
  border-radius: 8px;
  margin: 8px 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.drag-over {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &.can-drop {
    border-color: #10b981;
    background: #ecfdf5;
  }

  .drop-indicator {
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
    padding: 16px;
  }
`;

// Form field container
// Lowcode-style form field container
export const FormFieldContainer = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #e1e5e9;
  }

  &.selected {
    border-color: #4a90e2;
    background: #f8fafc;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  .field-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;

    .field-action-btn {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #e1e5e9;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #7b8794;
      transition: all 0.2s ease;

      &:hover {
        border-color: #4a90e2;
        background: #f8fafc;
      }

      &.danger {
        color: #dc2626;

        &:hover {
          border-color: #dc2626;
          background: #fef2f2;
        }
      }
    }
  }

  &:hover .field-actions {
    opacity: 1;
  }
`;

// Empty state container
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  background: #ffffff;
  border-radius: 8px;
  border: 2px dashed #cbd5e0;
  margin: 20px;

  .empty-state {
    padding: 32px;
  }

  .empty-icon {
    font-size: 48px;
    color: #cbd5e0;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 8px 0;
    letter-spacing: -0.025em;
  }

  p {
    font-size: 14px;
    color: #718096;
    margin: 0 0 24px 0;
    max-width: 320px;
    line-height: 1.5;
  }

  .empty-action {
    background: #3182ce;
    border-color: #3182ce;
    height: 36px;
    padding: 0 20px;
    font-weight: 500;
    border-radius: 6px;
    font-size: 14px;
  }
`;

// Loading overlay
export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

// Unsaved changes indicator
export const UnsavedChangesIndicator = styled.div`
  position: absolute;
  top: 16px;
  right: 24px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #92400e;
  font-weight: 500;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '●';
    color: #f59e0b;
  }
`;

// Canvas-centric UX controls
export const CanvasControls = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 20;
  opacity: 0;
  transition: all 0.3s ease;

  .canvas:hover & {
    opacity: 1;
  }
`;

export const FocusModeToggle = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #f1f3f4;
  border-radius: 6px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #ffffff;
  }
`;

// Lowcode-style properties panel
export const PropertiesPanel = styled.div`
  width: 250px;
  min-width: 250px;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;

  /* Properties header */
  .properties-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;

    .properties-title {
      font-size: 15px;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 4px 0;
      letter-spacing: -0.025em;
    }

    .properties-subtitle {
      font-size: 12px;
      color: #718096;
      margin: 0;
      line-height: 1.4;
    }
  }

  /* Properties content */
  .properties-content {
    flex: 1;
    overflow-y: auto;
    padding: 0;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f7fa;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;

      &:hover {
        background: #a0aec0;
      }
    }
  }

  /* Property sections */
  .property-section {
    border-bottom: 1px solid #e2e8f0;

    .section-header {
      padding: 12px 16px 8px;
      background: #f7fafc;
      border-bottom: 1px solid #e2e8f0;

      .section-title {
        font-size: 13px;
        font-weight: 600;
        color: #1a202c;
        margin: 0;
        letter-spacing: -0.025em;
      }
    }

    .section-content {
      padding: 12px 16px 16px;

      .form-group {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #2d3748;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .form-control {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 13px;
          background: #ffffff;
          transition: all 0.15s ease;
          height: 32px;

          &:focus {
            border-color: #3182ce;
            box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
            outline: none;
          }
        }

        .form-help {
          font-size: 11px;
          color: #718096;
          margin-top: 4px;
          line-height: 1.4;
        }
      }
    }
  }

  /* Collapsible state */
  &.collapsed {
    width: 50px !important;
    min-width: 50px;

    .properties-content {
      opacity: 0;
      pointer-events: none;
    }
  }
`;

// Component category styles for sidebar
export const ComponentCategory = styled.div`
  margin-bottom: 20px;

  .category-header {
    padding: 8px 12px 6px;
    border-bottom: 1px solid #e2e8f0;
    background: #f7fafc;

    .category-title {
      font-size: 11px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .category-content {
    padding: 12px;

    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 8px;
    }
  }
`;

// Component item styles
export const ComponentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  cursor: grab;
  transition: all 0.15s ease;
  user-select: none;

  &:hover {
    border-color: #3182ce;
    box-shadow: 0 2px 8px rgba(49, 130, 206, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }

  .component-icon {
    font-size: 18px;
    color: #3182ce;
    margin-bottom: 4px;
  }

  .component-label {
    font-size: 10px;
    font-weight: 500;
    color: #2d3748;
    text-align: center;
    line-height: 1.2;
    margin: 0;
  }
`;

export const CollapseToggle = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 56px;
  border: 1px solid #cbd5e0;
  background: #ffffff;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 15;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease;

  &:hover {
    background: #f7fafc;
    border-color: #3182ce;
  }

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  &.sidebar-toggle {
    right: -14px;
  }

  &.properties-toggle {
    left: -14px;
    border-radius: 8px 0 0 8px;
  }

  svg {
    width: 14px;
    height: 14px;
    color: #718096;
    transition: transform 0.15s ease;
  }

  &.collapsed svg {
    transform: rotate(180deg);
  }
`;
