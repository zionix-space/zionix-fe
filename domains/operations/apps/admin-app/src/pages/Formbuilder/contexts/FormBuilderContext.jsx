import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const FormBuilderContext = createContext();

// Custom hook to use the context
export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
};

// Context provider component
export const FormBuilderProvider = ({ children }) => {
  // Selection state
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectionType, setSelectionType] = useState(null); // 'component' | 'section' | null

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedComponent(null);
    setSelectedSection(null);
    setSelectedElementId(null);
    setSelectionType(null);
  }, []);

  // Select a component
  const selectComponent = useCallback((component) => {
    setSelectedComponent(component);
    setSelectedSection(null);
    setSelectedElementId(component?.id || null);
    setSelectionType('component');
  }, []);

  // Select a section
  const selectSection = useCallback((section) => {
    setSelectedSection(section);
    setSelectedComponent(null);
    setSelectedElementId(section?.id || null);
    setSelectionType('section');
  }, []);

  // Check if an element is selected
  const isSelected = useCallback((elementId, type) => {
    return selectedElementId === elementId && selectionType === type;
  }, [selectedElementId, selectionType]);

  // Get selection info
  const getSelectionInfo = useCallback(() => {
    return {
      hasSelection: !!(selectedComponent || selectedSection),
      selectedComponent,
      selectedSection,
      selectedElementId,
      selectionType
    };
  }, [selectedComponent, selectedSection, selectedElementId, selectionType]);

  const value = {
    // Selection state
    selectedComponent,
    selectedSection,
    selectedElementId,
    selectionType,
    
    // Selection actions
    selectComponent,
    selectSection,
    clearSelection,
    isSelected,
    getSelectionInfo
  };

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export default FormBuilderContext;