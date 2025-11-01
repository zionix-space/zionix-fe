/**
 * Advanced Component Tree Utilities for UUID-based Form Builder
 * Provides robust tree traversal, manipulation, and validation for scalable nested components
 */

import shortid from "shortid";
import {
  ROW,
  COLUMN,
  COMPONENT_CAPABILITIES,
} from "../constants";

/**
 * Finds a component by ID in the layout tree
 * @param {Array} layout - The layout array
 * @param {string} targetId - The ID to find
 * @returns {Object|null} - { component, parent, index, path }
 */
export const findComponentById = (layout, targetId) => {
  const search = (items, parent = null, parentIndex = -1, currentPath = []) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = [...currentPath, i];

      if (item.id === targetId) {
        return {
          component: item,
          parent,
          index: i,
          path: itemPath,
          parentIndex,
        };
      }

      // Search in children based on component type
      if (item.children && Array.isArray(item.children)) {
        const result = search(item.children, item, i, itemPath);
        if (result) return result;
      }

      // Container-specific search logic removed
    }
    return null;
  };

  return search(layout);
};

/**
 * Finds the parent container that can accept a specific component type
 * @param {Array} layout - The layout array
 * @param {string} targetId - The target container ID
 * @param {string} componentType - The type of component to be added
 * @returns {Object|null} - Parent container info
 */
export const findValidParentContainer = (layout, targetId, componentType) => {
  const containerInfo = findComponentById(layout, targetId);
  if (!containerInfo) return null;

  const { component } = containerInfo;
  const capabilities = COMPONENT_CAPABILITIES[component.type];

  if (!capabilities || !capabilities.canContain.includes(componentType)) {
    return null;
  }

  return containerInfo;
};

/**
 * Validates if a component can be dropped into a target container
 * @param {Object} sourceComponent - The component being dragged
 * @param {Object} targetContainer - The target container
 * @param {number} targetIndex - The target index
 * @returns {Object} - { isValid, reason }
 */
export const validateDrop = (
  sourceComponent,
  targetContainer,
  targetIndex = -1
) => {
  if (!sourceComponent || !targetContainer) {
    return { isValid: false, reason: "Invalid source or target" };
  }

  const targetCapabilities = COMPONENT_CAPABILITIES[targetContainer.type];
  if (!targetCapabilities) {
    return { isValid: false, reason: "Unknown target container type" };
  }

  // Check if target can contain source type
  if (!targetCapabilities.canContain.includes(sourceComponent.type)) {
    return {
      isValid: false,
      reason: `${targetContainer.type} cannot contain ${sourceComponent.type}`,
    };
  }

  // Check max children limit
  const currentChildrenCount = getChildrenCount(targetContainer);
  if (currentChildrenCount >= targetCapabilities.maxChildren) {
    return {
      isValid: false,
      reason: `Maximum children limit (${targetCapabilities.maxChildren}) reached`,
    };
  }

  // Prevent dropping component into itself or its descendants
  if (isDescendant(sourceComponent, targetContainer)) {
    return {
      isValid: false,
      reason: "Cannot drop component into itself or its descendants",
    };
  }

  return { isValid: true, reason: "Valid drop" };
};

/**
 * Gets the children count for a container component
 * @param {Object} container - The container component
 * @returns {number} - Number of children
 */
export const getChildrenCount = (container) => {
  if (!container) return 0;
  // Container-specific cases removed
  return container.children ? container.children.length : 0;
};

/**
 * Checks if a component is a descendant of another component
 * @param {Object} ancestor - The potential ancestor component
 * @param {Object} descendant - The potential descendant component
 * @returns {boolean} - True if descendant is a child of ancestor
 */
export const isDescendant = (ancestor, descendant) => {
  if (!ancestor || !descendant || ancestor.id === descendant.id) {
    return false;
  }

  const checkChildren = (children) => {
    if (!children || !Array.isArray(children)) return false;

    for (const child of children) {
      if (child.id === descendant.id) return true;
      if (child.children && checkChildren(child.children)) return true;
      // Container-specific checks removed
    }
    return false;
  };

  return checkChildren(ancestor.children);
};

/**
 * Adds a component to a container at a specific position
 * @param {Array} layout - The layout array
 * @param {string} containerId - The container ID
 * @param {Object} component - The component to add
 * @param {number} index - The index to insert at (-1 for end)
 * @param {string} tabId - Optional tab ID for tab containers
 * @returns {Array} - Updated layout
 */
export const addComponentToContainer = (
  layout,
  containerId,
  component,
  index = -1,
  tabId = null
) => {
  const newLayout = JSON.parse(JSON.stringify(layout));
  const containerInfo = findComponentById(newLayout, containerId);

  if (!containerInfo) {
    throw new Error(`Container with ID ${containerId} not found`);
  }

  const { component: container } = containerInfo;
  const validation = validateDrop(component, container, index);

  if (!validation.isValid) {
    throw new Error(`Invalid drop: ${validation.reason}`);
  }

  // Container-specific cases removed - using default behavior
  if (!container.children) container.children = [];

  if (index === -1 || index >= container.children.length) {
    container.children.push(component);
  } else {
    container.children.splice(index, 0, component);
  }

  return newLayout;
};

/**
 * Removes a component from the layout
 * @param {Array} layout - The layout array
 * @param {string} componentId - The component ID to remove
 * @returns {Array} - Updated layout
 */
