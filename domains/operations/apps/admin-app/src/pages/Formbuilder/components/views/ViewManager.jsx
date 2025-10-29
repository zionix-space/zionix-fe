import React, { useState, useCallback } from "react";
import { message } from "antd";
import ViewSelector from "./ViewSelector";
import { GalleryViewBuilder } from "./GalleryView/GalleryViewBuilder";
import { ListViewBuilder } from "./ListView/ListViewBuilder";
import { SheetViewBuilder } from "./SheetView/SheetViewBuilder";
import { DataTableComponent } from "./DataTableView/DataTableComponent";

const ViewManager = ({ 
  onBack, 
  onViewCreated, 
  formSchema,
  existingViews = [],
  onViewSelect,
  editingView = null,
  selectedViewType = null
}) => {
  const [currentView, setCurrentView] = useState(
    selectedViewType || (editingView ? editingView.type : 'selector')
  ); // 'selector', 'gallery', 'list', 'sheet', 'datatable'
  const [currentEditingView, setCurrentEditingView] = useState(editingView);
  const [builtViews, setBuiltViews] = useState(existingViews);

  // Handle navigation back to selector
  const handleBackToSelector = useCallback(() => {
    setCurrentView('selector');
    setCurrentEditingView(null);
  }, []);

  // Handle creating a new view
  const handleCreateView = useCallback((viewType) => {
    setCurrentView(viewType);
    setCurrentEditingView(null);
  }, []);

  // Handle selecting an existing view
  const handleSelectExistingView = useCallback((view) => {
    if (onViewSelect) {
      onViewSelect(view);
    }
  }, [onViewSelect]);

  // Handle editing an existing view
  const handleEditView = useCallback((view) => {
    setCurrentEditingView(view);
    setCurrentView(view.type);
  }, []);

  // Handle saving a view
  const handleSaveView = useCallback((viewConfig) => {
    const newView = {
      id: currentEditingView?.id || `view-${Date.now()}`,
      name: viewConfig.name || `${currentView} View`,
      type: currentView,
      config: viewConfig,
      description: viewConfig.description || `${currentView} view for ${formSchema.title}`,
      createdAt: currentEditingView?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      formSchemaId: formSchema.id
    };

    let updatedViews;
    if (currentEditingView) {
      // Update existing view
      updatedViews = builtViews.map(view => 
        view.id === currentEditingView.id ? newView : view
      );
      message.success(`${newView.name} updated successfully!`);
    } else {
      // Add new view
      updatedViews = [...builtViews, newView];
      message.success(`${newView.name} created successfully!`);
    }

    setBuiltViews(updatedViews);
    
    // Notify parent component
    if (onViewCreated) {
      onViewCreated(newView, updatedViews);
    }

    // Go back to selector
    handleBackToSelector();
  }, [currentView, currentEditingView, builtViews, onViewCreated, handleBackToSelector, formSchema]);

  // Handle closing view builder
  const handleCloseBuilder = useCallback(() => {
    handleBackToSelector();
  }, [handleBackToSelector]);

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'gallery':
        return (
          <GalleryViewBuilder
            schema={formSchema}
            initialConfig={currentEditingView?.config}
            onSave={handleSaveView}
            onClose={handleCloseBuilder}
            isEditing={!!currentEditingView}
          />
        );
      
      case 'list':
        return (
          <ListViewBuilder
            schema={formSchema}
            initialConfig={currentEditingView?.config}
            onSave={handleSaveView}
            onClose={handleCloseBuilder}
            isEditing={!!currentEditingView}
          />
        );
      
      case 'sheet':
        return (
          <SheetViewBuilder
            schema={formSchema}
            initialConfig={currentEditingView?.config}
            onSave={handleSaveView}
            onClose={handleCloseBuilder}
            isEditing={!!currentEditingView}
          />
        );
      
      case 'datatable':
        return (
          <DataTableComponent
            schema={formSchema}
            initialConfig={currentEditingView?.config}
            onSave={handleSaveView}
            onClose={handleCloseBuilder}
            isEditing={!!currentEditingView}
          />
        );
      
      case 'selector':
      default:
        return (
          <ViewSelector
            onBack={onBack}
            onSelectView={handleSelectExistingView}
            onCreateView={handleCreateView}
            onEditView={handleEditView}
            availableViews={builtViews}
          />
        );
    }
  };

  return renderCurrentView();
};

export default ViewManager;