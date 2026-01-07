import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  Layout,
  Input,
  Menu,
  Badge,
  Avatar,
  Dropdown,
  Tooltip,
  theme,
  ColorPicker,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix/design-system';
import { useMenuData } from '../../../../data/hooks/menu';
import { useStyles } from './DesktopSidebar.style';
import { logout } from '@zionix/authentication';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';

// Inject CSS for webkit scrollbar styles and Ant Design component overrides
const injectSidebarCSS = (token) => {
  const styleId = 'desktop-sidebar-styles';

  // Remove existing style if it exists to allow re-injection with new token values
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
      /* Webkit scrollbar styles - Apple-like minimal and theme-aware */
      /* Hide scrollbar by default */
      .zx-host-main-content::-webkit-scrollbar {
        width: 6px;
      }
      .zx-host-main-content::-webkit-scrollbar-track {
        background: transparent;
      }
      .zx-host-main-content::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 3px;
        transition: background 0.2s ease;
      }
      
      /* Show scrollbar only when hovering over the sidebar content area */
      .zx-host-main-content:hover::-webkit-scrollbar-thumb {
        background: ${token.colorTextQuaternary}40;
      }
      .zx-host-main-content:hover::-webkit-scrollbar-thumb:hover {
        background: ${token.colorTextTertiary}60;
      }

      /* Firefox - hide scrollbar by default, show on hover */
      .zx-host-main-content {
        scrollbar-width: none;
      }
      .zx-host-main-content:hover {
        scrollbar-width: thin;
        scrollbar-color: ${token.colorTextQuaternary}40 transparent;
      }

      /* Ant Design Input Clear Icon Styling */
      .zx-host-search-input .ant-input-clear-icon {
        font-size: 14px;
        color: ${token.colorTextTertiary};
        right: 8px;
        transition: color 0.2s ease;
      }
      
      .zx-host-search-input .ant-input-clear-icon:hover {
        color: ${token.colorText};
      }
      
      .zx-host-search-input .ant-input-clear-icon .anticon {
        font-size: 14px;
      }

  

      /* Premium sidebar menu items - Apple glassmorphism with excellent readability */
      .zx-host-menu-container .ant-menu-inline,
      .zx-host-menu-container .ant-menu-vertical {
        border: none !important;
        background: transparent !important;
      }

      .zx-host-menu-container .ant-menu-item {
        border-radius: 0 !important;
        margin-block: 2px !important;
        margin-inline: 6px !important;
        padding: 0 14px !important;
        height: 38px !important;
        line-height: 38px !important;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: ${token.colorText} !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: -0.01em !important;
        position: relative !important;
        border-left: 3px solid transparent !important;
        opacity: 0.75 !important;
      }

      .zx-host-menu-container .ant-menu-item .ant-menu-title-content {
        color: ${token.colorText} !important;
        font-weight: 500 !important;
        opacity: 1 !important;
      }

      .zx-host-menu-container .ant-menu-item .anticon,
      .zx-host-menu-container .ant-menu-item i {
        font-size: 20px !important;
        font-weight: 600 !important;
        margin-right: 14px !important;
        color: ${token.colorText} !important;
        transition: all 0.3s ease !important;
        opacity: 0.5 !important;
      }

      .zx-host-menu-container .ant-menu-item:hover {
        background: rgba(0, 0, 0, 0.04) !important;
        color: ${token.colorText} !important;
        transform: translateX(3px) scale(1.01) !important;
        opacity: 1 !important;
      }

      .zx-host-menu-container .ant-menu-item:hover .ant-menu-title-content {
        color: ${token.colorText} !important;
        opacity: 1 !important;
      }

      .zx-host-menu-container .ant-menu-item:hover .anticon,
      .zx-host-menu-container .ant-menu-item:hover i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
        transform: scale(1.15) !important;
      }

      .zx-host-menu-container .ant-menu-item-selected {
        background: ${token.colorPrimaryBg} !important;
        color: ${token.colorPrimary} !important;
        font-weight: 600 !important;
        border-left: 3px solid ${token.colorPrimary} !important;
        box-shadow: none !important;
        opacity: 1 !important;
      }

      .zx-host-menu-container .ant-menu-item-selected .ant-menu-title-content {
        color: ${token.colorPrimary} !important;
        font-weight: 600 !important;
        opacity: 1 !important;
      }

      .zx-host-menu-container .ant-menu-item-selected .anticon,
      .zx-host-menu-container .ant-menu-item-selected i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title {
        border-radius: 0 !important;
        margin-block: 2px !important;
        margin-inline: 6px !important;
        padding: 0 10px !important;
        height: 38px !important;
        line-height: 38px !important;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: ${token.colorText} !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        letter-spacing: -0.01em !important;
        opacity: 0.75 !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title .anticon,
      .zx-host-menu-container .ant-menu-submenu-title i {
        font-size: 20px !important;
        font-weight: 600 !important;
        margin-right: 14px !important;
        color: ${token.colorText} !important;
        opacity: 0.5 !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title:hover {
        background: rgba(0, 0, 0, 0.04) !important;
        color: ${token.colorText} !important;
        transform: translateX(3px) scale(1.01) !important;
        opacity: 1 !important;
      }

      .zx-host-menu-container .ant-menu-submenu-title:hover .anticon,
      .zx-host-menu-container .ant-menu-submenu-title:hover i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
        transform: scale(1.15) !important;
      }

      /* Submenu items - slightly indented */
      .zx-host-menu-container .ant-menu-sub .ant-menu-item {
        padding-left: 48px !important;
        font-size: 13px !important;
        height: 34px !important;
        line-height: 34px !important;
        margin-block: 1px !important;
        margin-inline: 6px !important;
        opacity: 0.7 !important;
      }
      
      .zx-host-menu-container .ant-menu-sub .ant-menu-item:hover {
        opacity: 1 !important;
      }

      /* Collapsed sidebar - premium Apple glassmorphism */
      .ant-layout-sider-collapsed .zx-host-menu-container {
        padding: 8px !important;
        margin-top: 0 !important;
        margin-bottom: 12px !important;
        margin-left: 12px !important;
        margin-right: 12px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 8px !important;
        background: ${token.colorBgContainer}B3 !important;
        backdropFilter: blur(40px) saturate(200%) !important;
        WebkitBackdropFilter: blur(40px) saturate(200%) !important;
        borderRadius: 18px !important;
        boxShadow: 
          0 4px 12px 0 rgba(0, 0, 0, 0.12),
          0 1px 3px 0 rgba(0, 0, 0, 0.08),
          inset 0 0 0 1px ${token.colorBorder}40,
          inset 0 1px 0 0 ${token.colorBgElevated}60 !important;
        border: 1px solid ${token.colorBorder}30 !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu {
        width: 100% !important;
        margin-right: 20px !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item {
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        max-width: 52px !important;
        border-radius: 14px !important;
        padding: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 6px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        position: relative !important;
        overflow: visible !important;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      /* CRITICAL: Center icons in collapsed mode */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-inline-collapsed > .ant-menu-item {
        margin-right: 20px !important;
      }

      /* Hide submenu arrows in collapsed mode */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-submenu-arrow,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-submenu-expand-icon {
        display: none !important;
      }

      /* CRITICAL: Disable Ant Design's default popup menu in collapsed mode - REMOVED to enable tooltips */

      /* Override Ant Design's icon margin and positioning */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item .ant-menu-item-icon {
        margin-inline-end: 0 !important;
        margin-inline-start: 0 !important;
        margin-right: 0 !important;
        margin-left: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }

      /* Icon styling - perfectly centered with same opacity as theme buttons */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item .ant-menu-item-icon,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item .anticon,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item i {
        font-size: 24px !important;
        font-weight: 600 !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding: 0 !important;
        color: ${token.colorText} !important;
        opacity: 1 !important;
        transition: all 0.3s ease !important;
      }

      /* Hover and selected states with premium effects */
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item:hover {
        background: rgba(0, 0, 0, 0.04) !important;
        transform: scale(1.08) !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item:hover .anticon,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item:hover i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
        transform: scale(1.15) !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item-selected {
        background: ${token.colorPrimaryBg} !important;
        box-shadow: none !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item-selected::before {
        content: '' !important;
        position: absolute !important;
        left: 0 !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 3px !important;
        height: 60% !important;
        background: ${token.colorPrimary} !important;
        border-radius: 0 3px 3px 0 !important;
      }

      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item-selected .anticon,
      .ant-layout-sider-collapsed .zx-host-menu-container .ant-menu-item-selected i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
      }

      /* Submenu items - remove empty spaces */
      .zx-host-menu-container .ant-menu-sub {
        background: transparent !important;
      }

      .zx-host-menu-container .ant-menu-sub .ant-menu-item {
        margin-block: 2px !important;
        margin-inline: 8px !important;
        padding: 0 14px !important;
      }

      /* Remove empty space from submenu */
      .zx-host-menu-container .ant-menu-submenu > .ant-menu {
        background: transparent !important;
      }

      .zx-host-menu-container .ant-menu-submenu-open > .ant-menu-submenu-title {
        background: ${token.colorFillQuaternary}60 !important;
      }

      /* Premium Apple-style Profile Dropdown - Glassmorphism */
      .ant-dropdown {
        z-index: 1050 !important;
      }

      /* Profile dropdown menu container - Premium glassmorphism */
      .ant-dropdown .ant-dropdown-menu {
        border-radius: 16px !important;
        padding: 8px !important;
        min-width: 220px !important;
        background: ${token.colorBgElevated}F5 !important;
        backdrop-filter: blur(60px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(60px) saturate(180%) !important;
        border: 1px solid ${token.colorBorder}50 !important;
        box-shadow: 
          0 12px 40px 0 rgba(0, 0, 0, 0.15),
          0 6px 20px 0 rgba(0, 0, 0, 0.12),
          0 2px 8px 0 rgba(0, 0, 0, 0.08),
          inset 0 0 0 1px ${token.colorBgElevated}80,
          inset 0 1px 0 0 rgba(255, 255, 255, 0.5) !important;
      }

      /* Profile dropdown menu items */
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item {
        border-radius: 10px !important;
        margin-block: 2px !important;
        margin-inline: 0 !important;
        padding: 10px 14px !important;
        height: auto !important;
        min-height: 40px !important;
        line-height: 1.4 !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: ${token.colorText} !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }

      /* Profile dropdown icons */
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item .anticon,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item i {
        font-size: 18px !important;
        color: ${token.colorTextSecondary} !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important;
      }

      /* Profile dropdown hover state */
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:hover {
        background: ${token.colorFillQuaternary}B3 !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        transform: translateX(2px) !important;
      }

      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:hover .anticon,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:hover i {
        color: ${token.colorPrimary} !important;
        transform: scale(1.1) !important;
      }

      /* Profile dropdown selected/active state */
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-selected,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:active {
        background: linear-gradient(135deg, ${token.colorPrimary}F0 0%, ${token.colorPrimaryHover}F0 100%) !important;
        color: ${token.colorWhite} !important;
        font-weight: 600 !important;
        box-shadow: 
          0 4px 12px ${token.colorPrimary}40,
          0 2px 6px ${token.colorPrimary}30,
          inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
      }

      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-selected .anticon,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-selected i,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:active .anticon,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item:active i {
        color: ${token.colorWhite} !important;
      }

      /* Profile dropdown divider */
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-divider {
        margin-block: 6px !important;
        margin-inline: 0 !important;
        background: ${token.colorBorderSecondary}40 !important;
      }

      /* Danger item (logout) styling */
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-danger {
        color: ${token.colorError} !important;
      }

      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-danger .anticon,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-danger i {
        color: ${token.colorError} !important;
      }

      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-danger:hover {
        background: ${token.colorErrorBg}B3 !important;
        color: ${token.colorError} !important;
      }

      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-danger:hover .anticon,
      .ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item-danger:hover i {
        color: ${token.colorError} !important;
      }

      /* Collapsed sidebar dropdown menu styling - GLOBAL selectors for portal-rendered menus */
      /* Target the popup menu container */
      .ant-menu-submenu-popup.ant-menu-submenu-placement-rightTop,
      .ant-menu-submenu-popup.ant-menu-submenu-placement-rightBottom {
        margin-left: 8px !important;
      }

      /* Dropdown menu container styling - Match expanded sidebar glassmorphism */
      .ant-menu-submenu-popup .ant-menu-vertical {
        border-radius: 18px !important;
        padding: 8px !important;
        min-width: 220px !important;
        width: auto !important;
        background: ${token.colorBgContainer}B3 !important;
        backdrop-filter: blur(40px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(40px) saturate(200%) !important;
        box-shadow: 
          0 4px 12px 0 rgba(0, 0, 0, 0.12),
          0 1px 3px 0 rgba(0, 0, 0, 0.08),
          inset 0 0 0 1px ${token.colorBorder}40,
          inset 0 1px 0 0 ${token.colorBgElevated}60 !important;
        border: 1px solid ${token.colorBorder}30 !important;
      }

      /* CRITICAL: Override ALL Ant Design menu item styles in popup - Match expanded sidebar exactly */
      .ant-menu-submenu-popup .ant-menu-vertical > .ant-menu-item,
      .ant-menu-submenu-popup .ant-menu-vertical .ant-menu-item {
        border-radius: 0 !important;
        margin-block: 2px !important;
        margin-inline: 6px !important;
        padding: 0 14px !important;
        height: 38px !important;
        max-height: 38px !important;
        min-height: 38px !important;
        line-height: 38px !important;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: ${token.colorText} !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: -0.01em !important;
        position: relative !important;
        border-left: 3px solid transparent !important;
        opacity: 0.75 !important;
        display: flex !important;
        align-items: center !important;
        white-space: nowrap !important;
        overflow: visible !important;
      }

      /* Override Ant Design's margin-block styles - REMOVED duplicate */

      /* Title content - NO text cutoff, allow full width */
      .ant-menu-submenu-popup .ant-menu-item .ant-menu-title-content {
        flex: 1 !important;
        overflow: visible !important;
        white-space: nowrap !important;
        line-height: 38px !important;
        display: flex !important;
        align-items: center !important;
        min-width: 0 !important;
        color: ${token.colorText} !important;
        font-weight: 500 !important;
        opacity: 1 !important;
      }

      /* Icons - Match expanded sidebar exactly */
      .ant-menu-submenu-popup .ant-menu-item .ant-menu-item-icon,
      .ant-menu-submenu-popup .ant-menu-item .anticon,
      .ant-menu-submenu-popup .ant-menu-item i {
        font-size: 20px !important;
        font-weight: 600 !important;
        margin-right: 14px !important;
        margin-inline-end: 14px !important;
        color: ${token.colorText} !important;
        flex-shrink: 0 !important;
        line-height: 1 !important;
        transition: all 0.3s ease !important;
        opacity: 0.5 !important;
      }

      /* Badge wrapper - inline and no extra space */
      .ant-menu-submenu-popup .ant-menu-item .ant-menu-title-content > div {
        display: flex !important;
        align-items: center !important;
        line-height: 38px !important;
        width: 100% !important;
        gap: 8px !important;
      }

      /* Badge itself */
      .ant-menu-submenu-popup .ant-menu-item .ant-badge {
        line-height: 1 !important;
        display: inline-flex !important;
        align-items: center !important;
        margin-left: auto !important;
        flex-shrink: 0 !important;
      }

      /* Hover state - Match expanded sidebar exactly */
      .ant-menu-submenu-popup .ant-menu-item:hover {
        background: rgba(0, 0, 0, 0.04) !important;
        color: ${token.colorText} !important;
        transform: translateX(3px) scale(1.01) !important;
        opacity: 1 !important;
      }

      .ant-menu-submenu-popup .ant-menu-item:hover .ant-menu-title-content {
        color: ${token.colorText} !important;
        opacity: 1 !important;
      }

      .ant-menu-submenu-popup .ant-menu-item:hover .anticon,
      .ant-menu-submenu-popup .ant-menu-item:hover i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
        transform: scale(1.15) !important;
      }

      /* Selected state - Match expanded sidebar exactly */
      .ant-menu-submenu-popup .ant-menu-item-selected,
      .ant-menu-submenu-popup .ant-menu-item.ant-menu-item-selected {
        background: ${token.colorPrimaryBg} !important;
        color: ${token.colorPrimary} !important;
        font-weight: 600 !important;
        border-left: 3px solid ${token.colorPrimary} !important;
        box-shadow: none !important;
        opacity: 1 !important;
      }

      .ant-menu-submenu-popup .ant-menu-item-selected .ant-menu-title-content {
        color: ${token.colorPrimary} !important;
        font-weight: 600 !important;
        opacity: 1 !important;
      }

      .ant-menu-submenu-popup .ant-menu-item-selected .ant-menu-item-icon,
      .ant-menu-submenu-popup .ant-menu-item-selected .anticon,
      .ant-menu-submenu-popup .ant-menu-item-selected i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
      }

      /* Submenu title in dropdown - Match expanded sidebar */
      .ant-menu-submenu-popup .ant-menu-submenu-title {
        border-radius: 0 !important;
        margin-block: 2px !important;
        margin-inline: 6px !important;
        padding: 0 10px !important;
        height: 38px !important;
        max-height: 38px !important;
        min-height: 38px !important;
        line-height: 38px !important;
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: ${token.colorText} !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        letter-spacing: -0.01em !important;
        display: flex !important;
        align-items: center !important;
        white-space: nowrap !important;
        overflow: visible !important;
        opacity: 0.75 !important;
      }

      .ant-menu-submenu-popup .ant-menu-submenu-title .anticon,
      .ant-menu-submenu-popup .ant-menu-submenu-title i {
        font-size: 20px !important;
        font-weight: 600 !important;
        margin-right: 14px !important;
        flex-shrink: 0 !important;
        line-height: 1 !important;
        color: ${token.colorText} !important;
        opacity: 0.5 !important;
      }

      .ant-menu-submenu-popup .ant-menu-submenu-title:hover {
        background: rgba(0, 0, 0, 0.04) !important;
        color: ${token.colorText} !important;
        transform: translateX(3px) scale(1.01) !important;
        opacity: 1 !important;
      }

      .ant-menu-submenu-popup .ant-menu-submenu-title:hover .anticon,
      .ant-menu-submenu-popup .ant-menu-submenu-title:hover i {
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
        transform: scale(1.15) !important;
      }

      /* Nested submenu items - Match expanded sidebar */
      .ant-menu-submenu-popup .ant-menu-sub .ant-menu-item {
        padding-left: 48px !important;
        font-size: 13px !important;
        height: 34px !important;
        max-height: 34px !important;
        min-height: 34px !important;
        line-height: 34px !important;
        margin-block: 1px !important;
        margin-inline: 6px !important;
        opacity: 0.7 !important;
      }

      .ant-menu-submenu-popup .ant-menu-sub .ant-menu-item:hover {
        opacity: 1 !important;
      }

      .ant-menu-submenu-popup .ant-menu-sub .ant-menu-item .ant-menu-title-content {
        line-height: 34px !important;
      }
    `;
  document.head.appendChild(style);
};

// Using Remix Icons CSS classes for optimal performance

const { Sider } = Layout;
const { useToken } = theme;

const AppSidebar = ({ collapsed = false, onCollapse }) => {
  const { token } = useToken();
  const { isRTL, isDarkMode, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const styles = useStyles(token);
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  // Get menu data and UI state from the unified hook
  const {
    sidebarMenus,
    selectedMainMenu,
    selectedSidebarKey,
    setSelectedSidebarKey,
    openSidebarKeys,
    setOpenSidebarKeys,
    profileSection: profileSectionData,
  } = useMenuData();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle toggle button click
  const handleToggleClick = () => {
    onCollapse(!collapsed);
  };

  // Menu selection handlers
  const handleMenuSelect = async (key) => {
    setSelectedSidebarKey(key);
    console.log('Selected menu item:', key);

    // Handle logout action
    if (key === 'logout') {
      try {
        // Clear auth store (this also clears localStorage)
        clearAuth();

        // Dispatch logout event for all microfrontends
        window.dispatchEvent(new CustomEvent('auth:logout'));

        // Navigate to root path
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Ensure navigation happens even if there's an error
        navigate('/');
      }
    }
  };

  const handleOpenChange = (keys) => {
    setOpenSidebarKeys(keys);
  };

  // Search functionality - Memoized to prevent re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Recursive function to filter menu items based on search query
  const filterMenuItems = (items, query) => {
    if (!query.trim()) return items;

    const lowercaseQuery = query.toLowerCase();

    return items
      .filter((item) => {
        // Check if current item matches
        const itemMatches =
          item.label?.toLowerCase().includes(lowercaseQuery) ||
          item.key?.toLowerCase().includes(lowercaseQuery);

        // Check if any children match (for nested menus)
        const hasMatchingChildren =
          item.children && filterMenuItems(item.children, query).length > 0;

        return itemMatches || hasMatchingChildren;
      })
      .map((item) => {
        // If item has children, filter them recursively
        if (item.children) {
          return {
            ...item,
            children: filterMenuItems(item.children, query),
          };
        }
        return item;
      });
  };

  // Filter sections based on search query
  const getFilteredSections = (sections) => {
    if (!searchQuery.trim()) return sections;

    return sections
      .map((section) => {
        if (section.type === 'profile') {
          // Filter profile menu items
          const filteredMenuItems = filterMenuItems(
            section.menuItems || [],
            searchQuery
          );
          return {
            ...section,
            menuItems: filteredMenuItems,
            hasResults: filteredMenuItems.length > 0,
          };
        } else {
          // Filter regular section items
          const filteredItems = filterMenuItems(
            section.items || [],
            searchQuery
          );
          return {
            ...section,
            items: filteredItems,
            hasResults: filteredItems.length > 0,
          };
        }
      })
      .filter((section) => section.hasResults);
  };

  // Load collapsed state from localStorage - default to collapsed
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed !== null) {
      onCollapse(JSON.parse(savedCollapsed));
    } else {
      // Default to collapsed on first load
      onCollapse(true);
    }
  }, [onCollapse]);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Remove keyboard shortcuts for manual toggle since we're using hover
  // Keyboard shortcuts removed - hover-based expand/collapse only

  // Inject sidebar CSS - use useLayoutEffect for synchronous injection before paint
  useLayoutEffect(() => {
    injectSidebarCSS(token);
  }, [token]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Using Ant Design's standard breakpoints
      const mobileBreakpoint = token.screenSM || 576; // Small screen
      const tabletBreakpoint = token.screenMD || 768; // Medium screen

      setIsMobile(width < mobileBreakpoint);
      setIsTablet(width < tabletBreakpoint && width >= mobileBreakpoint);

      // Auto-collapse on mobile
      if (width < mobileBreakpoint && !collapsed) {
        onCollapse(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, onCollapse, token]);

  // Advanced section separator component
  const SectionSeparator = ({
    title,
    collapsed,
    accentColor = token.colorPrimary,
  }) => {
    if (collapsed) {
      // Return minimal spacing only - no visual indicators
      return (
        <div style={styles.zxHostSectionHeaderCollapsed} aria-label={title} />
      );
    }

    return (
      <div style={styles.zxHostSectionHeader}>
        <span>{title}</span>
        <div
          style={{
            ...styles.zxHostSectionDivider,
            background: `linear-gradient(90deg, ${accentColor}30, transparent)`,
          }}
        />
      </div>
    );
  };

  // Create menu sections directly from menu data - supports multiple sections per parent menu
  // Create menu sections directly from menu data - supports multiple sections per parent menu
  const createMenuSections = () => {
    const sections = [];

    // Main navigation - create separate sections for each child with sectionTitle
    if (sidebarMenus.length > 0) {
      if (collapsed) {
        // In collapsed mode: Show parent items (the ones with sectionTitle and icons) as menu items
        // This way users see icons for each section
        const itemsWithIcons = sidebarMenus.filter(item => item.icon);
        if (itemsWithIcons.length > 0) {
          sections.push({
            type: 'section',
            id: 'navigation-collapsed',
            title: selectedMainMenu?.sectionTitle || 'Navigation',
            accentColor: token.colorPrimary,
            items: itemsWithIcons, // Show the section parents as items
          });
        }
      } else {
        // In expanded mode: Show sections with their children
        sidebarMenus.forEach((menuItem, index) => {
          const sectionTitle = menuItem.sectionTitle || selectedMainMenu?.sectionTitle || 'Navigation Menu';
          const items = menuItem.children || [];

          if (items.length > 0) {
            sections.push({
              type: 'section',
              id: `navigation-${menuItem.key || index}`,
              title: sectionTitle,
              accentColor: token.colorPrimary,
              items: items,
            });
          }
        });
      }
    }

    // Profile section - direct access from profileSectionData
    if (profileSectionData) {
      sections.push({
        ...profileSectionData,
        items: profileSectionData.menuItems || [], // Ensure it's always an array
      });
    }
    return sections;
  };


  const backendMenuSections = createMenuSections();

  // Helper function to get badge count from badge object
  const getBadgeCount = (badge) => {
    if (!badge) return null;
    if (
      typeof badge === 'object' &&
      badge !== null &&
      badge.count !== undefined
    ) {
      return badge.count;
    }
    return badge;
  };

  // Helper function to get badge color from badge object
  const getBadgeColor = (badge) => {
    if (!badge || typeof badge !== 'object' || badge === null) {
      return undefined;
    }
    return badge.color || undefined;
  };

  // Format menu items for Ant Design Menu component
  const formatMenuItems = (items) => {
    // Add null check to prevent TypeError
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items.map((item) => {
      const badgeCount = getBadgeCount(item.badge);
      const badgeColor = getBadgeColor(item.badge);

      const menuItem = {
        key: item.key,
        icon: item.icon ? <i className={item.icon} /> : null,
        label: badgeCount ? (
          <div style={styles.zxHostMenuItemBadge}>
            <span>{item.label}</span>
            <Badge count={badgeCount} size="small" color={badgeColor} />
          </div>
        ) : (
          item.label
        ),
      };

      if (item.children && item.children.length > 0) {
        menuItem.children = formatMenuItems(item.children);
      }

      return menuItem;
    });
  };

  // Render a single section with its menu items
  const renderSection = (section, index) => {
    // Handle profile section differently
    if (section.type === 'profile') {
      return renderProfileSection(section);
    }

    // Handle regular sections
    return (
      <div key={section.id}>
        {/* Section Separator */}
        <SectionSeparator
          title={section.title}
          collapsed={collapsed}
          accentColor={section.accentColor}
        />

        {/* Section Menu Items */}
        <div
          style={styles.zxHostMenuContainer}
          className="zx-host-menu-container"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedSidebarKey]}
            openKeys={openSidebarKeys}
            onOpenChange={handleOpenChange}
            onSelect={({ key }) => handleMenuSelect(key)}
            inlineCollapsed={collapsed}
            inlineIndent={0}
            items={formatMenuItems(section.items)}
            triggerSubMenuAction={collapsed ? "hover" : "click"}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>
    );
  };

  // Render profile section with user info and dropdown
  const renderProfileSection = (profileSection) => {
    const { userData, menuItems } = profileSection;

    if (collapsed) {
      // Collapsed profile - just avatar
      return (
        <div key={profileSection.id} style={styles.zxHostProfileCollapsed}>
          <Dropdown
            menu={{
              items: formatMenuItems(
                menuItems.filter((item) => item.type !== 'divider')
              ),
              onClick: ({ key }) => handleMenuSelect(key),
            }}
            placement="rightTop"
            trigger={['click']}
          >
            <Avatar
              src={userData.avatar}
              size={40}
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        </div>
      );
    }

    // Expanded profile - full user info with dropdown
    return (
      <div key={profileSection.id} style={styles.zxHostProfileExpanded}>
        <Dropdown
          menu={{
            items: formatMenuItems(
              menuItems.filter((item) => item.type !== 'divider')
            ),
            onClick: ({ key }) => handleMenuSelect(key),
          }}
          placement="topLeft"
          trigger={['click']}
        >
          <div style={styles.zxHostProfileContent}>
            <Avatar src={userData.avatar} size={40} />
            <div style={styles.zxHostProfileInfo}>
              <div style={styles.zxHostProfileName}>{userData.name}</div>
              <div style={styles.zxHostProfileEmail}>{userData.email}</div>
            </div>
            <i className="ri-more-2-line" style={styles.zxHostProfileMore} />
          </div>
        </Dropdown>
      </div>
    );
  };


  // Get filtered sections based on search query
  const filteredSections = getFilteredSections(backendMenuSections);
  const navigationSections = filteredSections.filter(
    (section) => section.type !== 'profile'
  );
  const profileSection = filteredSections.find(
    (section) => section.type === 'profile'
  );

  return (
    <Sider
      collapsed={collapsed}
      width={260}
      collapsedWidth={80}
      style={styles.zxHostSidebarContainer}
      theme="light"
      trigger={null}
    >
      <div style={styles.zxHostSidebarContent}>
        {/* Header - Theme Toggle Controls */}
        <div style={styles.zxHostTopSection}>
          <div style={collapsed ? styles.zxHostControlsCollapsed : styles.zxHostControlsExpanded}>
            {/* Toggle Button */}
            <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
              <div
                style={styles.zxHostToggleButton}
                onClick={handleToggleClick}
                role="button"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                tabIndex={0}
              >
                <i
                  className={collapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"}
                  style={styles.zxHostToggleIcon}
                />
              </div>
            </Tooltip>

            {/* Theme Toggle Capsule - Finora Style */}
            <div style={{
              ...styles.zxHostThemeCapsule,
              flexDirection: collapsed ? 'column' : 'row', // Vertical when collapsed, horizontal when expanded
            }}>
              <Tooltip title="Light mode" placement="right">
                <div
                  style={{
                    ...styles.zxHostThemeButton,
                    ...((!isDarkMode) ? styles.zxHostThemeButtonActive : {}),
                  }}
                  onClick={() => !isDarkMode || toggleTheme()}
                  role="button"
                  aria-label="Switch to light mode"
                  tabIndex={0}
                >
                  <i className="ri-sun-line" style={{ fontSize: '20px', fontWeight: 600 }} />
                </div>
              </Tooltip>
              <Tooltip title="Dark mode" placement="right">
                <div
                  style={{
                    ...styles.zxHostThemeButton,
                    ...(isDarkMode ? styles.zxHostThemeButtonActive : {}),
                  }}
                  onClick={() => isDarkMode || toggleTheme()}
                  role="button"
                  aria-label="Switch to dark mode"
                  tabIndex={0}
                >
                  <i className="ri-moon-line" style={{ fontSize: '20px', fontWeight: 600 }} />
                </div>
              </Tooltip>
              <Tooltip title="Change primary color" placement="right">
                <ColorPicker
                  value={primaryColor}
                  onChange={(color) => setPrimaryColor(color.toHexString())}
                  size="small"
                  showText={false}
                  disabledAlpha={true}
                  presets={[
                    {
                      label: 'Recommended',
                      colors: [
                        token.colorPrimary || '#0050d8',
                        '#0050d8',
                        '#52c41a',
                        '#fa8c16',
                        '#ff4d4f',
                        '#722ed1',
                        '#13c2c2',
                        '#eb2f96',
                      ],
                    },
                  ]}
                >
                  <div style={styles.zxHostThemeButton}>
                    <i className="ri-palette-line" style={{ fontSize: '20px', fontWeight: 600 }} />
                  </div>
                </ColorPicker>
              </Tooltip>
            </div>
          </div>

          {/* Search Section */}
          {!collapsed && (
            <div style={styles.zxHostSearchContainer}>
              <Input
                placeholder="Search..."
                prefix={<i className="ri-search-line" />}
                style={styles.zxHostSearchInput}
                className="zx-host-search-input"
                size="middle"
                value={searchQuery}
                onChange={handleSearchChange}
                allowClear
              />
            </div>
          )}
        </div>

        {/* Scrollable Navigation Content */}
        <div style={styles.zxHostMainContent} className="zx-host-main-content">
          {/* Show "No results found" message when search has no results */}
          {searchQuery.trim() &&
            navigationSections.length === 0 &&
            !profileSection ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: token.colorTextSecondary,
                fontSize: '14px',
              }}
            >
              <i
                className="ri-search-line"
                style={{
                  fontSize: '24px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              />
              No results found for {searchQuery}
            </div>
          ) : (
            /* Dynamic Navigation Sections Rendering (excluding profile) */
            navigationSections.map((section, index) =>
              renderSection(section, index)
            )
          )}
        </div>

        {/* Fixed Profile Section at Bottom */}
        {profileSection &&
          renderSection(profileSection, backendMenuSections.length - 1)}
      </div>
    </Sider>
  );
};

export default AppSidebar;
