/**
 * Advanced Drag and Drop Handlers for Scalable Form Builder
 * Provides robust, capability-based drag and drop operations for any level of nesting
 */

import shortid from "shortid";
import {
  SIDEBAR_ITEM,
  ROW,
  COLUMN,
  COMPONENT,
  COMPONENT_CAPABILITIES,
} from "../constants";
import {
  findComponentById,
  findValidParentContainer,
  validateDrop,
  addComponentToContainer,
  removeComponentFromLayout,
  moveComponent,
  createComponent,
} from "./formComponentTreeUtils";

/**
 * Advanced drop handler that works with any component type and nesting level
 * @param {Object} dropData - Drop zone data containing target information
 * @param {Object} draggedItem - The item being dragged
 * @param {Array} layout - Current layout
 * @param {Object} components - Components registry
 * @param {Function} setLayout - Layout setter function
 * @param {Function} setComponents - Components setter function
 * @returns {boolean} - Success status
 */
export const handleAdvancedDrop = (
  dropData,
  draggedItem,
  layout,
  components,
  setLayout,
  setComponents
) => {
  try {
    // Handle sidebar item drops
    if (draggedItem.type === SIDEBAR_ITEM) {
      return handleSidebarItemDrop(
        dropData,
        draggedItem,
        layout,
        components,
        setLayout,
        setComponents
      );
    }

    // Handle existing component moves
    return handleComponentMove(dropData, draggedItem, layout, setLayout);
  } catch (error) {
    console.error("Drop operation failed:", error);
    return false;
  }
};

/**
 * Handles dropping sidebar items into the layout
 */
const handleSidebarItemDrop = (
  dropData,
  draggedItem,
  layout,
  components,
  setLayout,
  setComponents
) => {
  const { targetContainerId, targetIndex, targetTabId } =
    parseDropData(dropData);

  // Create new component from sidebar item
  const newComponent = {
    id: shortid.generate(),
    ...draggedItem.component,
  };

  // Register component in components registry
  setComponents((currentComponents) => ({
    ...currentComponents,
    [newComponent.id]: newComponent,
  }));

  // Create layout item
  const layoutItem = createLayoutItem(newComponent);

  // Handle root level drops
  if (!targetContainerId) {
    setLayout((currentLayout) => {
      const newLayout = [...currentLayout];
      const insertIndex =
        targetIndex !== undefined ? targetIndex : newLayout.length;

      // For root level, wrap in row-column structure if needed
      if (newComponent.type !== ROW) {
        const wrappedItem = wrapInRowColumn(layoutItem);
        newLayout.splice(insertIndex, 0, wrappedItem);
      } else {
        newLayout.splice(insertIndex, 0, layoutItem);
      }

      return newLayout;
    });
    return true;
  }

  // Handle container drops
  setLayout((currentLayout) => {
    return addComponentToContainer(
      currentLayout,
      targetContainerId,
      layoutItem,
      targetIndex,
      targetTabId
    );
  });

  return true;
};

/**
 * Handles moving existing components within the layout
 */
const handleComponentMove = (dropData, draggedItem, layout, setLayout) => {
  const { targetContainerId, targetIndex, targetTabId } =
    parseDropData(dropData);
  const sourceId = draggedItem.id;

  // Handle root level moves
  if (!targetContainerId) {
    setLayout((currentLayout) => {
      const sourceInfo = findComponentById(currentLayout, sourceId);
      if (!sourceInfo) return currentLayout;

      // Remove from source
      let newLayout = removeComponentFromLayout(currentLayout, sourceId);

      // Add to target position
      const insertIndex =
        targetIndex !== undefined ? targetIndex : newLayout.length;
      newLayout.splice(insertIndex, 0, sourceInfo.component);

      return newLayout;
    });
    return true;
  }

  // Handle container moves
  setLayout((currentLayout) => {
    return moveComponent(
      currentLayout,
      sourceId,
      targetContainerId,
      targetIndex,
      targetTabId
    );
  });

  return true;
};

/**
 * Parses drop data to extract target information
 */
const parseDropData = (dropData) => {
  // Handle different drop data formats for backward compatibility
  if (typeof dropData === "string") {
    // Legacy path-based format
    return parseLegacyPath(dropData);
  }

  if (dropData && typeof dropData === "object") {
    // Extract index from path if not directly provided
    let targetIndex = dropData.index;
    if (targetIndex === undefined && dropData.path) {
      const pathSegments = dropData.path.split("-");
      targetIndex = parseInt(pathSegments[pathSegments.length - 1], 10);
    }

    // Handle different container-specific IDs (tabId, stepId, panelId)
    const targetTabId = dropData.tabId || dropData.stepId || dropData.panelId;

    return {
      targetContainerId: dropData.containerId,
      targetIndex: targetIndex,
      targetTabId: targetTabId, // This will work for tabs, steps, and panels
      dropZoneType: dropData.containerType || dropData.type,
    };
  }

  return {};
};

