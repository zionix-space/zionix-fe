import React, { useCallback } from "react";
import { message } from "antd";
import shortid from "shortid";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
  handleAdvancedDrop,
  handleAdvancedTrashDrop,
} from "../utils";
import { SIDEBAR_ITEM, COMPONENT, COLUMN, ROW } from "../constants";
import Row from "../components/drag-drop/Row";



/**
 * Custom hook that provides drag and drop handlers for the form builder
 * Encapsulates all drag and drop logic including advanced container handling
 */
export const useFormBuilderDragDrop = (
  sections,
  setSections,
  components,
  setComponents,
  saveToHistory
) => {
  /**
   * Enhanced trash drop handler with support for both legacy and advanced systems
   * Handles deletion of components from the form builder
   */
  const handleDropToTrashBin = useCallback(
    (_, item) => {
      // Check if this is a container component or advanced component
      if (
        item.id &&
        (item.type === "tabContainer" ||
          item.type === "cardContainer" ||
          item.type === "formSection" ||
          !item.path)
      ) {
        // Use advanced trash handler for container components
        const success = handleAdvancedTrashDrop(
          item,
          sections,
          setSections,
          setComponents
        );

        if (success) {
          return;
        }

        // If advanced handler fails, fall back to legacy system
        console.warn(
          "Advanced trash handler failed, falling back to legacy system"
        );
      }

      // Legacy trash handler for path-based components
      if (item.path) {
        const splitItemPath = item.path.split("-");
        setSections((currentSections) => {
          // Extract section index from item path
          const sectionIndex = parseInt(splitItemPath[0]);
          if (sectionIndex >= 0 && sectionIndex < currentSections.length) {
            const updatedSections = [...currentSections];
            const section = updatedSections[sectionIndex];
            const sectionItemPath = splitItemPath.slice(1); // Remove section index

            updatedSections[sectionIndex] = {
              ...section,
              layout: handleRemoveItemFromLayout(
                section.layout,
                sectionItemPath
              ),
            };
            
            // Save to history if callback is provided
            if (saveToHistory) {
              saveToHistory(updatedSections, components);
            }
            
            return updatedSections;
          }
          return currentSections;
        });

        // Also remove from components registry if it's a component
        if (
          item.type === COMPONENT ||
          item.type === "tabContainer" ||
          item.type === "cardContainer" ||
          item.type === "formSection"
        ) {
          setComponents((currentComponents) => {
            const newComponents = { ...currentComponents };
            delete newComponents[item.id];
            
            // Save to history if callback is provided
            if (saveToHistory) {
              saveToHistory(sections, newComponents);
            }
            
            return newComponents;
          });
        }
      }
    },
    [sections, setSections, setComponents]
  );

  /**
   * Optimized drop handler with column count warnings
   * Handles dropping components into the form builder
   */
  const handleDrop = useCallback(
    (dropZone, item) => {
      // Check if this is a drop into a container component
      if (dropZone.containerId || dropZone.containerType) {
        // Use advanced drop handler for container components
        const success = handleAdvancedDrop(
          dropZone,
          item,
          sections,
          components,
          setSections,
          setComponents
        );

        if (success) {
          return;
        }

        // If advanced handler fails, fall back to legacy system
        console.warn(
          "Advanced drop handler failed, falling back to legacy system"
        );
      }

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // Check for column count warning before processing drop
      if (item.type === COLUMN && item.path) {
        const splitItemPath = item.path.split("-");
        const dropZonePathRowIndex = splitDropZonePath[0];
        const itemPathRowIndex = splitItemPath[0];
        const diffRow = dropZonePathRowIndex !== itemPathRowIndex;

        // Show warning for cross-row column moves that create many columns
        if (
          diffRow &&
          splitDropZonePath.length === 2 &&
          dropZone.childrenCount >= 3
        ) {
          message.warning({
            content: (
              <div>
                <strong>⚠️ Layout Warning</strong>
                <br />
                This row now has {dropZone.childrenCount + 1} columns. Consider
                using fewer columns for better mobile responsiveness and user
                experience.
              </div>
            ),
            duration: 5,
            style: { marginTop: "20vh" },
          });
        }
      }

      // Handle sidebar item drop - creating new components
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: shortid.generate(),
          ...item.component,
        };

        // Determine the layout item type based on component type
        const layoutItemType = [
          "tabContainer",
          "cardContainer",
          "formSection",
        ].includes(newComponent.type)
          ? newComponent.type
          : COMPONENT;

        const newItem = {
          id: newComponent.id,
          type: layoutItemType,
        };

        // Add container-specific properties to layout item
        if (layoutItemType !== COMPONENT) {
          if (newComponent.type === "tabContainer") {
            newItem.tabs = newComponent.tabs || [];
          } else if (newComponent.type === "cardContainer") {
            newItem.children = [];
            newItem.cardProps = newComponent.cardProps || {};
          } else if (newComponent.type === "formSection") {
            newItem.children = [];
            newItem.sectionProps = newComponent.sectionProps || {};
            newItem.conditionalLogic = newComponent.conditionalLogic || {};
          }
        }

        // Use functional updates to avoid stale closure issues
        setComponents((currentComponents) => {
          const newComponents = {
            ...currentComponents,
            [newComponent.id]: newComponent,
          };
          
          // Save to history if callback is provided
          if (saveToHistory) {
            saveToHistory(sections, newComponents);
          }
          
          return newComponents;
        });
        setSections((currentSections) => {
          // Extract section index from dropZone path
          const sectionIndex = parseInt(dropZone.path.split("-")[0]);
          if (sectionIndex >= 0 && sectionIndex < currentSections.length) {
            const updatedSections = [...currentSections];
            const section = updatedSections[sectionIndex];
            const sectionDropZonePath = splitDropZonePath.slice(1); // Remove section index

            updatedSections[sectionIndex] = {
              ...section,
              layout: handleMoveSidebarComponentIntoParent(
                section.layout,
                sectionDropZonePath,
                newItem
              ),
            };
            
            // Save to history if callback is provided
            if (saveToHistory) {
              saveToHistory(updatedSections, components);
            }
            
            return updatedSections;
          }
          return currentSections;
        });
        return;
      }

      // Handle existing component movement
      // Check if item has a path property (sidebar items don't have paths)
      if (!item.path) {
        console.warn('Item does not have a path property:', item);
        return;
      }
      
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setSections((currentSections) => {
            // Extract section index from item path
            const sectionIndex = parseInt(splitItemPath[0]);
            if (sectionIndex >= 0 && sectionIndex < currentSections.length) {
              const updatedSections = [...currentSections];
              const section = updatedSections[sectionIndex];
              const sectionDropZonePath = splitDropZonePath.slice(1); // Remove section index
              const sectionItemPath = splitItemPath.slice(1); // Remove section index

              updatedSections[sectionIndex] = {
                ...section,
                layout: handleMoveWithinParent(
                  section.layout,
                  sectionDropZonePath,
                  sectionItemPath
                ),
              };
              
              // Save to history if callback is provided
              if (saveToHistory) {
                saveToHistory(updatedSections, components);
              }
              
              return updatedSections;
            }
            return currentSections;
          });
          return;
        }

        // 2.b. OR move different parent
        setSections((currentSections) => {
          const itemSectionIndex = parseInt(splitItemPath[0]);
          const dropSectionIndex = parseInt(splitDropZonePath[0]);

          if (itemSectionIndex === dropSectionIndex) {
            // Moving within the same section
            if (
              itemSectionIndex >= 0 &&
              itemSectionIndex < currentSections.length
            ) {
              const updatedSections = [...currentSections];
              const section = updatedSections[itemSectionIndex];
              const sectionDropZonePath = splitDropZonePath.slice(1);
              const sectionItemPath = splitItemPath.slice(1);

              updatedSections[itemSectionIndex] = {
                ...section,
                layout: handleMoveToDifferentParent(
                  section.layout,
                  sectionDropZonePath,
                  sectionItemPath,
                  item
                ),
              };
              
              // Save to history if callback is provided
              if (saveToHistory) {
                saveToHistory(updatedSections, components);
              }
              
              return updatedSections;
            }
          } else {
            // Moving between different sections
            if (
              itemSectionIndex >= 0 &&
              itemSectionIndex < currentSections.length &&
              dropSectionIndex >= 0 &&
              dropSectionIndex < currentSections.length
            ) {
              const updatedSections = [...currentSections];
              const sourceSection = updatedSections[itemSectionIndex];
              const targetSection = updatedSections[dropSectionIndex];
              const sectionDropZonePath = splitDropZonePath.slice(1);
              const sectionItemPath = splitItemPath.slice(1);

              // Helper function to collect all component IDs from a layout item
             const collectComponentIds = (layoutItem) => {
               const ids = [];
               if (layoutItem.id && (layoutItem.type === COMPONENT || layoutItem.type === ROW || layoutItem.type === COLUMN)) {
                 ids.push(layoutItem.id);
               }
               if (layoutItem.children) {
                 layoutItem.children.forEach(child => {
                   ids.push(...collectComponentIds(child));
                 });
               }
               return ids;
             };
 
             // Collect all component IDs from the item being moved
             const componentIds = collectComponentIds(item);
             
             // Preserve components in registry during cross-section move
              const componentsToPreserve = {};
              componentIds.forEach(id => {
                if (components[id]) {
                  componentsToPreserve[id] = components[id];
                }
              });

              // Remove from source section
              updatedSections[itemSectionIndex] = {
                ...sourceSection,
                layout: handleRemoveItemFromLayout(
                  sourceSection.layout,
                  sectionItemPath
                ),
              };

              // Add to target section
              updatedSections[dropSectionIndex] = {
                ...targetSection,
                layout: handleMoveToDifferentParent(
                  targetSection.layout,
                  sectionDropZonePath,
                  [], // Empty path since we're adding to target
                  item
                ),
              };

              // Update components registry to preserve nested components
              if (Object.keys(componentsToPreserve).length > 0) {
                setComponents(prevComponents => {
                  const newComponents = {
                    ...prevComponents,
                    ...componentsToPreserve
                  };
                  
                  // Save to history if callback is provided
                  if (saveToHistory) {
                    saveToHistory(updatedSections, newComponents);
                  }
                  
                  return newComponents;
                });
              } else {
                // Save to history if callback is provided and no components to preserve
                if (saveToHistory) {
                  saveToHistory(updatedSections, components);
                }
              }

              return updatedSections;
            }
          }
          return currentSections;
        });
        return;
      }

      // 3. Move + Create
      setSections((currentSections) => {
        const itemSectionIndex = parseInt(splitItemPath[0]);
        const dropSectionIndex = parseInt(splitDropZonePath[0]);

        if (itemSectionIndex === dropSectionIndex) {
          // Moving within the same section with create
          if (
            itemSectionIndex >= 0 &&
            itemSectionIndex < currentSections.length
          ) {
            const updatedSections = [...currentSections];
            const section = updatedSections[itemSectionIndex];
            const sectionDropZonePath = splitDropZonePath.slice(1);
            const sectionItemPath = splitItemPath.slice(1);

            updatedSections[itemSectionIndex] = {
              ...section,
              layout: handleMoveToDifferentParent(
                section.layout,
                sectionDropZonePath,
                sectionItemPath,
                item
              ),
            };
            return updatedSections;
          }
        } else {
          // Moving between different sections with create
          if (
            itemSectionIndex >= 0 &&
            itemSectionIndex < currentSections.length &&
            dropSectionIndex >= 0 &&
            dropSectionIndex < currentSections.length
          ) {
            const updatedSections = [...currentSections];
            const sourceSection = updatedSections[itemSectionIndex];
            const targetSection = updatedSections[dropSectionIndex];
            const sectionDropZonePath = splitDropZonePath.slice(1);
            const sectionItemPath = splitItemPath.slice(1);

            // Helper function to collect all component IDs from a layout item
            const collectComponentIds = (layoutItem) => {
              const ids = [];
              if (layoutItem.id && (layoutItem.type === COMPONENT || layoutItem.type === ROW || layoutItem.type === COLUMN)) {
                ids.push(layoutItem.id);
              }
              if (layoutItem.children) {
                layoutItem.children.forEach(child => {
                  ids.push(...collectComponentIds(child));
                });
              }
              return ids;
            };

            // Collect all component IDs from the item being moved
            const componentIds = collectComponentIds(item);
            
            // Preserve components in registry during cross-section move
            const componentsToPreserve = {};
            componentIds.forEach(id => {
              if (components[id]) {
                componentsToPreserve[id] = components[id];
              }
            });

            // Remove from source section
            updatedSections[itemSectionIndex] = {
              ...sourceSection,
              layout: handleRemoveItemFromLayout(
                sourceSection.layout,
                sectionItemPath
              ),
            };

            // Add to target section with create logic
             updatedSections[dropSectionIndex] = {
              ...targetSection,
              layout: handleMoveToDifferentParent(
                targetSection.layout,
                sectionDropZonePath,
                [],
                item
              ),
            };

            // Update components registry to preserve nested components
            if (Object.keys(componentsToPreserve).length > 0) {
              setComponents(prevComponents => ({
                ...prevComponents,
                ...componentsToPreserve
              }));
            }

            return updatedSections;
          }
        }
        return currentSections;
      });
    },
    [sections, components, setSections, setComponents]
  );

  /**
   * Handle component updates for container components
   * Updates both the components registry and layout structure
   */
  const handleComponentUpdate = useCallback(
    (componentId, updates) => {
      // Update components registry
      setComponents((currentComponents) => ({
        ...currentComponents,
        [componentId]: {
          ...currentComponents[componentId],
          ...updates,
        },
      }));

      // For container components, also update the layout structure
      if (
        updates.tabs ||
        updates.children ||
        updates.cardProps ||
        updates.sectionProps
      ) {
        setSections((currentSections) => {
          return currentSections.map((section) => {
            const updateLayoutComponent = (items) => {
              return items.map((item) => {
                if (item.id === componentId) {
                  return {
                    ...item,
                    ...updates,
                  };
                }

                // Recursively update nested items
                if (item.children) {
                  return {
                    ...item,
                    children: updateLayoutComponent(item.children),
                  };
                }

                // Handle tab containers
                if (item.type === "tabContainer" && item.tabs) {
                  return {
                    ...item,
                    tabs: item.tabs.map((tab) => ({
                      ...tab,
                      children: tab.children
                        ? updateLayoutComponent(tab.children)
                        : [],
                    })),
                  };
                }

                return item;
              });
            };

            return {
              ...section,
              layout: updateLayoutComponent(section.layout || []),
            };
          });
        });
      }
    },
    [setComponents, setSections]
  );

  /**
   * Renders a row component for the form builder
   * Used by SectionManager to render individual rows in the layout
   */
  const renderRow = useCallback(
    (rowData, path) => {
      return (
        <Row
          key={rowData.id}
          data={rowData}
          components={components}
          handleDrop={handleDrop}
          path={path}
          onUpdateComponent={handleComponentUpdate}
        />
      );
    },
    [components, handleDrop, handleComponentUpdate]
  );

  return {
    handleDrop,
    handleDropToTrashBin,
    handleComponentUpdate,
    renderRow,
  };
};