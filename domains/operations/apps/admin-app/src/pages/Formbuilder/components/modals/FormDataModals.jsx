import React from "react";
import { Button, Modal, Input, message } from "antd";

/**
 * FormDataModals component handles the JSON view and import modals
 * Provides functionality to view, copy, and import form schemas
 */
const FormDataModals = ({
  jsonModalVisible,
  setJsonModalVisible,
  importModalVisible,
  setImportModalVisible,
  jsonInput,
  setJsonInput,
  getCurrentSchema,
  handleImportSubmit,
}) => {
  /**
   * Handle copying JSON schema to clipboard
   */
  const handleCopyToClipboard = () => {
    const schema = getCurrentSchema();
    console.log('Copying schema to clipboard:', {
      title: schema?.metadata?.title,
      description: schema?.metadata?.description
    });
    navigator.clipboard.writeText(
      JSON.stringify(schema, null, 2)
    );
    message.success("JSON copied to clipboard!");
  };

  return (
    <>
      {/* JSON View Modal - Display current form schema */}
      <Modal
        title="Form JSON Schema"
        open={jsonModalVisible}
        onCancel={() => setJsonModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setJsonModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="copy"
            type="primary"
            onClick={handleCopyToClipboard}
          >
            Copy to Clipboard
          </Button>,
        ]}
        width={800}
      >
        {/* Read-only textarea displaying formatted JSON */}
        <Input.TextArea
          value={(() => {
            const schema = getCurrentSchema();
            console.log('Rendering JSON in modal:', {
              title: schema?.metadata?.title,
              description: schema?.metadata?.description,
              timestamp: new Date().toISOString()
            });
            return JSON.stringify(schema, null, 2);
          })()}
          rows={20}
          readOnly
          style={{ fontFamily: "monospace", fontSize: "12px" }}
        />
      </Modal>

      {/* JSON Import Modal - Import form schema from JSON */}
      <Modal
        title="Import Form Schema"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onOk={handleImportSubmit}
        okText="Import"
        width={800}
      >
        <p>Paste your form JSON schema below:</p>
        {/* Editable textarea for JSON input */}
        <Input.TextArea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste JSON schema here..."
          rows={15}
          style={{ fontFamily: "monospace", fontSize: "12px" }}
        />
      </Modal>
    </>
  );
};

export default FormDataModals;