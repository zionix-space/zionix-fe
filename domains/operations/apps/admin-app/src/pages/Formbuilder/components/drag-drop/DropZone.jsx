import React, { memo, useMemo, useCallback, useState } from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { COMPONENT, SIDEBAR_ITEM, ROW, COLUMN } from "../../constants";
import * as S from "../../styles";
import { useThrottle } from "../../utils/performanceUtils";

const ACCEPTS = [SIDEBAR_ITEM, COMPONENT, ROW, COLUMN];

// Memoized DropZone component for better performance
const DropZone = memo(({ data, onDrop, isLast, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Throttled drop handler to prevent excessive calls during drag operations
  const throttledOnDrop = useThrottle(
    useCallback(
      (dropData, item) => {
        onDrop(dropData, item);
      },
      [onDrop]
    ),
    50
  );

  // Memoized canDrop logic with column count warnings
  const canDropLogic = useCallback(
    (item, monitor) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath.split("-");
      const itemPath = item.path;

      // sidebar items and container components can always be dropped anywhere
      if (!itemPath) {
        return true;
      }

      // Safety check for itemPath before splitting
      if (typeof itemPath !== "string") {
        console.warn("Invalid itemPath type:", typeof itemPath, itemPath);
        return true; // Allow drop but log warning
      }

      const splitItemPath = itemPath.split("-");

      // Allow column reordering between different rows with visual warnings
      // Check if this would create a row with many columns (for visual feedback)
      const dropZonePathRowIndex = splitDropZonePath[0];
      const itemPathRowIndex = splitItemPath[0];
      const diffRow = dropZonePathRowIndex !== itemPathRowIndex;

      // Add visual warning class for rows with 3+ columns
      if (
        diffRow &&
        splitDropZonePath.length === 2 &&
        data.childrenCount >= 3 &&
        item.type === "COLUMN"
      ) {
        // Still allow the drop but add warning class for visual feedback
        if (monitor && typeof monitor.getDropResult === "function") {
          // Add warning data for visual feedback
          monitor.warningType = "many-columns";
        }
      }

      // Invalid (Can't drop a parent element (row) into a child (column))
      // But allow cross-section moves where row is dropped at section level
      const parentDropInChild = splitItemPath.length < splitDropZonePath.length;
      if (parentDropInChild) {
        // Allow cross-section row moves: row from one section to another section's root
        const itemSectionIndex = splitItemPath[0];
        const dropSectionIndex = splitDropZonePath[0];
        const isRowItem = item.type === ROW;
        const isDropAtSectionLevel = splitDropZonePath.length === 2; // section-dropzone format
        const isCrossSectionMove = itemSectionIndex !== dropSectionIndex;
        
        if (isRowItem && isDropAtSectionLevel && isCrossSectionMove) {
          return true; // Allow cross-section row moves
        }
        
        return false;
      }

      // Current item can't possible move to it's own location
      if (itemPath === dropZonePath) return false;

      // Current area
      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-");
        const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
      }

      return true;
    },
    [data]
  );

  const [{ isOver, canDrop, draggedItem }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      throttledOnDrop(data, item);
    },
    canDrop: canDropLogic,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      draggedItem: monitor.getItem(),
    }),
  });

  // Memoized active state with warning detection
  const isActive = useMemo(() => isOver && canDrop, [isOver, canDrop]);

  // Check if this drop would create many columns (warning state)
  const hasWarning = useMemo(() => {
    if (!isActive || !draggedItem) return false;

    const dropZonePath = data.path;
    const splitDropZonePath = dropZonePath.split("-");
    const itemPath = draggedItem.path;

    if (!itemPath || typeof itemPath !== "string") return false;

    const splitItemPath = itemPath.split("-");
    const dropZonePathRowIndex = splitDropZonePath[0];
    const itemPathRowIndex = splitItemPath[0];
    const diffRow = dropZonePathRowIndex !== itemPathRowIndex;

    return (
      diffRow &&
      splitDropZonePath.length === 2 &&
      data.childrenCount >= 3 &&
      draggedItem.type === "COLUMN"
    );
  }, [isActive, draggedItem, data]);

  // Memoized className with warning state
  const dropZoneClassName = useMemo(
    () =>
      classNames(
        {
          active: isActive,
          isLast,
          "warning-many-columns": hasWarning,
          hovered: isHovered && !isActive,
        },
        className
      ),
    [isActive, isLast, hasWarning, isHovered, className]
  );

  // Enhanced drop zone with better visual feedback
  return (
    <S.DropZone 
      className={dropZoneClassName} 
      ref={drop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
        opacity: isActive ? 1 : (isHovered ? 0.8 : 0.6),
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#059669',
          fontSize: '12px',
          fontWeight: '500',
          pointerEvents: 'none',
          zIndex: 10,
          textAlign: 'center',
          animation: 'pulse 1.5s infinite',
        }}>
          {hasWarning ? '⚠️ Release to drop (Many columns)' : '✓ Release to drop here'}
        </div>
      )}
    </S.DropZone>
  );
});

// Set display name for debugging
DropZone.displayName = "DropZone";

export default DropZone;
