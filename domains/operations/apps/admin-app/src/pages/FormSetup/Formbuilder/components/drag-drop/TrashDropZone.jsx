import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import {
  COMPONENT,
  ROW,
  COLUMN,
} from "../../constants";
import * as S from "../../styles";

const ACCEPTS = [
  ROW,
  COLUMN,
  COMPONENT,
];

const TrashDropZone = ({ data, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const sections = data.sections;
      const itemPath = item.path;
      
      if (!itemPath || !sections) {
        return true;
      }
      
      const splitItemPath = itemPath.split("-");
      
      // Handle section-based paths (e.g., "0-1-2")
      if (splitItemPath.length >= 2) {
        const sectionIndex = parseInt(splitItemPath[0]);
        const itemPathRowIndex = parseInt(splitItemPath[1]);
        
        if (sectionIndex >= 0 && sectionIndex < sections.length) {
          const layout = sections[sectionIndex].layout;
          const itemRowChildrenLength =
            layout[itemPathRowIndex] && layout[itemPathRowIndex].children.length;

          // prevent removing a col when row has only one col
          if (
            item.type === COLUMN &&
            itemRowChildrenLength &&
            itemRowChildrenLength < 2
          ) {
            return false;
          }
        }
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  return (
    <S.TrashDropZone className={classNames({ active: isActive })} ref={drop}>
      TRASH
    </S.TrashDropZone>
  );
};
export default TrashDropZone;