/**
 * Parses legacy path-based drop data for backward compatibility
 */
const parseLegacyPath = (path) => {
  // Convert legacy path format to new format
  // This maintains compatibility with existing code
  const segments = path.split("-");

  return {
    targetContainerId: null, // Will be resolved by context
    targetIndex: parseInt(segments[segments.length - 1], 10),
    legacyPath: path,
  };
};

/**
 * Creates a layout item from a component
 */
const createLayoutItem = (component) => {
  const layoutItem = {
    id: component.id,
    type: COMPONENT,
  };

  // Handle container components
  if (COMPONENT_CAPABILITIES[component.type]?.isContainer) {
    layoutItem.type = component.type;
    layoutItem.children = [];

    // Add type-specific properties
    switch (component.type) {
      // Container cases removed
    }
  }

  return layoutItem;
};

/**
 * Wraps a component in row-column structure for root level placement
 */
const wrapInRowColumn = (component) => {
  return {
    id: shortid.generate(),
    type: ROW,
    children: [
      {
        id: shortid.generate(),
        type: COLUMN,
        children: [component],
      },
    ],
  };
};

/**
 * Enhanced drop validation with capability checking
 */
export const validateAdvancedDrop = (draggedItem, dropTarget, layout) => {
  if (!draggedItem || !dropTarget) {
    return { isValid: false, reason: "Invalid drag or drop target" };
  }

  // Handle sidebar items
  if (draggedItem.type === SIDEBAR_ITEM) {
    return validateSidebarItemDrop(draggedItem, dropTarget, layout);
  }

  // Handle existing components
  return validateComponentMove(draggedItem, dropTarget, layout);
};

/**
 * Validates sidebar item drops
 */
const validateSidebarItemDrop = (sidebarItem, dropTarget, layout) => {
  const componentType = sidebarItem.component?.type;
  if (!componentType) {
    return { isValid: false, reason: "Invalid sidebar item" };
  }

  // Root level drops are always valid (will be wrapped appropriately)
  if (!dropTarget.containerId) {
    return { isValid: true, reason: "Valid root level drop" };
  }

  // Find target container and validate
  const containerInfo = findComponentById(layout, dropTarget.containerId);
  if (!containerInfo) {
    return { isValid: false, reason: "Target container not found" };
  }

  return validateDrop(
    { type: componentType },
    containerInfo.component,
    dropTarget.index
  );
};

/**
 * Validates component moves
 */
const validateComponentMove = (draggedItem, dropTarget, layout) => {
  const sourceInfo = findComponentById(layout, draggedItem.id);
  if (!sourceInfo) {
    return { isValid: false, reason: "Source component not found" };
  }

  // Root level moves are always valid
  if (!dropTarget.containerId) {
    return { isValid: true, reason: "Valid root level move" };
  }

  // Find target container and validate
  const containerInfo = findComponentById(layout, dropTarget.containerId);
  if (!containerInfo) {
    return { isValid: false, reason: "Target container not found" };
  }

  return validateDrop(
    sourceInfo.component,
    containerInfo.component,
    dropTarget.index
  );
};

/**
 * Handles trash/delete operations
 */
export const handleAdvancedTrashDrop = (
  draggedItem,
  layout,
  setLayout,
  setComponents
) => {
  try {
    if (!draggedItem.id) {
      return false;
    }

    // Remove from layout
    setLayout((currentLayout) => {
      return removeComponentFromLayout(currentLayout, draggedItem.id);
    });

    // Remove from components registry for all component types
    if (draggedItem.id) {
      setComponents((currentComponents) => {
        const newComponents = { ...currentComponents };
        delete newComponents[draggedItem.id];
        return newComponents;
      });
    }

    return true;
  } catch (error) {
    console.error("Trash drop operation failed:", error);
    return false;
  }
};

/**
 * Creates enhanced drop zone data for new system
 */
export const createDropZoneData = (
  containerId,
  index,
  tabId = null,
  type = "default"
) => {
  return {
    containerId,
    index,
    tabId,
    type,
    timestamp: Date.now(), // For debugging
  };
};

/**
 * Migrates legacy path-based data to new UUID-based system
 */
export const migrateLegacyDropData = (legacyData, layout) => {
  if (typeof legacyData === "string") {
    // Convert path to container ID and index
    const segments = legacyData.split("-");
    // This would need context-specific logic based on current implementation
    return {
      containerId: null, // Would be resolved from context
      index: parseInt(segments[segments.length - 1], 10),
      legacy: true,
    };
  }

  return legacyData;
};
