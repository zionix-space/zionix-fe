import React from "react";
import {
  Switch,
  InputNumber,
  Select,
  Card,
  Space,
  Typography,
  Divider,
} from "antd";
import styled from "styled-components";
// import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Text } = Typography;
const { Option } = Select;

const SettingsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const SettingGroup = styled.div`
  margin-bottom: 16px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

/**
 * LowCode-Style List View Settings
 * Comprehensive configuration options for list behavior and appearance
 */
export function ListViewSettings({
  config,
  onConfigChange,
}) {
  const updateSettings = (updates) => {
    onConfigChange({
      ...config,
      settings: { ...config.settings, ...updates },
    });
  };

  const updatePagination = (updates) => {
    onConfigChange({
      ...config,
      pagination: { ...config.pagination, ...updates },
    });
  };

  const updatePermissions = (updates) => {
    onConfigChange({
      ...config,
      permissions: { ...config.permissions, ...updates },
    });
  };

  return (
    <SettingsContainer>
      {/* Display Settings */}
      <SettingGroup>
        <Card size="small" title="Display Settings">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <div>
                <Text>Show Row Numbers</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Display row numbers in the first column
                </Text>
              </div>
              <Switch
                checked={config.settings.showRowNumbers}
                onChange={(checked) =>
                  updateSettings({ showRowNumbers: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Enable Search</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Show global search functionality
                </Text>
              </div>
              <Switch
                checked={config.settings.enableSearch}
                onChange={(checked) =>
                  updateSettings({ enableSearch: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Allow Bulk Actions</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Enable row selection and bulk operations
                </Text>
              </div>
              <Switch
                checked={config.settings.allowBulkActions}
                onChange={(checked) =>
                  updateSettings({ allowBulkActions: checked })
                }
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Pagination Settings */}
      <SettingGroup>
        <Card size="small" title="Pagination Settings">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Page Size</Text>
              <Select
                value={config.pagination.pageSize}
                onChange={(value) => updatePagination({ pageSize: value })}
                style={{ width: 100 }}
              >
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
              </Select>
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Show Size Changer</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Allow users to change page size
                </Text>
              </div>
              <Switch
                checked={config.pagination.showSizeChanger}
                onChange={(checked) =>
                  updatePagination({ showSizeChanger: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Show Quick Jumper</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Allow users to jump to specific pages
                </Text>
              </div>
              <Switch
                checked={config.pagination.showQuickJumper}
                onChange={(checked) =>
                  updatePagination({ showQuickJumper: checked })
                }
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Auto Refresh Settings */}
      <SettingGroup>
        <Card size="small" title="Auto Refresh">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <div>
                <Text>Enable Auto Refresh</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Automatically refresh data at intervals
                </Text>
              </div>
              <Switch
                checked={config.settings.autoRefresh}
                onChange={(checked) => updateSettings({ autoRefresh: checked })}
              />
            </SettingItem>

            {config.settings.autoRefresh && (
              <SettingItem>
                <Text>Refresh Interval (seconds)</Text>
                <InputNumber
                  min={10}
                  max={300}
                  value={config.settings.refreshInterval}
                  onChange={(value) =>
                    updateSettings({ refreshInterval: value })
                  }
                  style={{ width: 100 }}
                />
              </SettingItem>
            )}
          </Space>
        </Card>
      </SettingGroup>

      {/* Permissions */}
      <SettingGroup>
        <Card size="small" title="Permissions">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Can View Records</Text>
              <Switch
                checked={config.permissions.canView}
                onChange={(checked) => updatePermissions({ canView: checked })}
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Edit Records</Text>
              <Switch
                checked={config.permissions.canEdit}
                onChange={(checked) => updatePermissions({ canEdit: checked })}
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Delete Records</Text>
              <Switch
                checked={config.permissions.canDelete}
                onChange={(checked) =>
                  updatePermissions({ canDelete: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Export Data</Text>
              <Switch
                checked={config.permissions.canExport}
                onChange={(checked) =>
                  updatePermissions({ canExport: checked })
                }
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Advanced Settings */}
      <SettingGroup>
        <Card size="small" title="Advanced Settings">
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>Default Sort</Text>
              <div style={{ marginTop: "8px" }}>
                <Space>
                  <Select
                    placeholder="Select field"
                    style={{ width: 150 }}
                    allowClear
                  >
                    <Option value="created_at">Created Date</Option>
                    <Option value="updated_at">Updated Date</Option>
                    <Option value="status">Status</Option>
                  </Select>
                  <Select
                    placeholder="Order"
                    style={{ width: 100 }}
                    defaultValue="desc"
                  >
                    <Option value="asc">Ascending</Option>
                    <Option value="desc">Descending</Option>
                  </Select>
                </Space>
              </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div>
              <Text strong>Export Settings</Text>
              <div style={{ marginTop: "8px" }}>
                <Space direction="vertical">
                  <Text style={{ fontSize: "12px" }}>Available formats:</Text>
                  <Space>
                    <Switch size="small" defaultChecked />{" "}
                    <Text style={{ fontSize: "12px" }}>CSV</Text>
                    <Switch size="small" defaultChecked />{" "}
                    <Text style={{ fontSize: "12px" }}>Excel</Text>
                    <Switch size="small" />{" "}
                    <Text style={{ fontSize: "12px" }}>PDF</Text>
                  </Space>
                </Space>
              </div>
            </div>
          </Space>
        </Card>
      </SettingGroup>
    </SettingsContainer>
  );
}