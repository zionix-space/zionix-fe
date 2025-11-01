import React from "react";
import styled from "styled-components";
import { useFormBuilder } from "../../contexts/FormBuilderContext";

const SelectableWrapper = styled.div`
  position: relative;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  /* border-radius: 6px; */

  &:hover {
    border-color: #4285f4;
    background: rgba(66, 133, 244, 0.04);
    box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.2);
  }

  &.selected {
    background: rgba(66, 133, 244, 0.08);
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      /* border: 1px solid #4285f4; */
      /* border-radius: 8px; */
      pointer-events: none;
    }
  }

  &.component-selected {
    .selection-indicator {
      opacity: 1;
    }
  }
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: #4285f4;
  border: 2px solid #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 15;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &::after {
    content: "✓";
    color: white;
    font-size: 8px;
    font-weight: bold;
  }
`;

const SelectableComponent = ({
  component,
  children,
  onClick,
  className = "",
  ...props
}) => {
  const { selectComponent, isSelected, selectedComponent } = useFormBuilder();

  const handleClick = (e) => {
    e.stopPropagation();

    // Call the provided onClick handler first
    if (onClick) {
      onClick(e);
    }

    // Then handle selection
    if (component) {
      selectComponent(component);
    }
  };

  const isComponentSelected =
    component && isSelected(component.id, "component");

  return (
    <SelectableWrapper
      className={`
        ${className}
        ${isComponentSelected ? "selected component-selected" : ""}
      `.trim()}
      onClick={handleClick}
      {...props}
    >
      {children}
      <SelectionIndicator className="selection-indicator" />
    </SelectableWrapper>
  );
};

export default SelectableComponent;
