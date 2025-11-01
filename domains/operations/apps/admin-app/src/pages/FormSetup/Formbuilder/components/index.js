/**
 * Component exports for the form builder
 */

import { lazy } from "react";

// Core drag and drop components
export { default as DropZone } from "./drag-drop/DropZone";
export { default as SidebarItem } from "./drag-drop/SideBarItem";
export { default as Row } from "./drag-drop/Row";
export { default as Column } from "./drag-drop/Column";
export { default as Component } from "./drag-drop/Component";

// Container components removed

// Sidebar components
export { default as ComponentPaletteSidebar } from "./sidebar/ComponentPaletteSidebar";

// Lazy-loaded components
export const TrashDropZone = lazy(() => import("./drag-drop/TrashDropZone"));
