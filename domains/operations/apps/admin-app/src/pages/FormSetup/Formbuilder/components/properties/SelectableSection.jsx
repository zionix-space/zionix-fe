import React from 'react';
import styled from 'styled-components';
import { useFormBuilder } from '../../contexts/FormBuilderContext';

const SelectableSectionWrapper = styled.div`
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    .section-selection-overlay {
      opacity: 1;
    }
  }
  
  &.section-selected {
    .section-selection-overlay {
      opacity: 1;
      border-color: #4285f4;
      background: rgba(66, 133, 244, 0.04);
      box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.2);
    }
    
    .section-selection-indicator {
      opacity: 1;
    }
  }
`;

const SectionSelectionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.15s ease;
  z-index: 5;
  
  &:hover {
    border-color: #4285f4;
    background: rgba(66, 133, 244, 0.02);
    box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.1);
  }
`;

const SectionSelectionIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: #4285f4;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
  pointer-events: none;
  
  &::before {
    content: 'SECTION';
  }
`;

const SectionClickArea = styled.div`
  position: absolute;
  top: 0;
  left: 40px; /* Start after the collapse button */
  right: 200px; /* Leave space for action buttons */
  height: 60px; /* Header area */
  cursor: pointer;
  z-index: 6;
`;

const SelectableSection = ({ 
  section, 
  children, 
  onClick,
  className = '',
  ...props 
}) => {
  const { selectSection, isSelected } = useFormBuilder();
  
  const handleSectionClick = (e) => {
    e.stopPropagation();
    
    // Call the provided onClick handler first
    if (onClick) {
      onClick(e);
    }
    
    // Then handle selection
    if (section) {
      selectSection(section);
    }
  };
  
  const isSectionSelected = section && isSelected(section.id, 'section');
  
  return (
    <SelectableSectionWrapper
      className={`
        ${className}
        ${isSectionSelected ? 'section-selected' : ''}
      `.trim()}
      {...props}
    >
      {children}
      <SectionSelectionOverlay className="section-selection-overlay" />
      <SectionSelectionIndicator className="section-selection-indicator" />
      <SectionClickArea onClick={handleSectionClick} />
    </SelectableSectionWrapper>
  );
};

export default SelectableSection;