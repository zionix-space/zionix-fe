import React from "react";
import FormBuilderTabContent from "./FormBuilderTabContent";
import FormPreviewTabContent from "./FormPreviewTabContent";
import ViewManagementTabContent from "../views/ViewManagementTabContent";

/**
 * TabConfiguration component provides the configuration for main application tabs
 * Returns tab items for the builder and preview modes
 */
export const createTabItems = ({
  sections,
  components,
  setSections,
  setComponents,
  handleDrop,
  handleDropToTrashBin,
  renderRow,
  layoutType = "single",
  setLayoutType,
  formTitle,
  formDescription,
  setFormTitle,
  setFormDescription,
  backgroundColor,
  setBackgroundColor,
  handleFormSubmit,
  formProps,
  handleViewJSON,
  handleImportJSON,
  handleExportJSON,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  saveToHistory,
  setActiveTab,
  targetSectionId,
}) => {
  return [
    {
      key: "form",
      label: "Form",
      children: (
        <FormBuilderTabContent
          sections={sections}
          components={components}
          setSections={setSections}
          setComponents={setComponents}
          handleDrop={handleDrop}
          handleDropToTrashBin={handleDropToTrashBin}
          renderRow={renderRow}
          layoutType={layoutType}
          setLayoutType={setLayoutType}
          formTitle={formTitle}
          formDescription={formDescription}
          setFormTitle={setFormTitle}
          setFormDescription={setFormDescription}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          saveToHistory={saveToHistory}
          setActiveTab={setActiveTab}
        />
      ),
    },

    {
      key: "preview",
      label: "Preview",
      children: (
        <FormPreviewTabContent
          sections={sections}
          components={components}
          layoutType={layoutType}
          formTitle={formTitle}
          formDescription={formDescription}
          handleFormSubmit={handleFormSubmit}
          formProps={formProps}
          handleViewJSON={handleViewJSON}
          handleImportJSON={handleImportJSON}
          handleExportJSON={handleExportJSON}
        />
      ),
    },
    {
      key: "views",
      label: "Views",
      children: (
        <ViewManagementTabContent
          sections={sections}
          components={components}
          setSections={setSections}
          setComponents={setComponents}
          saveToHistory={saveToHistory}
          targetSectionId={targetSectionId}
        />
      ),
    },
    {
      key: "permission",
      label: "Permission",
      children: (
        <div style={{ padding: "24px", textAlign: "center", color: "#666" }}>
          <h3>Permission Settings</h3>
          <p>Permission management functionality will be implemented here.</p>
        </div>
      ),
    },
  ];
};
