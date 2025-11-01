import styled from 'styled-components';
import { colors, elevation, motionCurves } from '../theme';

// Lowcode-style compact Sidebar container
export const SideBar = styled.div`
  flex: 0 0 220px;
  width: 220px;
  padding: 0;
  border-right: 1px solid #e8eaed;
  height: calc(100vh - 48px);
  background: #ffffff;
  overflow-y: auto;
  position: relative;
  z-index: 10;

  /* Responsive design */
  @media (max-width: 1024px) {
    flex: 0 0 200px;
    width: 200px;
  }

  @media (max-width: 768px) {
    flex: 0 0 180px;
    width: 180px;
  }

  @media (max-width: 640px) {
    position: absolute;
    left: -280px;
    transition: left 0.3s ease;
    z-index: 100;

    &.mobile-open {
      left: 0;
    }
  }

  /* Clean scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 2px;

    &:hover {
      background: #adb5bd;
    }
  }

  .sidebar-tabs {
    padding: 0 16px;
    margin-bottom: 12px;

    .ant-tabs-nav {
      margin-bottom: 0;

      &::before {
        border-bottom: 1px solid #e5e7eb;
      }
    }

    .ant-tabs-tab {
      padding: 6px 0;
      margin-right: 16px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;

      &.ant-tabs-tab-active {
        color: #1f2937;

        .ant-tabs-tab-btn {
          color: #1f2937;
        }
      }
    }

    .ant-tabs-ink-bar {
      background: #3b82f6;
      height: 2px;
    }
  }

  .search-container {
    padding: 0 16px 12px 16px;

    .ant-input-affix-wrapper {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: #f8f9fa;
      padding: 8px 12px;
      height: 32px;
      transition: all 0.2s ease;

      &:hover {
        border-color: #d1d5db;
        background: #ffffff;
      }

      &:focus-within {
        border-color: #3b82f6;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .ant-input {
        border: none;
        padding: 0;
        font-size: 13px;
        background: transparent;

        &::placeholder {
          color: #9ca3af;
        }
      }

      .anticon {
        color: #9ca3af;
        font-size: 14px;
      }
    }
  }

  .components-section {
    padding: 0 16px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
    padding: 0;
  }
`;

// Sidebar item with Lowcode-style compact design
export const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 0 0 2px 0;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: move;
  position: relative;
  min-height: 36px;
  user-select: none;

  .component-icon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #3b82f6;
    flex-shrink: 0;
  }

  .component-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .component-label {
    font-size: 13px;
    color: #374151;
    font-weight: 500;
    line-height: 1.3;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .drag-handle {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d1d5db;
    flex-shrink: 0;
    opacity: 0;
    transition: all 0.2s ease;
    font-size: 12px;
  }

  /* Dragging state */
  &.dragging {
    opacity: 0.9;
    z-index: 1000;
    background: #ffffff;
  }
`;

// Lowcode-style Sidebar Header
export const SidebarHeader = styled.div`
  padding: 16px 16px 12px 16px;
  border-bottom: 1px solid #f1f3f4;
  background: #fafbfc;
`;

// Sidebar tabs container - Lowcode style
export const SidebarTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #fafbfc;
`;

export const SidebarTab = styled.div`
  flex: 1;
  padding: 10px 12px;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  background: #ffffff;

  &.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
    background: #ffffff;
    font-weight: 600;
  }
`;

// Search container styling - Lowcode style
export const SearchContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f1f3f4;
  background: #ffffff;

  .ant-input-affix-wrapper {
    border: 1px solid #f1f3f4;
    border-radius: 6px;
    padding: 8px 12px;
    height: 32px;
    background: #ffffff;

    &:focus-within {
      border-color: #3b82f6;
      background: #ffffff;
    }
  }

  .ant-input {
    font-size: 13px;
    color: #374151;
    background: transparent;

    &::placeholder {
      color: #9ca3af;
    }
  }
`;

// Lowcode-style// Components container - Lowcode style
export const ComponentsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  background: #ffffff;
`;

// Lowcode-style// Component section grouping - Lowcode style
export const ComponentSection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

// Section title styling - Lowcode style
export const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 10px 0;
  padding: 0;
`;

// Lowcode-style// Component list container - Lowcode style
export const ComponentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 12px;
`;
