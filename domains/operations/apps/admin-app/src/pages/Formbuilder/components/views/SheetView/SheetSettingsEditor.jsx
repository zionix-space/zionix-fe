import React from "react";
// import { SheetViewConfig } from "../../../../types/sheetView"; // Removed problematic import
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
 * LowCode-Style Sheet Settings Editor
 * Comprehensive configuration options for spreadsheet behavior and appearance
 */
export function SheetSettingsEditor({
  config,
  onConfigChange,
}) {
  const updateSettings = (updates) => {
    onConfigChange({
      ...config,
      settings: { ...config.settings, ...updates },
    });
  };

  const updatePermissions = (updates) => {
    onConfigChange({
      ...config,
      permissions: { ...config.permissions, ...updates },
    });
  };

  const updateFormatting = (updates) => {
    onConfigChange({
      ...config,
      formatting: { ...config.formatting, ...updates },
    });
  };

  return (
    <SettingsContainer>
      {/* Sheet Behavior */}
      <SettingGroup>
        <Card size="small" title="Sheet Behavior">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <div>
                <Text>Allow Adding Rows</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Users can add new rows to the sheet
                </Text>
              </div>
              <Switch
                checked={config.settings.allowAddRows}
                onChange={(checked) =>
                  updateSettings({ allowAddRows: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Allow Deleting Rows</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Users can delete existing rows
                </Text>
              </div>
              <Switch
                checked={config.settings.allowDeleteRows}
                onChange={(checked) =>
                  updateSettings({ allowDeleteRows: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Allow Adding Columns</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Users can add new columns
                </Text>
              </div>
              <Switch
                checked={config.settings.allowAddColumns}
                onChange={(checked) =>
                  updateSettings({ allowAddColumns: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Allow Deleting Columns</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Users can delete existing columns
                </Text>
              </div>
              <Switch
                checked={config.settings.allowDeleteColumns}
                onChange={(checked) =>
                  updateSettings({ allowDeleteColumns: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <div>
                <Text>Allow Reordering</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Users can reorder rows and columns
                </Text>
              </div>
              <Switch
                checked={config.settings.allowReorderRows}
                onChange={(checked) =>
                  updateSettings({
                    allowReorderRows: checked,
                    allowReorderColumns: checked,
                  })
                }
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Display Options */}
      <SettingGroup>
        <Card size="small" title="Display Options">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Show Row Numbers</Text>
              <Switch
                checked={config.settings.showRowNumbers}
                onChange={(checked) =>
                  updateSettings({ showRowNumbers: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Show Column Headers</Text>
              <Switch
                checked={config.settings.showColumnHeaders}
                onChange={(checked) =>
                  updateSettings({ showColumnHeaders: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Show Grid Lines</Text>
              <Switch
                checked={config.settings.showGridLines}
                onChange={(checked) =>
                  updateSettings({ showGridLines: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Alternate Row Colors</Text>
              <Switch
                checked={config.formatting.alternateRowColors}
                onChange={(checked) =>
                  updateFormatting({ alternateRowColors: checked })
                }
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Features */}
      <SettingGroup>
        <Card size="small" title="Features">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Enable Filtering</Text>
              <Switch
                checked={config.settings.allowFiltering}
                onChange={(checked) =>
                  updateSettings({ allowFiltering: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Enable Sorting</Text>
              <Switch
                checked={config.settings.allowSorting}
                onChange={(checked) =>
                  updateSettings({ allowSorting: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Enable Grouping</Text>
              <Switch
                checked={config.settings.allowGrouping}
                onChange={(checked) =>
                  updateSettings({ allowGrouping: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Enable Formulas</Text>
              <Switch
                checked={config.settings.enableFormulas}
                onChange={(checked) =>
                  updateSettings({ enableFormulas: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Enable Comments</Text>
              <Switch
                checked={config.settings.enableComments}
                onChange={(checked) =>
                  updateSettings({ enableComments: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Enable History</Text>
              <Switch
                checked={config.settings.enableHistory}
                onChange={(checked) =>
                  updateSettings({ enableHistory: checked })
                }
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Auto Save */}
      <SettingGroup>
        <Card size="small" title="Auto Save">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Enable Auto Save</Text>
              <Switch
                checked={config.settings.autoSave}
                onChange={(checked) => updateSettings({ autoSave: checked })}
              />
            </SettingItem>

            {config.settings.autoSave && (
              <SettingItem>
                <Text>Auto Save Interval (seconds)</Text>
                <InputNumber
                  min={10}
                  max={300}
                  value={config.settings.autoSaveInterval}
                  onChange={(value) =>
                    updateSettings({ autoSaveInterval: value })
                  }
                  style={{ width: 100 }}
                />
              </SettingItem>
            )}
          </Space>
        </Card>
      </SettingGroup>

      {/* Limits */}
      <SettingGroup>
        <Card size="small" title="Limits">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Maximum Rows</Text>
              <InputNumber
                min={1}
                max={10000}
                value={config.settings.maxRows || 1000}
                onChange={(value) => updateSettings({ maxRows: value })}
                style={{ width: 100 }}
              />
            </SettingItem>

            <SettingItem>
              <Text>Maximum Columns</Text>
              <InputNumber
                min={1}
                max={100}
                value={config.settings.maxColumns || 50}
                onChange={(value) => updateSettings({ maxColumns: value })}
                style={{ width: 100 }}
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Permissions */}
      <SettingGroup>
        <Card size="small" title="Permissions">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Can View</Text>
              <Switch
                checked={config.permissions.canView}
                onChange={(checked) => updatePermissions({ canView: checked })}
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Edit</Text>
              <Switch
                checked={config.permissions.canEdit}
                onChange={(checked) => updatePermissions({ canEdit: checked })}
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Delete</Text>
              <Switch
                checked={config.permissions.canDelete}
                onChange={(checked) =>
                  updatePermissions({ canDelete: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Export</Text>
              <Switch
                checked={config.permissions.canExport}
                onChange={(checked) =>
                  updatePermissions({ canExport: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Import</Text>
              <Switch
                checked={config.permissions.canImport}
                onChange={(checked) =>
                  updatePermissions({ canImport: checked })
                }
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Share</Text>
              <Switch
                checked={config.permissions.canShare}
                onChange={(checked) => updatePermissions({ canShare: checked })}
              />
            </SettingItem>

            <SettingItem>
              <Text>Can Comment</Text>
              <Switch
                checked={config.permissions.canComment}
                onChange={(checked) =>
                  updatePermissions({ canComment: checked })
                }
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>

      {/* Formatting */}
      <SettingGroup>
        <Card size="small" title="Default Formatting">
          <Space direction="vertical" style={{ width: "100%" }}>
            <SettingItem>
              <Text>Default Font</Text>
              <Select
                value={config.formatting.defaultFont}
                onChange={(value) => updateFormatting({ defaultFont: value })}
                style={{ width: 120 }}
              >
                <Option value="Arial">Arial</Option>
                <Option value="Helvetica">Helvetica</Option>
                <Option value="Times New Roman">Times New Roman</Option>
                <Option value="Courier New">Courier New</Option>
                <Option value="Verdana">Verdana</Option>
              </Select>
            </SettingItem>

            <SettingItem>
              <Text>Default Font Size</Text>
              <InputNumber
                min={8}
                max={24}
                value={config.formatting.defaultFontSize}
                onChange={(value) =>
                  updateFormatting({ defaultFontSize: value })
                }
                style={{ width: 80 }}
              />
            </SettingItem>
          </Space>
        </Card>
      </SettingGroup>
    </SettingsContainer>
  );
}