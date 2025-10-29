import React, { useState } from "react";
import {
  FormSchema,
  FormField,
  FormSection,
// } from "../../../../types/formBuilder"; // Removed problematic import
import {
  Button,
  Tabs,
  Radio,
  Select,
  Tooltip,
  Badge,
  Space,
  Tag,
  Segmented,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  TeamOutlined,
  CopyOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  UserAddOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { theme } from "../../../../styles/theme";

const { Option } = Select;

const PermissionContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  background-color: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.gray[200]};
  overflow: hidden;
  min-height: 600px;
  display: flex;
  flex-direction: column;
`;

const PermissionHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background-color: ${theme.colors.background.primary};
`;

const PermissionTitle = styled.h1`
  font-size: ${theme.typography.fontSize["2xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const PermissionDescription = styled.p`
  color: ${theme.colors.gray[600]};
  margin: 0;
`;

const PermissionContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const PermissionMainContent = styled.div`
  flex: 1;
  padding: ${theme.spacing[6]};
  overflow-y: auto;
`;

const PermissionSidebar = styled.div`
  width: 300px;
  padding: ${theme.spacing[6]};
  border-left: 1px solid ${theme.colors.gray[200]};
  background-color: ${theme.colors.background.primary};
  overflow-y: auto;
`;

const PermissionFooter = styled.div`
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.gray[200]};
  background-color: ${theme.colors.gray[50]};
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing[3]};
`;

const FormPreviewContainer = styled.div`
  background-color: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.gray[200]};
  overflow: hidden;
`;

const FormPreviewHeader = styled.div`
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.gray[50]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormPreviewTitle = styled.h3`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[800]};
  margin: 0;
`;

const FormPreviewContent = styled.div`
  padding: ${theme.spacing[4]};
`;

const SectionContainer = styled.div`
  margin-bottom: ${theme.spacing[6]};
  background-color: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.gray[200]};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.gray[50]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[800]};
  margin: 0;
`;

const SectionContent = styled.div`
  padding: ${theme.spacing[4]};
`;

const FieldContainer = styled.div`
  margin-bottom: ${theme.spacing[4]};
  position: relative;
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[2]};
`;

const FieldLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[700]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const FieldPermissionControls = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  background-color: ${theme.colors.background.primary};
  padding: ${theme.spacing[1]};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  z-index: 10;
`;

const FieldInput = styled.div`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.7);
    pointer-events: none;
    z-index: 5;
  }
