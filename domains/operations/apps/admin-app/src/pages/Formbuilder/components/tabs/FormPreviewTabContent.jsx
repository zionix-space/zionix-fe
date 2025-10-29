import React, { Suspense, lazy } from "react";
import { Button, Spin } from "antd";
import {
  DownloadOutlined,
  UploadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import * as S from "../../styles";

// Lazy load FormRenderer for better performance
const FormRenderer = lazy(() => import("../../form-renderer"));

/**
 * FormPreviewTab component renders the form preview interface
 * Contains the preview header with action buttons and the form renderer
 */
const FormPreviewTab = ({
  sections,
  components,
  layoutType = 'single',
  formTitle,
  formDescription,
  handleFormSubmit,
  formProps,
  handleViewJSON,
  handleImportJSON,
  handleExportJSON,
}) => {
  return (
    <S.PreviewContainer>
      {/* Preview header with title and action buttons */}
      <S.PreviewHeader>
        <h3>Form Preview</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          {/* View JSON button - opens modal to display current schema */}
          <Button icon={<FileOutlined />} onClick={handleViewJSON}>
            View JSON
          </Button>

          {/* Import JSON button - opens modal to import schema */}
          <Button icon={<UploadOutlined />} onClick={handleImportJSON}>
            Import JSON
          </Button>

          {/* Export JSON button - downloads current schema */}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportJSON}
          >
            Export JSON
          </Button>
        </div>
      </S.PreviewHeader>

      {/* Preview content area with form renderer */}
      <S.PreviewContent>
        {/* Suspense wrapper for lazy-loaded FormRenderer */}
        <Suspense
          fallback={
            <Spin
              size="large"
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "50px",
              }}
            />
          }
        >
          {/* Form renderer displays the actual form based on current schema */}
          <FormRenderer
            sections={sections}
            components={components}
            layoutType={layoutType}
            formTitle={formTitle}
            formDescription={formDescription}
            onSubmit={handleFormSubmit}
            formProps={formProps}
          />
        </Suspense>
      </S.PreviewContent>
    </S.PreviewContainer>
  );
};

export default FormPreviewTab;
