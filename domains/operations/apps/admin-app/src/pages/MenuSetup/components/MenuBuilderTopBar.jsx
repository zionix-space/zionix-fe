import React from 'react';
import { Layout, Button, Select, Space, Typography, theme } from 'antd';
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  DesktopOutlined, 
  MobileOutlined, 
  TabletOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { useStyles } from '../styles/MenuBuilderTopBar.style';

const { Header } = Layout;
const { Title } = Typography;
const { Option } = Select;

const MenuBuilderTopBar = ({ 
  previewMode, 
  setPreviewMode, 
  isPreviewVisible, 
  setIsPreviewVisible 
}) => {
  const { token } = theme.useToken();
  const styles = useStyles(token);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving menu configuration...');
  };

  const handleUndo = () => {
    // TODO: Implement undo functionality
    console.log('Undo action...');
  };

  const handleRedo = () => {
    // TODO: Implement redo functionality
    console.log('Redo action...');
  };

  return (
    <Header style={styles.topBarStyle}>
      {/* Left Section - Brand/Title */}
      <div style={styles.leftSectionStyle}>
        <div style={styles.brandContainerStyle}>
          <Title level={4} style={styles.titleStyle}>
            Menu Builder
          </Title>
        </div>
      </div>

      {/* Center Section - Preview Controls */}
      <div style={styles.centerSectionStyle}>
        <Space size="middle">
          <Select
            value={previewMode}
            onChange={setPreviewMode}
            style={styles.previewModeSelect}
            suffixIcon={null}
          >
            <Option value="desktop">
              <Space>
                <DesktopOutlined />
                Desktop
              </Space>
            </Option>
            <Option value="tablet">
              <Space>
                <TabletOutlined />
                Tablet
              </Space>
            </Option>
            <Option value="mobile">
              <Space>
                <MobileOutlined />
                Mobile
              </Space>
            </Option>
          </Select>

          <Button
            type={isPreviewVisible ? "primary" : "default"}
            icon={isPreviewVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            style={styles.iconButtonStyle}
          >
            {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </Space>
      </div>

      {/* Right Section - Actions */}
      <div style={styles.rightActionsStyle}>
        <Space size="small">
          <Button
            icon={<UndoOutlined />}
            onClick={handleUndo}
            style={styles.iconButtonStyle}
            title="Undo"
          />
          <Button
            icon={<RedoOutlined />}
            onClick={handleRedo}
            style={styles.iconButtonStyle}
            title="Redo"
          />
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={styles.saveButtonStyle}
          >
            Save Changes
          </Button>
        </Space>
      </div>
    </Header>
  );
};

export default MenuBuilderTopBar;