`;

const QuickHelp = styled.div`
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const QuickHelpTitle = styled.h3`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[800]};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const QuickHelpItem = styled.div`
  margin-bottom: ${theme.spacing[3]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const QuickHelpHeading = styled.h4`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[800]};
  margin: 0 0 ${theme.spacing[1]} 0;
`;

const QuickHelpText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const ReadMoreLink = styled.a`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.primary[600]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  &:hover {
    color: ${theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

const RoleSelector = styled.div`
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const RoleLabel = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray[700]};
`;

export function PermissionLayout({ schema }) {
  const [activeTab, setActiveTab] = useState("field");
  const [selectedRole, setSelectedRole] = useState("admin");

  const roles = [
    { id: "admin", name: "Admin", description: "Full access to all features" },
    {
      id: "manager",
      name: "Manager",
      description: "Can approve and edit submissions",
    },
    {
      id: "employee",
      name: "Employee",
      description: "Can create and view submissions",
    },
    { id: "guest", name: "Guest", description: "Limited view-only access" },
  ];

  const permissionTypes = [
    { id: "editable", name: "Editable", icon: <EditOutlined /> },
    { id: "readonly", name: "Read-only", icon: <EyeOutlined /> },
    { id: "hidden", name: "Hidden", icon: <EyeInvisibleOutlined /> },
  ];

  // Render a field with permission controls
  const renderField = (field) => {
    return (
      <FieldContainer key={field.id}>
        <FieldHeader>
          <FieldLabel>
            {field.label}
            {field.required && (
              <span style={{ color: theme.colors.error[500] }}>*</span>
            )}
          </FieldLabel>
        </FieldHeader>

        <FieldPermissionControls>
          <Radio.Group defaultValue="editable" size="small" buttonStyle="solid">
            <Tooltip title="Editable">
              <Radio.Button value="editable">
                <EditOutlined />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Read-only">
              <Radio.Button value="readonly">
                <EyeOutlined />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Hidden">
              <Radio.Button value="hidden">
                <EyeInvisibleOutlined />
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
        </FieldPermissionControls>

        <FieldInput>{renderFieldInput(field)}</FieldInput>
      </FieldContainer>
    );
  };

  // Render appropriate input for each field type
  const renderFieldInput = (field) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={field.placeholder || "Text input"}
            className="ant-input"
            style={{ width: "100%" }}
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder || "Text area"}
            className="ant-input"
            style={{ width: "100%", height: "80px" }}
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder || "0"}
            className="ant-input"
            style={{ width: "100%" }}
          />
        );

      case "date":
        return (
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            className="ant-input"
            style={{ width: "100%" }}
          />
        );

      case "dropdown":
        return (
          <select
            className="ant-select-selector"
            style={{ width: "100%", height: "32px", padding: "0 11px" }}
          >
            <option>Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" />
            <span>{field.label}</span>
          </div>
        );

      case "email":
        return (
          <input
            type="email"
            placeholder={field.placeholder || "Email address"}
            className="ant-input"
            style={{ width: "100%" }}
          />
        );

      case "table":
        return (
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
              padding: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #d9d9d9",
                padding: "4px 0",
              }}
            >
              {field.columns?.map((col, index) => (
                <div
                  key={index}
                  style={{ flex: 1, padding: "4px 8px", fontWeight: 500 }}
                >
                  {col.label}
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 0" }}>
              <div style={{ color: "#8c8c8c", textAlign: "center" }}>
                Data table content
              </div>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            placeholder="Field input"
            className="ant-input"
            style={{ width: "100%" }}
          />
        );
    }
  };

  // Render a section with all its fields
  const renderSection = (section) => {
    return (
      <SectionContainer key={section.id}>
        <SectionHeader>
          <SectionTitle>{section.title}</SectionTitle>
          <Radio.Group defaultValue="editable" size="small" buttonStyle="solid">
            <Tooltip title="All Editable">
              <Radio.Button value="editable">
                <EditOutlined />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="All Read-only">
              <Radio.Button value="readonly">
                <EyeOutlined />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="All Hidden">
              <Radio.Button value="hidden">
                <EyeInvisibleOutlined />
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
        </SectionHeader>

        <SectionContent>
          {section.description && (
            <p
              style={{
                color: theme.colors.gray[600],
                marginBottom: theme.spacing[4],
              }}
            >
              {section.description}
            </p>
          )}

          {section.fields.map((field) => renderField(field))}
        </SectionContent>
      </SectionContainer>
    );
  };

  const tabItems = [
    {
      key: "field",
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: "8px" }} />
          Field Permissions
        </span>
      ),
      children: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing[4],
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.semibold,
                  margin: 0,
                }}
              >
                Field Permissions
              </h2>
              <p style={{ color: theme.colors.gray[600], margin: 0 }}>
                Configure who can view, edit, or access specific fields in your
                form.
              </p>
            </div>

            <RoleSelector>
              <RoleLabel>Configure permissions for:</RoleLabel>
              <Select
                value={selectedRole}
                onChange={setSelectedRole}
                style={{ width: 200 }}
              >
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    <Space>
                      <TeamOutlined />
                      {role.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </RoleSelector>
          </div>

          <FormPreviewContainer>
            <FormPreviewHeader>
              <FormPreviewTitle>
                <Space>
                  <FileTextOutlined />
                  {schema.title}
                </Space>
              </FormPreviewTitle>
              <Space>
                <Button size="small" icon={<CopyOutlined />}>
                  Copy from
                </Button>
                <Select defaultValue="all" style={{ width: 120 }} size="small">
                  <Option value="all">All fields</Option>
                  <Option value="required">Required fields</Option>
                  <Option value="optional">Optional fields</Option>
                </Select>
              </Space>
            </FormPreviewHeader>

            <FormPreviewContent>
              {(() => {
                if (schema.sections) {
                  // Old format with sections
                  return schema.sections.map((section) => renderSection(section));
                } else if (schema.components) {
                  // New format with components - create a virtual section
                  const virtualSection = {
                    id: 'form-fields',
                    title: 'Form Fields',
                    fields: Object.values(schema.components)
                  };
                  return renderSection(virtualSection);
                }
                return null;
              })()}
            </FormPreviewContent>
          </FormPreviewContainer>
        </>
      ),
    },
    {
      key: "action",
      label: (
        <span>
          <ThunderboltOutlined style={{ marginRight: "8px" }} />
          Action Permissions
        </span>
      ),
      children: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing[4],
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.semibold,
                  margin: 0,
                }}
              >
                Action Permissions
              </h2>
              <p style={{ color: theme.colors.gray[600], margin: 0 }}>
                Configure which roles can perform specific actions on this form.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: theme.spacing[4],
            }}
          >
            {[
              "create",
              "view",
              "edit",
              "delete",
              "approve",
              "reject",
              "export",
              "import",
            ].map((action) => (
              <div
                key={action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: theme.spacing[3],
                  border: `1px solid ${theme.colors.gray[200]}`,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.background.primary,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.gray[800],
                    }}
                  >
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.gray[500],
                    }}
                  >
                    {`Can ${action} form data`}
                  </div>
                </div>
                <Select defaultValue="all" style={{ width: 150 }} size="small">
                  <Option value="all">All roles</Option>
                  <Option value="admin">Admin only</Option>
                  <Option value="manager">Manager+</Option>
                  <Option value="custom">Custom...</Option>
                </Select>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      key: "role",
      label: (
        <span>
          <TeamOutlined style={{ marginRight: "8px" }} />
          Role Management
        </span>
      ),
      children: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing[4],
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.semibold,
                  margin: 0,
                }}
              >
                Role Management
              </h2>
              <p style={{ color: theme.colors.gray[600], margin: 0 }}>
                Manage roles and their permissions for this form.
              </p>
            </div>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Role
            </Button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: theme.colors.gray[50] }}>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    borderBottom: `1px solid ${theme.colors.gray[200]}`,
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    borderBottom: `1px solid ${theme.colors.gray[200]}`,
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    borderBottom: `1px solid ${theme.colors.gray[200]}`,
                  }}
                >
                  Users
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    borderBottom: `1px solid ${theme.colors.gray[200]}`,
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  style={{
                    borderBottom: `1px solid ${theme.colors.gray[200]}`,
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <Space>
                      <TeamOutlined />
                      {role.name}
                      {role.id === "admin" && <Tag color="blue">Default</Tag>}
                    </Space>
                  </td>
                  <td style={{ padding: "12px 16px" }}>{role.description}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Button size="small" icon={<UserAddOutlined />}>
                      Assign Users
                    </Button>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Space>
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        disabled={role.id === "admin"}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        disabled={role.id === "admin"}
                      />
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ),
    },
  ];

  return (
    <PermissionContainer>
      <PermissionHeader>
        <PermissionTitle>{schema.title} - Permissions</PermissionTitle>
        <PermissionDescription>
          Configure who can access and modify this form and its fields
        </PermissionDescription>
      </PermissionHeader>

      <PermissionContent>
        <PermissionMainContent>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            style={{ height: "100%" }}
          />
        </PermissionMainContent>

        <PermissionSidebar>
          <QuickHelp>
            <QuickHelpTitle>Quick help</QuickHelpTitle>

            <QuickHelpItem>
              <QuickHelpHeading>Configuring field permissions</QuickHelpHeading>
              <QuickHelpText>
                Customize the form based on the sections and fields along with
                their visibility applicable for each step in the process here.
              </QuickHelpText>
              <ReadMoreLink href="#">
                Read more
                <LinkOutlined />
              </ReadMoreLink>
            </QuickHelpItem>

            <QuickHelpItem>
              <QuickHelpHeading>
                Configuring actions for a step
              </QuickHelpHeading>
              <QuickHelpText>
                Configure actions for every step in your process and manage
                their visibility here.
              </QuickHelpText>
              <ReadMoreLink href="#">
                Read more
                <LinkOutlined />
              </ReadMoreLink>
            </QuickHelpItem>
          </QuickHelp>
        </PermissionSidebar>
      </PermissionContent>

      <PermissionFooter>
        <Button>Cancel</Button>
        <Button type="primary">Save Changes</Button>
      </PermissionFooter>
    </PermissionContainer>
  );
}
