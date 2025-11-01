import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  theme,
  Space,
  Button,
  Tree,
  Input,
  Modal,
  Form,
  Select,
  message,
  Row,
  Col,
} from 'antd';
import { useMenuStore } from '../../../stores/menu/useMenuStore';
import { useStyles } from '../styles/MenuPreview.style';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

// Icon mapping for preview using Remix CSS classes
const iconMap = {
  'ri-dashboard-line': <i className="ri-dashboard-line" />,
  'ri-settings-line': <i className="ri-settings-line" />,
  'ri-user-line': <i className="ri-user-line" />,
  'ri-file-line': <i className="ri-file-line" />,
  'ri-folder-line': <i className="ri-folder-line" />,
  'ri-apps-line': <i className="ri-apps-line" />,
  'ri-home-line': <i className="ri-home-line" />,
  'ri-menu-line': <i className="ri-menu-line" />,
};

const MenuViewer = ({ previewMode = 'desktop' }) => {
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const styles = useStyles(token, previewMode, collapsed);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [form] = Form.useForm();

  const {
    completeMenuData,
    mainMenus,
    sidebarMenus,
    setCompleteMenuData,
    setMainMenus,
    setSidebarMenus,
  } = useMenuStore();

  // Sample tree data with CRUD functionality
  const [treeData, setTreeData] = useState([
    {
      title: 'Dashboard',
      key: 'dashboard',
      icon: 'ri-dashboard-line',
      children: [
        {
          title: 'Analytics',
          key: 'analytics',
          icon: 'ri-bar-chart-line',
        },
        {
          title: 'Reports',
          key: 'reports',
          icon: 'ri-file-chart-line',
        },
      ],
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'ri-settings-line',
      children: [
        {
          title: 'User Management',
          key: 'user-management',
          icon: 'ri-user-settings-line',
        },
        {
          title: 'System Config',
          key: 'system-config',
          icon: 'ri-settings-3-line',
        },
      ],
    },
  ]);

  // Convert menu items for Ant Design Menu component
  const convertMenuItems = (items) => {
    return (
      items?.map((item) => ({
        key: item.key,
        icon: iconMap[item.icon] || <i className="ri-file-line" />,
        label: item.label,
        disabled: item.disabled,
        children: item.children ? convertMenuItems(item.children) : undefined,
      })) || []
    );
  };

  // Get main menu items
  const mainMenuItems = convertMenuItems(mainMenus);

  // Get sidebar menu items
  const sidebarMenuItems = convertMenuItems(sidebarMenus?.dashboard || []);

  // Tree operations
  const handleAddNode = (parentKey = null) => {
    setEditingNode({ parentKey, isNew: true });
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditNode = (node) => {
    setEditingNode({ ...node, isNew: false });
    setIsModalVisible(true);
    form.setFieldsValue({
      title: node.title,
      key: node.key,
      icon: node.icon,
    });
  };

  const handleDeleteNode = (nodeKey) => {
    const deleteFromTree = (nodes) => {
      return nodes.filter((node) => {
        if (node.key === nodeKey) {
          return false;
        }
        if (node.children) {
          node.children = deleteFromTree(node.children);
        }
        return true;
      });
    };
    setTreeData(deleteFromTree(treeData));
    message.success('Node deleted successfully');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingNode.isNew) {
        const newNode = {
          title: values.title,
          key: values.key,
          icon: values.icon,
          children: [],
        };

        if (editingNode.parentKey) {
          // Add as child
          const addToParent = (nodes) => {
            return nodes.map((node) => {
              if (node.key === editingNode.parentKey) {
                return {
                  ...node,
                  children: [...(node.children || []), newNode],
                };
              }
              if (node.children) {
                return {
                  ...node,
                  children: addToParent(node.children),
                };
              }
              return node;
            });
          };
          setTreeData(addToParent(treeData));
        } else {
          // Add as root
          setTreeData([...treeData, newNode]);
        }
        message.success('Node added successfully');
      } else {
        // Edit existing node
        const updateNode = (nodes) => {
          return nodes.map((node) => {
            if (node.key === editingNode.key) {
              return {
                ...node,
                title: values.title,
                key: values.key,
                icon: values.icon,
              };
            }
            if (node.children) {
              return {
                ...node,
                children: updateNode(node.children),
              };
            }
            return node;
          });
        };
        setTreeData(updateNode(treeData));
        message.success('Node updated successfully');
      }
      setIsModalVisible(false);
      setEditingNode(null);
    });
  };

  // Render tree nodes with clean default styling
  const renderTreeNodes = (data) => {
    return data.map((item) => ({
      key: item.key,
      title: item.title,
      icon: iconMap[item.icon] || <i className="ri-file-line" />,
      children: item.children ? renderTreeNodes(item.children) : undefined,
    }));
  };

  return (
    <div style={styles.previewContainer}>
      <div style={styles.previewLayout}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <div style={styles.brand}>
              <Text strong style={styles.brandText}>
                Zionix
              </Text>
            </div>

            {/* Main Navigation */}
            {previewMode === 'desktop' && (
              <Menu
                mode="horizontal"
                selectedKeys={selectedKeys}
                items={mainMenuItems}
                style={styles.mainMenu}
              />
            )}
          </div>

          <div style={styles.topBarRight}>
            <Space>
              <Avatar size="small" icon={<i className="ri-user-line" />} />
              <Text style={styles.userText}>John Doe</Text>
            </Space>
          </div>
        </div>

        <div style={styles.contentLayout}>
          {/* Sidebar */}
          {(previewMode === 'desktop' || previewMode === 'tablet') && (
            <div style={styles.sidebar}>
              {/* Sidebar Header */}
              <div style={styles.sidebarHeader}>
                {!collapsed && (
                  <Text strong style={styles.sidebarTitle}>
                    Navigation
                  </Text>
                )}
                {previewMode === 'desktop' && (
                  <Button
                    type="text"
                    icon={
                      collapsed ? (
                        <i className="ri-menu-unfold-line" />
                      ) : (
                        <i className="ri-menu-fold-line" />
                      )
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={styles.collapseButton}
                  />
                )}
              </div>

              {/* Sidebar Menu */}
              <Menu
                mode="inline"
                items={sidebarMenuItems}
                style={styles.sidebarMenu}
                inlineCollapsed={collapsed}
              />
            </div>
          )}

          {/* Main Content - Tree Editor */}
          <div style={styles.mainContent}>
            <div style={styles.contentArea}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Title level={4} style={styles.contentTitle}>
                  Menus
                </Title>
                <Button
                  type="primary"
                  onClick={() => handleAddNode()}
                  icon={<i className="ri-add-line" />}
                >
                  Add Menu
                </Button>
              </div>

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Search
                    placeholder="Search menus"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                </Col>
                <Col span={8}>
                  <Select placeholder="Search Applications" value={[]} />
                </Col>
              </Row>

              {/* Tree Component */}
              <div style={{ 
                background: '#fff', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid #d9d9d9',
                width: '100%'
              }}>
                {/* Tree Actions */}
                <div style={{ 
                  marginBottom: '12px', 
                  display: 'flex', 
                  gap: '8px',
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '12px'
                }}>
                  <Button 
                    size="small" 
                    icon={<i className="ri-add-line" />}
                    onClick={() => handleAddNode()}
                  >
                    Add Root
                  </Button>
                  <Button 
                    size="small" 
                    icon={<i className="ri-edit-line" />}
                    disabled={selectedKeys.length === 0}
                    onClick={() => {
                      if (selectedKeys.length > 0) {
                        const findNode = (data, key) => {
                          for (const item of data) {
                            if (item.key === key) return item;
                            if (item.children) {
                              const found = findNode(item.children, key);
                              if (found) return found;
                            }
                          }
                          return null;
                        };
                        const node = findNode(treeData, selectedKeys[0]);
                        if (node) handleEditNode(node);
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    icon={<i className="ri-delete-bin-line" />}
                    danger
                    disabled={selectedKeys.length === 0}
                    onClick={() => {
                      if (selectedKeys.length > 0) {
                        handleDeleteNode(selectedKeys[0]);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>

                <Tree
                  showLine
                  showIcon
                  defaultExpandAll
                  blockNode
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  onSelect={setSelectedKeys}
                  onExpand={setExpandedKeys}
                  treeData={renderTreeNodes(treeData)}
                  style={{
                    width: '100%',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                />
              </div>

              {/* Mobile Menu Preview */}
              {previewMode === 'mobile' && (
                <div style={styles.mobileMenuPreview}>
                  <Title level={5}>Mobile Navigation</Title>
                  <Menu
                    mode="inline"
                    items={[...mainMenuItems, ...sidebarMenuItems]}
                    style={styles.mobileMenu}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingNode?.isNew ? 'Add Menu Item' : 'Edit Menu Item'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNode(null);
        }}
        okText={editingNode?.isNew ? 'Add' : 'Update'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter menu item title" />
          </Form.Item>

          <Form.Item
            name="key"
            label="Key"
            rules={[{ required: true, message: 'Please enter a unique key' }]}
          >
            <Input placeholder="Enter unique key (e.g., dashboard)" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
            rules={[{ required: true, message: 'Please select an icon' }]}
          >
            <Select placeholder="Select an icon">
              <Select.Option value="ri-dashboard-line">
                <i className="ri-dashboard-line" style={{ marginRight: 8 }} />
                Dashboard
              </Select.Option>
              <Select.Option value="ri-settings-line">
                <i className="ri-settings-line" style={{ marginRight: 8 }} />
                Settings
              </Select.Option>
              <Select.Option value="ri-user-line">
                <i className="ri-user-line" style={{ marginRight: 8 }} />
                User
              </Select.Option>
              <Select.Option value="ri-file-line">
                <i className="ri-file-line" style={{ marginRight: 8 }} />
                File
              </Select.Option>
              <Select.Option value="ri-folder-line">
                <i className="ri-folder-line" style={{ marginRight: 8 }} />
                Folder
              </Select.Option>
              <Select.Option value="ri-apps-line">
                <i className="ri-apps-line" style={{ marginRight: 8 }} />
                Apps
              </Select.Option>
              <Select.Option value="ri-home-line">
                <i className="ri-home-line" style={{ marginRight: 8 }} />
                Home
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuViewer;
