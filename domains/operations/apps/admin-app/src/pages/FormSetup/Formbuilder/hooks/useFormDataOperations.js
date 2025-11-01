import { useCallback, useState } from "react";
import { message } from "antd";
import { validateFormSchema, sanitizeSchemaForStorage } from "../utils";

/**
 * Custom hook that provides JSON operations for the form builder
 * Handles export, import, and view functionality for form schemas
 */
export const useFormDataOperations = (
  sections,
  setSections,
  components,
  setComponents,
  currentFormSchema
) => {
  // Modal visibility states
  const [jsonModalVisible, setJsonModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  /**
   * Handle form submission - logs form data to console
   */
  const handleFormSubmit = useCallback((formData) => {
    console.log("Form submitted with data:", formData);
    message.success("Form submitted successfully! Check console for data.");
  }, []);

  /**
   * Handle JSON export - downloads current schema as JSON file
   */
  const handleExportJSON = useCallback(() => {
    try {
      const jsonString = JSON.stringify(currentFormSchema, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `form-schema-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success({
        content: (
          <div>
            <strong>✅ Export successful!</strong>
            <br />
            <small>Form schema has been downloaded as JSON file.</small>
          </div>
        ),
        duration: 3,
      });
    } catch (error) {
      message.error(`Export failed: ${error.message}`);
    }
  }, [currentFormSchema]);

  /**
   * Handle opening JSON view modal
   */
  const handleViewJSON = useCallback(() => {
    setJsonModalVisible(true);
  }, []);

  /**
   * Handle opening JSON import modal
   */
  const handleImportJSON = useCallback(() => {
    setImportModalVisible(true);
  }, []);

  /**
   * Handle JSON import submission with validation
   */
  const handleImportSubmit = useCallback(() => {
    if (!jsonInput.trim()) {
      message.error("Please enter a JSON schema to import.");
      return;
    }

    try {
      // Parse and validate JSON
      const parsedSchema = JSON.parse(jsonInput);
      const validation = validateFormSchema(parsedSchema);

      // Handle validation errors
      if (!validation.isValid) {
        message.error({
          content: (
            <div>
              <strong>❌ Schema Validation Failed:</strong>
              <ul style={{ marginTop: "8px", marginBottom: 0 }}>
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <div
                style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}
              >
                Please fix these issues and try again.
              </div>
            </div>
          ),
          duration: 10,
        });
        return;
      }

      // Show warnings if any
      if (validation.warnings && validation.warnings.length > 0) {
        message.warning({
          content: (
            <div>
              <strong>⚠️ Schema Import Warnings:</strong>
              <ul style={{ marginTop: "8px", marginBottom: 0 }}>
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
              <div
                style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}
              >
                Import will proceed despite warnings.
              </div>
            </div>
          ),
          duration: 8,
        });
      }

      // Sanitize imported schema
      const sanitizedSchema = sanitizeSchemaForStorage(parsedSchema);

      // Handle both old 'sections' and new 'layout' field names for backward compatibility
      const sectionsData = sanitizedSchema.layout || sanitizedSchema.sections || [];
      setSections(sectionsData);
      setComponents(sanitizedSchema.components);
      setImportModalVisible(false);
      setJsonInput("");

      message.success({
        content: (
          <div>
            <strong>✅ Form schema imported successfully!</strong>
            <br />
            <small>
              Schema validated and ready for use.
              {validation.warnings.length === 0
                ? " No issues found."
                : ` ${validation.warnings.length} warnings noted.`}
            </small>
          </div>
        ),
        duration: 5,
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        message.error({
          content: (
            <div>
              <strong>JSON Parse Error:</strong>
              <br />
              {error.message}
              <br />
              <small>Please check your JSON syntax and try again.</small>
            </div>
          ),
          duration: 8,
        });
      } else {
        message.error(`Import failed: ${error.message}`);
      }
    }
  }, [jsonInput, setSections, setComponents]);

  /**
   * Get current schema for display
   */
  const getCurrentSchema = useCallback(() => {
    console.log('getCurrentSchema called, returning:', {
      title: currentFormSchema?.metadata?.title,
      description: currentFormSchema?.metadata?.description,
      sectionsLength: currentFormSchema?.layout?.length,
      componentsCount: Object.keys(currentFormSchema?.components || {}).length
    });
    return currentFormSchema;
  }, [currentFormSchema]);

  return {
    // Modal states
    jsonModalVisible,
    setJsonModalVisible,
    importModalVisible,
    setImportModalVisible,
    jsonInput,
    setJsonInput,
    
    // Handlers
    handleFormSubmit,
    handleExportJSON,
    handleViewJSON,
    handleImportJSON,
    handleImportSubmit,
    getCurrentSchema,
  };
};