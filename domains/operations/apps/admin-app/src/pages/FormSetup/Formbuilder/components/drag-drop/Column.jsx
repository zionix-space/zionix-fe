import React, { useRef, memo, useMemo, useCallback } from "react";
import { useDrag } from "react-dnd";
import { COLUMN, ROW, COMPONENT } from "../../constants";
import DropZone from "./DropZone";
import Component from "./Component";
import Row from "./Row";
import * as S from "../../styles";

// Memoized Column component for better performance
const Column = memo(
  ({ data, components, handleDrop, path, onUpdateComponent }) => {
    const ref = useRef(null);

    // Memoized drag item to prevent unnecessary re-creations - using optional chaining
    const dragItem = useMemo(
      () => ({
        id: data?.id,
        type: COLUMN,
        children: data?.children || [],
        path,
      }),
      [data?.id, data?.children, path]
    );

    // Memoized item renderer for better performance - handles different types
    const renderItem = useCallback(
      (item, currentPath) => {
        if (item.type === ROW) {
          return (
            <Row
              key={item.id}
              data={item}
              components={components}
              handleDrop={handleDrop}
              path={currentPath}
              onUpdateComponent={onUpdateComponent}
            />
          );
        } else if (item.type === COMPONENT || item.type === "view" || item.type === "embedded_view") {
          return (
            <Component
              key={item.id}
              data={item}
              components={components}
              path={currentPath}
              handleDrop={handleDrop}
              onUpdateComponent={onUpdateComponent}
            />
          );
        } else {
          console.warn(`Unknown item type in Column: ${item.type}`, item);
          return null;
        }
      },
      [components, handleDrop, onUpdateComponent]
    );

    const [{ isDragging }, drag] = useDrag({
      type: COLUMN,
      item: dragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // Memoized style to prevent unnecessary re-computations
    const columnStyle = useMemo(
      () => ({
        opacity: isDragging ? 0 : 1,
      }),
      [isDragging]
    );

    // Memoized className to prevent unnecessary re-computations
    const className = useMemo(
      () => `draggable ${isDragging ? "dragging" : ""}`,
      [isDragging]
    );

    // Ensure children is always an array - using optional chaining
    const children = data?.children || [];

    // Memoized last drop zone data
    const lastDropZoneData = useMemo(
      () => ({
        path: `${path}-${children.length}`,
        childrenCount: children.length,
      }),
      [path, children.length]
    );

    // Add safety check for data after all hooks
    if (!data || !data.id) {
      console.error("Column component received invalid data:", data);
      return null;
    }

    drag(ref);

    return (
      <S.Column ref={ref} style={columnStyle} className={className}>
        {children.map((item, index) => {
          const currentPath = `${path}-${index}`;

          // Memoized drop zone data for each item
          const dropZoneData = {
            path: currentPath,
            childrenCount: children.length,
          };

          return (
            <React.Fragment key={item.id}>
              <DropZone data={dropZoneData} onDrop={handleDrop} />
              {renderItem(item, currentPath)}
            </React.Fragment>
          );
        })}
        <DropZone data={lastDropZoneData} onDrop={handleDrop} isLast />
      </S.Column>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to ensure re-render when path changes - avoid JSON.stringify
    if (
      prevProps.data?.id !== nextProps.data?.id ||
      prevProps.path !== nextProps.path ||
      prevProps.handleDrop !== nextProps.handleDrop ||
      prevProps.components !== nextProps.components ||
      prevProps.onUpdateComponent !== nextProps.onUpdateComponent
    ) {
      return false;
    }

    // Compare children array length and IDs only (shallow comparison)
    const prevChildren = prevProps.data?.children || [];
    const nextChildren = nextProps.data?.children || [];

    if (prevChildren.length !== nextChildren.length) {
      return false;
    }

    // Compare children IDs and types only (avoid deep comparison)
    for (let i = 0; i < prevChildren.length; i++) {
      if (
        prevChildren[i]?.id !== nextChildren[i]?.id ||
        prevChildren[i]?.type !== nextChildren[i]?.type
      ) {
        return false;
      }
    }

    return true;
  }
);

// Set display name for debugging
Column.displayName = "Column";

export default Column;
