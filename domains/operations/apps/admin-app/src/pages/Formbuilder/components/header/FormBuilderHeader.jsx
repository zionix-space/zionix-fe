import React, { useState, useCallback } from "react";
import { Button, Select, Tooltip, Popover } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  BgColorsOutlined,
  LayoutOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  CheckSquareOutlined,
  ArrowRightOutlined,
  DownOutlined,
  TableOutlined,
  DashboardOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  BorderOutlined,
  SplitCellsOutlined,
} from "@ant-design/icons";
import * as FB from "../../styles/components/FormBuilder.styles";

const { Option } = Select;

const FormBuilderHeader = ({
  formTitle = "New Form",
  formDescription = "Create your form by adding fields from the library",
  sections = [],
  components = {},
  onFormTitleChange,
  onFormDescriptionChange,
  onBackgroundColorChange,
  onZoomChange,
  onLayoutChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  zoom = 100,
  layout = "single",
  backgroundColor = "#f8f9fa",
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(formTitle);
  const [tempDescription, setTempDescription] = useState(formDescription);

  // Calculate statistics
  const totalSections = sections.length;
  const totalFields = sections.reduce((count, section) => {
    return count + (section.layout ? section.layout.length : 0);
  }, 0);
  const requiredFields = 0; // This would need to be calculated based on field properties

  // Handle title editing
  const handleTitleClick = useCallback(() => {
    setIsEditingTitle(true);
    setTempTitle(formTitle);
  }, [formTitle]);

  const handleTitleSubmit = useCallback(() => {
    setIsEditingTitle(false);
    if (onFormTitleChange && tempTitle !== formTitle) {
      onFormTitleChange(tempTitle);
    }
  }, [tempTitle, formTitle, onFormTitleChange]);

  const handleTitleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleTitleSubmit();
      } else if (e.key === "Escape") {
        setIsEditingTitle(false);
        setTempTitle(formTitle);
      }
    },
    [handleTitleSubmit, formTitle]
  );

  // Handle description editing
  const handleDescriptionClick = useCallback(() => {
    setIsEditingDescription(true);
    setTempDescription(formDescription);
  }, [formDescription]);

  const handleDescriptionSubmit = useCallback(() => {
    setIsEditingDescription(false);
    if (onFormDescriptionChange && tempDescription !== formDescription) {
      onFormDescriptionChange(tempDescription);
    }
  }, [tempDescription, formDescription, onFormDescriptionChange]);

  const handleDescriptionKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleDescriptionSubmit();
      } else if (e.key === "Escape") {
        setIsEditingDescription(false);
        setTempDescription(formDescription);
      }
    },
    [handleDescriptionSubmit, formDescription]
  );

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 10, 200);
    if (onZoomChange) onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 10, 50);
    if (onZoomChange) onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  const handleZoomReset = useCallback(() => {
    if (onZoomChange) onZoomChange(100);
  }, [onZoomChange]);

  // Color picker content
  const colorPickerContent = (
    <div style={{ padding: "8px" }}>
      <div style={{ marginBottom: "8px", fontSize: "12px", fontWeight: "500" }}>
        Background Color
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "4px",
        }}
      >
        {[
          "#f8f9fa",
          "#ffffff",
          "#f3f4f6",
          "#fef3c7",
          "#fecaca",
          "#fed7d7",
          "#e0f2fe",
          "#e1f5fe",
          "#e8f5e8",
          "#f3e8ff",
          "#fdf4ff",
          "#fff7ed",
        ].map((color) => (
          <div
            key={color}
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: color,
              border:
                backgroundColor === color
                  ? "2px solid #3b82f6"
                  : "1px solid #e5e7eb",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() =>
              onBackgroundColorChange && onBackgroundColorChange(color)
            }
          />
        ))}
      </div>
    </div>
  );

  return (
    <FB.FormBuilderToolbar>
      {/* Control Toolbar */}
      <FB.FormControlToolbar>
        <div className="toolbar-left">
          {/* Form Statistics */}
          <FB.FormStats>
            <div className="stat-item">
              <AppstoreOutlined className="stat-icon" />
              <span className="stat-value">{totalSections}</span>
              <span>Sections</span>
            </div>
            <div className="stat-item">
              <FileTextOutlined className="stat-icon" />
              <span className="stat-value">{totalFields}</span>
              <span>Fields</span>
            </div>
            <div className="stat-item">
              <CheckSquareOutlined className="stat-icon" />
              <span className="stat-value">{requiredFields}</span>
              <span>Required</span>
            </div>
          </FB.FormStats>
        </div>

        <div className="toolbar-center">
          {/* Zoom Controls */}
          <FB.ZoomControls>
            <Tooltip title="Zoom Out">
              <button
                className="zoom-button"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOutOutlined style={{ fontSize: "12px" }} />
              </button>
            </Tooltip>
            <div
              className="zoom-display"
              onClick={handleZoomReset}
              style={{ cursor: "pointer" }}
            >
              {zoom}%
            </div>
            <Tooltip title="Zoom In">
              <button
                className="zoom-button"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomInOutlined style={{ fontSize: "12px" }} />
              </button>
            </Tooltip>
          </FB.ZoomControls>

          {/* Layout Options */}
          <FB.LayoutOptions>
            <Select
              className="layout-selector"
              value={layout}
              onChange={onLayoutChange}
              suffixIcon={<LayoutOutlined style={{ fontSize: "12px" }} />}
              placeholder="Select Layout"
            >
              <Option value="single">
                <FileTextOutlined style={{ marginRight: "6px" }} />
                Single Page
              </Option>
              <Option value="step">
                <ArrowRightOutlined style={{ marginRight: "6px" }} />
                Step Form
              </Option>
              <Option value="accordion">
                <DownOutlined style={{ marginRight: "6px" }} />
                Accordion
              </Option>
              <Option value="tabbed">
                <TableOutlined style={{ marginRight: "6px" }} />
                Tabbed Layout
              </Option>
              <Option value="dashboard">
                <DashboardOutlined style={{ marginRight: "6px" }} />
                Dashboard
              </Option>
              <Option value="kanban">
                <ProjectOutlined style={{ marginRight: "6px" }} />
                Kanban Board
              </Option>
              <Option value="timeline">
                <ClockCircleOutlined style={{ marginRight: "6px" }} />
                Timeline
              </Option>
              <Option value="matrix">
                <BorderOutlined style={{ marginRight: "6px" }} />
                Matrix Layout
              </Option>
              <Option value="split-screen">
                <SplitCellsOutlined style={{ marginRight: "6px" }} />
                Split Screen
              </Option>
            </Select>
          </FB.LayoutOptions>
        </div>

        <div className="toolbar-right">
          {/* Undo/Redo Controls */}
          <FB.UndoRedoControls>
            <Tooltip title="Undo">
              <button
                className="undo-redo-button"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <UndoOutlined style={{ fontSize: "12px" }} />
              </button>
            </Tooltip>
            <Tooltip title="Redo">
              <button
                className="undo-redo-button"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <RedoOutlined style={{ fontSize: "12px" }} />
              </button>
            </Tooltip>
          </FB.UndoRedoControls>

          {/* Background Color Picker */}
          <FB.BackgroundColorPicker>
            <Popover
              content={colorPickerContent}
              title={null}
              trigger="click"
              placement="bottomRight"
            >
              <Tooltip title="Background Color">
                <div className="color-picker-trigger">
                  <div className="color-preview" style={{ backgroundColor }} />
                  <BgColorsOutlined
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      color:
                        backgroundColor === "#ffffff" ? "#374151" : "#ffffff",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  />
                </div>
              </Tooltip>
            </Popover>
          </FB.BackgroundColorPicker>
        </div>
      </FB.FormControlToolbar>

      {/* Form Header with Title and Description */}
      <FB.FormHeader>
        {isEditingTitle ? (
          <input
            className="form-title"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyPress}
            autoFocus
            placeholder="Enter form title..."
          />
        ) : (
          <div
            className="form-title"
            onClick={handleTitleClick}
            style={{ cursor: "text" }}
          >
            {formTitle}
          </div>
        )}

        {isEditingDescription ? (
          <textarea
            className="form-description"
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            onBlur={handleDescriptionSubmit}
            onKeyDown={handleDescriptionKeyPress}
            autoFocus
            placeholder="Enter form description..."
          />
        ) : (
          <div
            className="form-description"
            onClick={handleDescriptionClick}
            style={{ cursor: "text" }}
          >
            {formDescription}
          </div>
        )}
      </FB.FormHeader>
    </FB.FormBuilderToolbar>
  );
};

export default FormBuilderHeader;