export const removeComponentFromLayout = (layout, componentId) => {
  const newLayout = JSON.parse(JSON.stringify(layout));
  const componentInfo = findComponentById(newLayout, componentId);

  if (!componentInfo) {
    throw new Error(`Component with ID ${componentId} not found`);
  }

  const { parent, index, path } = componentInfo;

  if (!parent) {
    // Component is at root level
    newLayout.splice(index, 1);
  } else {
    // Component is nested
    // Container-specific removal logic removed
    if (parent.children) {
      parent.children.splice(index, 1);
    }
  }

  return newLayout;
};

/**
 * Moves a component from one location to another
 * @param {Array} layout - The layout array
 * @param {string} sourceId - The source component ID
 * @param {string} targetContainerId - The target container ID
 * @param {number} targetIndex - The target index
 * @param {string} targetTabId - Optional target tab ID
 * @returns {Array} - Updated layout
 */
export const moveComponent = (
  layout,
  sourceId,
  targetContainerId,
  targetIndex = -1,
  targetTabId = null
) => {
  const sourceInfo = findComponentById(layout, sourceId);
  if (!sourceInfo) {
    throw new Error(`Source component with ID ${sourceId} not found`);
  }

  // Remove from source location
  let updatedLayout = removeComponentFromLayout(layout, sourceId);

  // Add to target location
  updatedLayout = addComponentToContainer(
    updatedLayout,
    targetContainerId,
    sourceInfo.component,
    targetIndex,
    targetTabId
  );

  return updatedLayout;
};

/**
 * Calculates the nesting depth of a component in the layout tree
 * @param {Array} layout - The layout array
 * @param {string} componentId - The component ID to find depth for
 * @returns {number} - The nesting depth (0 for root level)
 */
export const calculateNestingDepth = (layout, componentId) => {
  const findDepth = (items, targetId, currentDepth = 0) => {
    for (const item of items) {
      if (item.id === targetId) {
        return currentDepth;
      }

      // Check children array
      if (item.children && Array.isArray(item.children)) {
        const depth = findDepth(item.children, targetId, currentDepth + 1);
        if (depth !== -1) return depth;
      }

      // Check tabs structure
      if (item.tabs && Array.isArray(item.tabs)) {
        for (const tab of item.tabs) {
          if (tab.children && Array.isArray(tab.children)) {
            const depth = findDepth(tab.children, targetId, currentDepth + 2); // +2 for tab container + tab
            if (depth !== -1) return depth;
          }
        }
      }

      // Check steps structure
      if (item.steps && Array.isArray(item.steps)) {
        for (const step of item.steps) {
          if (step.children && Array.isArray(step.children)) {
            const depth = findDepth(step.children, targetId, currentDepth + 2); // +2 for steps container + step
            if (depth !== -1) return depth;
          }
        }
      }

      // Check panels structure (accordion)
      if (item.panels && Array.isArray(item.panels)) {
        for (const panel of item.panels) {
          if (panel.children && Array.isArray(panel.children)) {
            const depth = findDepth(panel.children, targetId, currentDepth + 2); // +2 for accordion + panel
            if (depth !== -1) return depth;
          }
        }
      }
    }
    return -1;
  };

  return findDepth(layout, componentId);
};

/**
 * Validates if adding a component would exceed maximum nesting depth
 * @param {Array} layout - The layout array
 * @param {string} targetContainerId - The target container ID
 * @param {string} componentType - The type of component being added
 * @param {number} maxDepth - Maximum allowed nesting depth (default: 10)
 * @returns {Object} - Validation result
 */
export const validateNestingDepth = (
  layout,
  targetContainerId,
  componentType,
  maxDepth = 10
) => {
  const currentDepth = calculateNestingDepth(layout, targetContainerId);

  if (currentDepth === -1) {
    return {
      isValid: false,
      reason: "Target container not found",
      currentDepth: 0,
      maxDepth,
    };
  }

  const newDepth = currentDepth + 1;

  if (newDepth > maxDepth) {
    return {
      isValid: false,
      reason: `Maximum nesting depth (${maxDepth}) would be exceeded. Current depth: ${currentDepth}`,
      currentDepth,
      maxDepth,
    };
  }

  return {
    isValid: true,
    reason: "Nesting depth is valid",
    currentDepth,
    maxDepth,
    newDepth,
  };
};

/**
 * Checks if a component can be nested within another based on type compatibility
 * @param {string} parentType - The parent container type
 * @param {string} childType - The child component type
 * @returns {Object} - Compatibility result
 */
export const validateTypeCompatibility = (parentType, childType) => {
  const parentCapabilities = COMPONENT_CAPABILITIES[parentType];

  if (!parentCapabilities) {
    return {
      isValid: false,
      reason: `Unknown parent type: ${parentType}`,
    };
  }

  if (!parentCapabilities.canContain.includes(childType)) {
    return {
      isValid: false,
      reason: `${parentType} cannot contain ${childType}`,
      allowedTypes: parentCapabilities.canContain,
    };
  }

  return {
    isValid: true,
    reason: "Type compatibility validated",
    allowedTypes: parentCapabilities.canContain,
  };
};

/**
 * Creates a new component with proper structure
 * @param {string} type - The component type
 * @param {Object} props - Additional properties
 * @returns {Object} - New component
 */
export const createComponent = (type, props = {}) => {
  const baseComponent = {
    id: shortid.generate(),
    type,
    ...props,
  };

  const capabilities = COMPONENT_CAPABILITIES[type];
  if (capabilities && capabilities.isContainer) {
    baseComponent.children = [];
  }

  // Container-specific properties removed

  return baseComponent;
};