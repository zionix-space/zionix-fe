import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Button, Spin, Tooltip } from "antd";

import { TrashDropZone } from "../drag-drop";
import FormSectionManager from "../form/FormSectionManager";
import ComponentPaletteSidebar from "../sidebar/ComponentPaletteSidebar";
import { PropertiesPanel } from "../properties";
import FormBuilderHeader from "../header/FormBuilderHeader";
import { useFormBuilder } from "../../contexts/FormBuilderContext";
import * as FB from "../../styles/components/FormBuilder.styles";

/**
 * FormBuilderTab component renders the form builder interface
 * Contains the sidebar, main editing area, and trash drop zone
 */
const FormBuilderTabContent = ({
  sections,
  components,
  setSections,
  setComponents,
  handleDrop,
  handleDropToTrashBin,
  renderRow,
  layoutType,
  setLayoutType,
  formTitle,
  formDescription,
  setFormTitle,
  setFormDescription,
  backgroundColor,
  setBackgroundColor,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  saveToHistory,
  setActiveTab,
}) => {
  const [isLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Local UI state (not shared with preview)
  const [zoom, setZoom] = useState(100);
  const [focusMode, setFocusMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  // Layout is now managed by parent component

  // Undo/Redo functionality is now handled at the app level

  // Get selection state from context
  const { selectedComponent, selectedSection } = useFormBuilder();

  // Handle component property updates
  const handleComponentUpdate = (componentId, updatedProperties) => {
    const newComponents = {
      ...components,
      [componentId]: {
        ...components[componentId],
        ...updatedProperties,
      },
    };
    setComponents(newComponents);
    saveToHistory(sections, newComponents);
  };

  // Handle section property updates
  const handleSectionUpdate = (sectionId, updatedProperties) => {
    const newSections = sections.map((section) =>
      section.id === sectionId ? { ...section, ...updatedProperties } : section
    );
    setSections(newSections);
    saveToHistory(newSections, components);
  };

  // Track changes for unsaved indicator
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [sections, components]);

  // Add a new section handler
  const handleAddSection = useCallback(() => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: "Untitled Section",
      description: "Start typing and select text or enter '/' for commands",
      components: [],
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    saveToHistory(newSections, components);
  }, [sections, setSections, saveToHistory, components]);

  // Header event handlers
  const handleFormTitleChange = useCallback(
    (newTitle) => {
      if (setFormTitle) {
        setFormTitle(newTitle);
      }
      setHasUnsavedChanges(true);
      // Force a re-render to ensure schema updates
      console.log('Form title changed to:', newTitle);
    },
    [setFormTitle]
  );

  const handleFormDescriptionChange = useCallback(
    (newDescription) => {
      if (setFormDescription) {
        setFormDescription(newDescription);
      }
      setHasUnsavedChanges(true);
      // Force a re-render to ensure schema updates
      console.log('Form description changed to:', newDescription);
    },
    [setFormDescription]
  );

  const handleBackgroundColorChange = (newColor) => {
    if (setBackgroundColor) {
      setBackgroundColor(newColor);
    }
    setHasUnsavedChanges(true);
  };

  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  const handleLayoutChange = (newLayout) => {
    if (setLayoutType) {
      setLayoutType(newLayout);
    }
    setHasUnsavedChanges(true);
  };

  // Main render with Lowcode-inspired layout
  return (
    <FB.FormBuilderContainer>
      <div className="form-builder-layout">
        {/* Left Sidebar - Component Palette */}
        <FB.FormBuilderSidebar>
          <div className="sidebar-header">
            <h3 className="sidebar-title">Form Elements</h3>
            <p className="sidebar-subtitle">Drag and drop to add fields</p>
          </div>

          <div className="sidebar-search">
            <ComponentPaletteSidebar />
          </div>
        </FB.FormBuilderSidebar>

        {/* Main Content Area */}
        <FB.FormBuilderContent>
          <div className="canvas-container">
            {/* Canvas Header with Zoom and Layout Controls */}
            <FormBuilderHeader
              formTitle={formTitle}
              formDescription={formDescription}
              sections={sections}
              components={components}
              onFormTitleChange={handleFormTitleChange}
              onFormDescriptionChange={handleFormDescriptionChange}
              onBackgroundColorChange={handleBackgroundColorChange}
              onZoomChange={handleZoomChange}
              onLayoutChange={handleLayoutChange}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              zoom={zoom}
              layout={layoutType}
              backgroundColor={backgroundColor}
            />

            {/* Form Canvas with Lowcode styling */}
            <FB.FormCanvas>
              <div className="form-container">
                {/* Form Content Area */}
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top left",
                    backgroundColor,
                  }}
                >
                  {/* Empty state when no sections */}
                  {sections.length === 0 ? (
                    <FB.EmptyStateContainer>
                      <div className="empty-icon">
                        <FileTextOutlined />
                      </div>
                      <h3 className="empty-title">Start building your form</h3>
                      <p className="empty-description">
                        Create your first section to begin adding form fields
                        and components. You can also drag components directly
                        from the sidebar.
                      </p>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddSection}
                        className="empty-action"
                      >
                        Add Your First Section
                      </Button>
                    </FB.EmptyStateContainer>
                  ) : (
                    /* Section manager handles the main form building area */
                    <FormSectionManager
                      sections={sections}
                      components={components}
                      onSectionsChange={setSections}
                      onComponentsChange={setComponents}
                      onDrop={handleDrop}
                      onTrashDrop={handleDropToTrashBin}
                      renderRow={renderRow}
                      onSectionUpdate={handleSectionUpdate}
                      setActiveTab={setActiveTab}
                    />
                  )}
                </div>
              </div>
            </FB.FormCanvas>
          </div>

          {/* Trash Drop Zone */}
          <TrashDropZone
            data={{
              sections,
            }}
            onDrop={handleDropToTrashBin}
          />
        </FB.FormBuilderContent>

        {/* Right Sidebar - Properties Panel */}
        <FB.PropertiesPanel>
          <PropertiesPanel
            selectedComponent={selectedComponent}
            selectedSection={selectedSection}
            onComponentUpdate={handleComponentUpdate}
          />
        </FB.PropertiesPanel>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <FB.LoadingOverlay>
          <Spin size="large" />
        </FB.LoadingOverlay>
      )}

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && (
        <FB.UnsavedChangesIndicator>Unsaved changes</FB.UnsavedChangesIndicator>
      )}
    </FB.FormBuilderContainer>
  );
};

export default FormBuilderTabContent;
