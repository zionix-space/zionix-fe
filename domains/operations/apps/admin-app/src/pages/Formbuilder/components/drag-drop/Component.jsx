import React, { useRef, memo, useMemo, useCallback, useState } from "react";
import { useDrag } from "react-dnd";

import { COMPONENT } from "../../constants";
// Container component imports removed
import * as S from "../../styles";
import ComponentRenderer from "./renderers/ComponentRenderer";
import { SelectableComponent } from "../properties";

// Memoized Component wrapper for better performance
const Component = memo(
  ({
    data,
    components,
    path,
    handleDrop,
    onUpdateComponent,
    isSelected,
    onSelect,
    onDelete,
    onDuplicate,
  }) => {
    const ref = useRef(null);
    // Hover state removed - handled by SelectableComponent

    // Memoized drag item to prevent unnecessary re-creations - using optional chaining
    const dragItem = useMemo(
      () => ({
        id: data?.id,
        type: data?.type || COMPONENT,
        path,
      }),
      [data?.id, data?.type, path]
    );

    // Memoized component lookup
    const component = useMemo(
      () => components?.[data?.id],
      [components, data?.id]
    );

    // Memoized style to prevent unnecessary re-computations
    const componentStyle = useMemo(
      () => ({
        opacity: 1, // Will be updated by drag hook
      }),
      []
    );

    // Handle container component updates
    const handleComponentUpdate = useCallback(
      (componentId, updates) => {
        if (onUpdateComponent) {
          onUpdateComponent(componentId, updates);
        }
      },
      [onUpdateComponent]
    );

    // Component selection is now handled by SelectableComponent wrapper

    // Handle component deletion
    const handleDelete = useCallback(
      (e) => {
        e.stopPropagation();
        if (onDelete) {
          onDelete(data.id);
        }
      },
      [onDelete, data.id]
    );

    // Handle component duplication
    const handleDuplicate = useCallback(
      (e) => {
        e.stopPropagation();
        if (onDuplicate) {
          onDuplicate(data.id);
        }
      },
      [onDuplicate, data.id]
    );

    // Mouse events removed - handled by SelectableComponent

    // Check if this is a container component
    const isContainerComponent = useMemo(() => {
      // Container types removed
      return false;
    }, [data?.type]);

    const [{ isDragging }, drag] = useDrag({
      type: data?.type || COMPONENT,
      item: dragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // Update style with drag state
    const finalStyle = useMemo(
      () => ({
        ...componentStyle,
        opacity: isDragging ? 0 : 1,
      }),
      [componentStyle, isDragging]
    );

    // Simplified form component renderer for drag preview
    const renderFormComponent = useCallback(() => {
      return <ComponentRenderer component={component} />;
    }, [component]);

    // Add safety checks after all hooks
    if (!data || !data.id) {
      console.error("Component received invalid data:", data);
      return null;
    }

    if (!components) {
      console.error("Component received no components object");
      return null;
    }

    drag(ref);

    // Render container components
    if (isContainerComponent) {
      const containerProps = {
        data,
        components,
        handleDrop,
        path,
        onUpdateComponent: handleComponentUpdate,
      };

      // Container cases removed - no container rendering
      return null;
    }

    // Add safety check for component lookup
    if (!component) {
      console.error(
        `Component with id "${data.id}" not found in components object. Available components:`,
        Object.keys(components)
      );
      console.error("Component data:", data);
      console.error("Full components object:", components);
      return (
        <S.Component ref={ref} style={finalStyle} className="draggable">
          <div style={{ color: "red" }}>Component not found: {data.id}</div>
        </S.Component>
      );
    }

    return (
      <SelectableComponent component={component}>
        <S.Component
          ref={ref}
          style={finalStyle}
          className={`draggable ${isDragging ? "dragging" : ""}`}
        >
          {/* Component type indicator */}
          <div className="component-type-indicator">
            {component?.type || "field"}
          </div>

          {/* Form component content */}
          {renderFormComponent()}
        </S.Component>
      </SelectableComponent>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to ensure re-render when path changes
    return (
      prevProps.data?.id === nextProps.data?.id &&
      prevProps.path === nextProps.path &&
      prevProps.components === nextProps.components
    );
  }
);

// Set display name for debugging
Component.displayName = "Component";

export default Component;
