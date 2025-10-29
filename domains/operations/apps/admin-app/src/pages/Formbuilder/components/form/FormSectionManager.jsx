import React, { useState, useCallback } from "react";
import { Button, Modal, Input, Form, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  CopyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DragOutlined,
  DownOutlined,
  RightOutlined,
  FileTextOutlined,
  PlusOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { DropZone } from "../drag-drop";
import { SelectableSection } from "../properties";
import shortid from "shortid";
import * as S from "../../styles";
import * as FB from "../../styles/components/FormBuilder.styles";
import ViewRenderer from "../views/ViewRenderer";

const FormSectionManager = ({
  sections,
  components,
  onSectionsChange,
  onComponentsChange,
  onDrop,
  onTrashDrop,
  renderRow,
  onSectionUpdate,
  setActiveTab,
}) => {
  const [addSectionModalVisible, setAddSectionModalVisible] = useState(false);
  const [editSectionModalVisible, setEditSectionModalVisible] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");

  const [sectionViews, setSectionViews] = useState({});
  const [form] = Form.useForm();

  // Handle toggling section collapse
  const handleToggleCollapse = useCallback((sectionId) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Handle title editing
  const handleTitleClick = useCallback((sectionId, currentTitle) => {
    setEditingTitleId(sectionId);
    setTempTitle(currentTitle);
  }, []);

  const handleTitleSubmit = useCallback(
    (sectionId) => {
      setEditingTitleId(null);
      if (onSectionUpdate && tempTitle !== "") {
        onSectionUpdate(sectionId, { title: tempTitle });
      }
    },
    [tempTitle, onSectionUpdate]
  );

  const handleTitleKeyPress = useCallback(
    (e, sectionId) => {
      if (e.key === "Enter") {
        handleTitleSubmit(sectionId);
      } else if (e.key === "Escape") {
        setEditingTitleId(null);
        setTempTitle("");
      }
    },
    [handleTitleSubmit]
  );

  // Handle description editing
  const handleDescriptionClick = useCallback(
    (sectionId, currentDescription) => {
      setEditingDescriptionId(sectionId);
      setTempDescription(currentDescription);
    },
    []
  );

  const handleDescriptionSubmit = useCallback(
    (sectionId) => {
      setEditingDescriptionId(null);
      if (onSectionUpdate) {
        onSectionUpdate(sectionId, { description: tempDescription });
      }
    },
    [tempDescription, onSectionUpdate]
  );

  const handleDescriptionKeyPress = useCallback(
    (e, sectionId) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleDescriptionSubmit(sectionId);
      } else if (e.key === "Escape") {
        setEditingDescriptionId(null);
        setTempDescription("");
      }
    },
    [handleDescriptionSubmit]
  );

  // Handle adding a new section
  const handleAddSection = useCallback(
    (values) => {
      const newSection = {
        id: shortid.generate(),
        title: values.title,
        description: values.description || "",
        layout: [],
      };

      const updatedSections = [...sections, newSection];
      onSectionsChange(updatedSections);
      setAddSectionModalVisible(false);
      form.resetFields();
      message.success("Section added successfully!");
    },
    [sections, onSectionsChange, form]
  );

  // Handle copying a section
  const handleCopySection = useCallback(
    (sectionId) => {
      const sectionToCopy = sections.find((s) => s.id === sectionId);
      if (sectionToCopy) {
        const newSection = {
          ...sectionToCopy,
          id: shortid.generate(),
          title: `${sectionToCopy.title} (Copy)`,
        };
        const sectionIndex = sections.findIndex((s) => s.id === sectionId);
        const updatedSections = [...sections];
        updatedSections.splice(sectionIndex + 1, 0, newSection);
        onSectionsChange(updatedSections);
        message.success("Section copied successfully!");
      }
    },
    [sections, onSectionsChange]
  );

  // Handle moving section up
  const handleMoveSectionUp = useCallback(
    (sectionId) => {
      const sectionIndex = sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex > 0) {
        const updatedSections = [...sections];
        [updatedSections[sectionIndex - 1], updatedSections[sectionIndex]] = [
          updatedSections[sectionIndex],
          updatedSections[sectionIndex - 1],
        ];
        onSectionsChange(updatedSections);
        message.success("Section moved up!");
      }
    },
    [sections, onSectionsChange]
  );

  // Handle moving section down
  const handleMoveSectionDown = useCallback(
    (sectionId) => {
      const sectionIndex = sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex < sections.length - 1) {
        const updatedSections = [...sections];
        [updatedSections[sectionIndex], updatedSections[sectionIndex + 1]] = [
          updatedSections[sectionIndex + 1],
          updatedSections[sectionIndex],
        ];
        onSectionsChange(updatedSections);
        message.success("Section moved down!");
      }
    },
    [sections, onSectionsChange]
  );

  // Handle ViewManager - Navigate to Views tab
  const handleViewManagerOpen = useCallback((targetSectionId = null) => {
    if (setActiveTab) {
      setActiveTab('views', { targetSectionId });
    }
  }, [setActiveTab]);



  // Handle view actions
  const handleEditView = useCallback((view) => {
    if (setActiveTab) {
      setActiveTab('views');
    }
    // The Views tab will handle editing
  }, [setActiveTab]);

  const handleDeleteView = useCallback((view) => {
    // Remove view from all sections
    setSectionViews(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(sectionId => {
        updated[sectionId] = updated[sectionId].filter(v => v.id !== view.id);
      });
      return updated;
    });
    message.success(`View "${view.name}" deleted successfully!`);
  }, []);

  const handlePreviewView = useCallback((view) => {
    message.info(`Previewing view: ${view.name}`);
    // Could open a modal or navigate to preview
  }, []);

  // Handle editing a section
  const handleEditSection = useCallback(
    (values) => {
      const updatedSections = sections.map((section) =>
        section.id === editingSectionId
          ? {
              ...section,
              title: values.title,
              description: values.description || "",
            }
          : section
      );
      onSectionsChange(updatedSections);
      setEditSectionModalVisible(false);
      setEditingSectionId(null);
      form.resetFields();
      message.success("Section updated successfully!");
    },
    [sections, editingSectionId, onSectionsChange, form]
  );

  // Handle deleting a section
  const handleDeleteSection = useCallback(
    (sectionId) => {
      const updatedSections = sections.filter(
        (section) => section.id !== sectionId
      );
      onSectionsChange(updatedSections);
      message.success("Section deleted successfully!");
    },
    [sections, onSectionsChange]
  );

  // Open edit modal with current section data
  const openEditModal = useCallback(
    (sectionId) => {
      const section = sections.find((s) => s.id === sectionId);
      if (section) {
        form.setFieldsValue({
          title: section.title,
          description: section.description,
        });
        setEditingSectionId(sectionId);
        setEditSectionModalVisible(true);
      }
    },
    [sections, form]
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Render sections vertically */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {sections.map((section, sectionIndex) => {
          // Handle both old format (array) and new format (object with rows)
          const sectionLayout = Array.isArray(section.layout) 
            ? section.layout 
            : (section.layout && section.layout.rows ? section.layout.rows : []);
          const isCollapsed = collapsedSections.has(section.id);
          const fieldCount = sectionLayout.length;

          return (
            <SelectableSection key={section.id} section={section}>
              <FB.SectionContainer>
                <FB.SectionHeader>
                  <div className="section-info">
                    <div
                      className="section-collapse-btn"
                      onClick={() => handleToggleCollapse(section.id)}
                      title={
                        isCollapsed ? "Expand section" : "Collapse section"
                      }
                    >
                      {isCollapsed ? (
                        <RightOutlined style={{ fontSize: "12px" }} />
                      ) : (
                        <DownOutlined style={{ fontSize: "12px" }} />
                      )}
                    </div>
                    <div className="section-content">
                      {editingTitleId === section.id ? (
                        <input
                          className="section-title-input"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onBlur={() => handleTitleSubmit(section.id)}
                          onKeyPress={(e) => handleTitleKeyPress(e, section.id)}
                          autoFocus
                          placeholder="Untitled Section"
                        />
                      ) : (
                        <h3
                          className="section-title"
                          onClick={() =>
                            handleTitleClick(
                              section.id,
                              section.title || "Untitled Section"
                            )
                          }
                          title="Click to edit"
                        >
                          {section.title || "Untitled Section"}
                        </h3>
                      )}

                      {editingDescriptionId === section.id ? (
                        <textarea
                          className="section-description-input"
                          value={tempDescription}
                          onChange={(e) => setTempDescription(e.target.value)}
                          onBlur={() => handleDescriptionSubmit(section.id)}
                          onKeyPress={(e) =>
                            handleDescriptionKeyPress(e, section.id)
                          }
                          autoFocus
                          placeholder="Start typing and select text or enter '/' for commands"
                          rows={2}
                        />
                      ) : (
                        <p
                          className="section-description"
                          onClick={() =>
                            handleDescriptionClick(
                              section.id,
                              section.description ||
                                "Start typing and select text or enter '/' for commands"
                            )
                          }
                          title="Click to edit"
                        >
                          {section.description ||
                            "Start typing and select text or enter '/' for commands"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="section-meta">
                    <div className="section-field-count">
                      <FileTextOutlined style={{ fontSize: "10px" }} />
                      {fieldCount} {fieldCount === 1 ? "field" : "fields"}
                    </div>
                  </div>

                  <div className="section-actions">
                    <div className="section-action-btn" title="Drag to reorder">
                      <DragOutlined
                        style={{ fontSize: "12px", color: "#9ca3af" }}
                      />
                    </div>
                    <div
                      className="section-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        message.info("Settings functionality coming soon!");
                      }}
                      title="Section settings"
                    >
                      <SettingOutlined style={{ fontSize: "12px" }} />
                    </div>
                    <div
                      className="section-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(section.id);
                      }}
                      title="Edit section"
                    >
                      <EditOutlined style={{ fontSize: "12px" }} />
                    </div>
                    <div
                      className="section-action-btn success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySection(section.id);
                      }}
                      title="Copy section"
                    >
                      <CopyOutlined style={{ fontSize: "12px" }} />
                    </div>
                    <div
                      className={`section-action-btn ${
                        sectionIndex === 0 ? "disabled" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        sectionIndex > 0 && handleMoveSectionUp(section.id);
                      }}
                      title="Move section up"
                      style={{
                        opacity: sectionIndex === 0 ? 0.5 : 1,
                        cursor: sectionIndex === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      <ArrowUpOutlined style={{ fontSize: "12px" }} />
                    </div>
                    <div
                      className={`section-action-btn ${
                        sectionIndex === sections.length - 1 ? "disabled" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        sectionIndex < sections.length - 1 &&
                          handleMoveSectionDown(section.id);
                      }}
                      title="Move section down"
                      style={{
                        opacity: sectionIndex === sections.length - 1 ? 0.5 : 1,
                        cursor:
                          sectionIndex === sections.length - 1
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      <ArrowDownOutlined style={{ fontSize: "12px" }} />
                    </div>
                    <div
                      className="section-action-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section.id);
                      }}
                      title="Delete section"
                    >
                      <DeleteOutlined style={{ fontSize: "12px" }} />
                    </div>
                  </div>
                </FB.SectionHeader>

                {!isCollapsed && (
                  <FB.SectionContent
                    className={
                      sectionLayout.length === 0 ? "empty-section" : ""
                    }
                  >
                    {/* Render views for this section */}
                    {sectionViews[section.id] && sectionViews[section.id].length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        {sectionViews[section.id].map((view) => (
                          <ViewRenderer
                            key={view.id}
                            view={view}
                            data={components}
                            onEdit={() => handleEditView(view)}
                            onDelete={() => handleDeleteView(view)}
                            onPreview={() => handlePreviewView(view)}
                          />
                        ))}
                      </div>
                    )}

                    {sectionLayout.length === 0 ? (
                      <>
                        <DropZone
                          data={{
                            path: `${sectionIndex}-0`,
                            childrenCount: 0,
                          }}
                          onDrop={onDrop}
                          path={`${sectionIndex}-0`}
                          className="empty-section-dropzone"
                        />
                        <div className="empty-icon">📝</div>
                        <p className="empty-text">
                          Drag components here to build your form
                        </p>
                      </>
                    ) : (
                      <S.Page
                        style={{
                          background: "transparent",
                          padding: "0",
                          height: "auto",
                          overflow: "visible",
                        }}
                      >
                        {sectionLayout.map((row, index) => {
                          const currentPath = `${sectionIndex}-${index}`;

                          return (
                            <React.Fragment key={row.id}>
                              <DropZone
                                data={{
                                  path: currentPath,
                                  childrenCount: sectionLayout.length,
                                }}
                                onDrop={onDrop}
                                path={currentPath}
                              />
                              {renderRow(row, currentPath)}
                            </React.Fragment>
                          );
                        })}
                        <DropZone
                          data={{
                            path: `${sectionIndex}-${sectionLayout.length}`,
                            childrenCount: sectionLayout.length,
                          }}
                          onDrop={onDrop}
                          path={`${sectionIndex}-${sectionLayout.length}`}
                        />
                      </S.Page>
                    )}
                  </FB.SectionContent>
                )}

                <FB.ActionButtonsContainer>
                  <Button
                    className="action-button"
                    type="text"
                    onClick={() => setAddSectionModalVisible(true)}
                    icon={<PlusOutlined style={{ fontSize: "12px" }} />}
                  >
                    Add Section
                  </Button>
                  <Button
                    className="action-button"
                    type="text"
                    onClick={() => handleViewManagerOpen(section.id)}
                    icon={<TableOutlined style={{ fontSize: "12px" }} />}
                  >
                    Add View
                  </Button>
                </FB.ActionButtonsContainer>
              </FB.SectionContainer>
            </SelectableSection>
          );
        })}
      </div>

      {/* Add Section Modal */}
      <Modal
        title="Add New Section"
        open={addSectionModalVisible}
        onCancel={() => {
          setAddSectionModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAddSection} layout="vertical">
          <Form.Item
            name="title"
            label="Section Title"
            rules={[{ required: true, message: "Please enter section title" }]}
            initialValue="Untitled Section"
          >
            <Input placeholder="Untitled Section" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Section Description"
            initialValue="Start typing and select text or enter '/' for commands"
          >
            <Input.TextArea
              placeholder="Start typing and select text or enter '/' for commands"
              rows={3}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => {
                setAddSectionModalVisible(false);
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Section
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Section Modal */}
      <Modal
        title="Edit Section"
        open={editSectionModalVisible}
        onCancel={() => {
          setEditSectionModalVisible(false);
          setEditingSectionId(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSection} layout="vertical">
          <Form.Item
            name="title"
            label="Section Title"
            rules={[{ required: true, message: "Please enter section title" }]}
          >
            <Input placeholder="Enter section title" />
          </Form.Item>
          <Form.Item name="description" label="Section Description">
            <Input.TextArea
              placeholder="Enter section description (optional)"
              rows={3}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => {
                setEditSectionModalVisible(false);
                setEditingSectionId(null);
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update Section
            </Button>
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
};

export default FormSectionManager;
