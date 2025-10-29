import React, { useState, useMemo, memo, useCallback } from 'react';
import { Segmented } from 'antd';

import FormDataModals from './components/modals/FormDataModals';
import { createTabItems } from './components/tabs/NavigationTabsConfig';
import { FormBuilderProvider } from './contexts/FormBuilderContext';
import { initialData } from './data';
import { useFormBuilderDragDrop } from './hooks/useFormBuilderDragDrop';
import { useFormDataOperations } from './hooks/useFormDataOperations';
import * as S from './styles';

/**
 * Container component - Main application container for the form builder
 * Manages the overall state and provides the main UI structure
 */
const FormBuilderContainer = memo(() => {
  // Core state management for form sections and components
  const [sections, setSections] = useState(initialData.sections);
  const [components, setComponents] = useState(initialData.components);
  const [activeTab, setActiveTab] = useState('form');
  const [targetSectionId, setTargetSectionId] = useState(null);
  const [layoutType, setLayoutType] = useState('single');

  // Form metadata state - lifted up to be shared between builder and preview
  const [formTitle, setFormTitle] = useState('New Form');
  const [formDescription, setFormDescription] = useState(
    'Create your form by adding fields from the library'
  );
  const [backgroundColor, setBackgroundColor] = useState('#f8f9fa');

  // Undo/Redo state with proper history management
  const [history, setHistory] = useState([
    { sections: initialData.sections, components: initialData.components },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Memoized current form schema to prevent unnecessary re-computations
  const currentFormSchema = useMemo(() => {
    console.log('currentFormSchema useMemo triggered with:', {
      formTitle,
      formDescription,
      sectionsLength: sections.length,
      componentsCount: Object.keys(components).length,
    });
    return {
      layout: sections,
      components,
      metadata: {
        version: '1.0.0',
        title: formTitle,
        description: formDescription,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Form Builder System',
        category: 'custom-form',
        tags: ['form-builder', 'custom'],
        formId: `FORM_${Date.now()}`,
        isActive: true,
        approvalStatus: 'draft',
        layoutType: layoutType,
        backgroundColor: backgroundColor,
        totalSections: sections.length,
        totalComponents: Object.keys(components).length,
      },
    };
  }, [
    sections,
    components,
    formTitle,
    formDescription,
    layoutType,
    backgroundColor,
  ]);

  // Save current state to history when changes occur
  const saveToHistory = (newSections, newComponents) => {
    const newState = { sections: newSections, components: newComponents };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    // Limit history to 50 entries to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  // Undo/Redo handlers - memoized to prevent infinite re-renders
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setHistoryIndex(newIndex);
      setSections(previousState.sections);
      setComponents(previousState.components);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setHistoryIndex(newIndex);
      setSections(nextState.sections);
      setComponents(nextState.components);
    }
  }, [historyIndex, history]);

  // Custom hooks for drag and drop functionality
  const { handleDrop, handleDropToTrashBin, handleComponentUpdate, renderRow } =
    useFormBuilderDragDrop(
      sections,
      setSections,
      components,
      setComponents,
      saveToHistory
    );

  // Custom hooks for JSON operations
  const {
    jsonModalVisible,
    setJsonModalVisible,
    importModalVisible,
    setImportModalVisible,
    jsonInput,
    setJsonInput,
    handleFormSubmit,
    handleExportJSON,
    handleViewJSON,
    handleImportJSON,
    handleImportSubmit,
    getCurrentSchema,
  } = useFormDataOperations(
    sections,
    setSections,
    components,
    setComponents,
    currentFormSchema
  );

  // Enhanced setActiveTab function to handle section context - memoized
  const handleSetActiveTab = useCallback((tabKey, context = {}) => {
    setActiveTab(tabKey);
    if (context.targetSectionId) {
      setTargetSectionId(context.targetSectionId);
    } else {
      setTargetSectionId(null);
    }
  }, []);

  // Create tab items using the configuration component
  const tabItems = useMemo(
    () =>
      createTabItems({
        sections,
        components,
        setSections,
        setComponents,
        handleDrop,
        handleDropToTrashBin,
        renderRow,
        layoutType,
        setLayoutType,
        handleComponentUpdate,
        formTitle,
        formDescription,
        setFormTitle,
        setFormDescription,
        backgroundColor,
        setBackgroundColor,
        handleFormSubmit,
        handleViewJSON,
        handleImportJSON,
        handleExportJSON,
        handleUndo,
        handleRedo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        saveToHistory,
        setActiveTab: handleSetActiveTab,
        targetSectionId,
      }),
    [
      sections,
      components,
      handleDrop,
      handleDropToTrashBin,
      renderRow,
      layoutType,
      handleComponentUpdate,
      formTitle,
      formDescription,
      backgroundColor,
      handleFormSubmit,
      handleViewJSON,
      handleImportJSON,
      handleExportJSON,
      handleUndo,
      handleRedo,
      historyIndex,
      history.length,
      saveToHistory,
      targetSectionId,
    ]
  );

  // Segmented options for header navigation
  const segmentedOptions = tabItems.map((item) => ({
    label: item.label,
    value: item.key,
  }));

  // Get current tab content
  const currentTabContent = tabItems.find(
    (item) => item.key === activeTab
  )?.children;

  // Main component render - uses Segmented for header navigation
  return (
    <FormBuilderProvider>
      <S.Body>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            right: '50%',
            zIndex: 1000,
            // background: '#ffffff',
            padding: '12px 24px',
            // borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'center',
            // boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
            height: '56px',
            alignItems: 'center',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <Segmented
            options={segmentedOptions}
            value={activeTab}
            onChange={setActiveTab}
            size="small"
            style={{
              background: '#f8f9fa',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '4px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          />
        </div>
        <div style={{ height: '100vh', overflow: 'hidden' }}>
          {currentTabContent}
        </div>

        {/* JSON handling modals - refactored into separate component */}
        <FormDataModals
          jsonModalVisible={jsonModalVisible}
          setJsonModalVisible={setJsonModalVisible}
          importModalVisible={importModalVisible}
          setImportModalVisible={setImportModalVisible}
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          getCurrentSchema={getCurrentSchema}
          handleImportSubmit={handleImportSubmit}
        />
      </S.Body>
    </FormBuilderProvider>
  );
});

// Set display name for debugging
FormBuilderContainer.displayName = 'Container';

export default FormBuilderContainer;
