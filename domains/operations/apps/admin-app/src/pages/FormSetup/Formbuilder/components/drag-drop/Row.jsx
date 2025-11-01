import React, { useRef, memo, useMemo, useCallback } from "react";
import { useDrag } from "react-dnd";
import { ROW } from "../../constants";
import DropZone from "./DropZone";
import Column from "./Column";
import * as S from "../../styles";

// Memoized Row component for better performance with custom comparison
const Row = memo(
  ({ data, components, handleDrop, path, onUpdateComponent }) => {
    const ref = useRef(null);

    // Memoized drag item to prevent unnecessary re-creations - using optional chaining
    const dragItem = useMemo(
      () => ({
        id: data?.id,
        type: ROW,
        children: data?.children || [],
        path,
      }),
      [data?.id, data?.children, path]
    );

    // Memoized column renderer for better performance
    const renderColumn = useCallback(
      (column, currentPath) => {
        return (
          <Column
            key={column.id}
            data={column}
            components={components}
            handleDrop={handleDrop}
            path={currentPath}
            onUpdateComponent={onUpdateComponent}
          />
        );
      },
      [components, handleDrop, onUpdateComponent]
    );

    const [{ isDragging }, drag] = useDrag({
      type: ROW,
      item: dragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    // Memoized style to prevent unnecessary re-computations
    const rowStyle = useMemo(
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
      console.error("Row component received invalid data:", data);
      return null;
    }

    drag(ref);

    return (
      <S.Row
        ref={ref}
        style={rowStyle}
        className={className}
        data-column-count={children.length}
      >
        <S.Columns>
          {children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            // Memoized drop zone data for each column
            const dropZoneData = {
              path: currentPath,
              childrenCount: children.length,
            };

            return (
              <React.Fragment key={column.id}>
                <DropZone
                  data={dropZoneData}
                  onDrop={handleDrop}
                  className="horizontalDrag"
                />
                {renderColumn(column, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={lastDropZoneData}
            onDrop={handleDrop}
            className="horizontalDrag"
            isLast
          />
        </S.Columns>
      </S.Row>
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
Row.displayName = "Row";

export default Row;
