import React, { useState, useCallback, useMemo } from 'react';
import { 
  Tree, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Typography, 
  Dropdown, 
  message,
  theme 
} from 'antd';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  DragOutlined,
  FolderOutlined,
  FileOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useMenuStore } from '../../../stores/menu/useMenuStore';
import { useStyles } from '../styles/MenuTreeEditor.style';

const { Title, Text } = Typography;
const { Option } = Select;

const MenuTreeEditor = ({ 
  selectedMenuId, 
  onMenuDataChange, 
  onMainMenusChange, 
  onSidebarMenusChange 
}) => {
  const { token } = theme.useToken();
  const styles = useStyles(token);
  
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [editingNode, setEditingNode] = useState(null);
  const [form] = Form.useForm();
  
  const { mainMenus, sidebarMenus, completeMenuData } = useMenuStore();

  // Convert menu data to tree data structure
  const convertToTreeData = useCallback((menuData, type = 'main') => {
    if (type === 'main') {
      return mainMenus.map(menu => ({
        key: `main-${menu.key}`,
        title: (
          <div style={styles.treeNodeTitle}>
            <Space>
              <FileOutlined />
              <span>{menu.label}</span>
              {menu.disabled && <EyeInvisibleOutlined style={styles.disabledIcon} />}
              {menu.readonly && <LockOutlined style={styles.readonlyIcon} />}
            </Space>
            <Dropdown
              menu={{
                items: getNodeActions(menu, 'main'),
              }}
              trigger={['click']}
            >
              <Button 
                type="text" 
                size="small" 
                icon={<MoreOutlined />}
                style={styles.actionButton}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        ),
        children: menu.children ? convertToTreeData(menu.children, 'main') : undefined,
        disabled: menu.disabled,
        readonly: menu.readonly,
        data: menu,
      }));
    }
    
    // Handle sidebar menus
    return Object.entries(sidebarMenus).map(([key, menuItems]) => ({
      key: `sidebar-${key}`,
      title: (
        <div style={styles.treeNodeTitle}>
          <Space>
            <FolderOutlined />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </Space>
          <Dropdown
            menu={{
              items: getSectionActions(key),
            }}
            trigger={['click']}
          >
            <Button 
              type="text" 
              size="small" 
              icon={<MoreOutlined />}
              style={styles.actionButton}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      ),
      children: menuItems.map(item => ({
        key: `sidebar-${key}-${item.key}`,
        title: (
          <div style={styles.treeNodeTitle}>
            <Space>
              <FileOutlined />
              <span>{item.label}</span>
              {item.disabled && <EyeInvisibleOutlined style={styles.disabledIcon} />}
              {item.readonly && <LockOutlined style={styles.readonlyIcon} />}
            </Space>
            <Dropdown
              menu={{
                items: getNodeActions(item, 'sidebar', key),
              }}
              trigger={['click']}
            >
              <Button 
                type="text" 
                size="small" 
                icon={<MoreOutlined />}
                style={styles.actionButton}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        ),
        disabled: item.disabled,
        readonly: item.readonly,
        data: item,
      })),
    }));
  }, [mainMenus, sidebarMenus]);

  // Get tree data based on selected menu
  const treeData = useMemo(() => {
    if (!selectedMenuId) return [];
    
    if (selectedMenuId.startsWith('main-')) {
      return convertToTreeData(mainMenus, 'main');
    } else if (selectedMenuId.startsWith('sidebar-')) {
      return convertToTreeData(sidebarMenus, 'sidebar');
    }
    
    return [];
  }, [selectedMenuId, mainMenus, sidebarMenus, convertToTreeData]);

  // Node action menu items
  const getNodeActions = (node, type, section = null) => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => handleEdit(node, type, section),
    },
    {
      key: 'add-child',
      label: 'Add Child',
      icon: <PlusOutlined />,
      onClick: () => handleAddChild(node, type, section),
    },
    {
      type: 'divider',
    },
    {
      key: 'move-up',
      label: 'Move Up',
      icon: <ArrowUpOutlined />,
      onClick: () => handleMoveUp(node, type, section),
    },
    {
      key: 'move-down',
      label: 'Move Down',
      icon: <ArrowDownOutlined />,
      onClick: () => handleMoveDown(node, type, section),
    },
    {
      type: 'divider',
    },
    {
      key: 'toggle-disabled',
      label: node.disabled ? 'Enable' : 'Disable',
      icon: <EyeInvisibleOutlined />,
      onClick: () => handleToggleDisabled(node, type, section),
    },
    {
      key: 'toggle-readonly',
      label: node.readonly ? 'Make Editable' : 'Make Read-only',
      icon: <LockOutlined />,
      onClick: () => handleToggleReadonly(node, type, section),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(node, type, section),
    },
  ];

  // Section action menu items
  const getSectionActions = (section) => [
    {
      key: 'add-item',
      label: 'Add Menu Item',
      icon: <PlusOutlined />,
      onClick: () => handleAddToSection(section),
    },
    {
      key: 'rename-section',
      label: 'Rename Section',
      icon: <EditOutlined />,
      onClick: () => handleRenameSection(section),
    },
  ];

  // Event handlers
  const handleAdd = () => {
    setModalType('add');
    setEditingNode(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (node, type, section) => {
    setModalType('edit');
    setEditingNode({ ...node, type, section });
    form.setFieldsValue({
      label: node.label,
      key: node.key,
      path: node.path,
      icon: node.icon,
      disabled: node.disabled || false,
      readonly: node.readonly || false,
    });
    setIsModalVisible(true);
  };

  const handleAddChild = (parentNode, type, section) => {
    setModalType('add-child');
    setEditingNode({ ...parentNode, type, section });
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleAddToSection = (section) => {
    setModalType('add-to-section');
    setEditingNode({ section });
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (node, type, section) => {
    Modal.confirm({
      title: 'Delete Menu Item',
      content: `Are you sure you want to delete "${node.label}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        // TODO: Implement delete functionality
        message.success(`Deleted "${node.label}"`);
      },
    });
  };

  const handleMoveUp = (node, type, section) => {
    // TODO: Implement move up functionality
    message.info(`Moving "${node.label}" up`);
  };

  const handleMoveDown = (node, type, section) => {
    // TODO: Implement move down functionality
    message.info(`Moving "${node.label}" down`);
  };

  const handleToggleDisabled = (node, type, section) => {
    // TODO: Implement toggle disabled functionality
    message.info(`${node.disabled ? 'Enabled' : 'Disabled'} "${node.label}"`);
  };

  const handleToggleReadonly = (node, type, section) => {
    // TODO: Implement toggle readonly functionality
    message.info(`Made "${node.label}" ${node.readonly ? 'editable' : 'read-only'}`);
  };

  const handleRenameSection = (section) => {
    // TODO: Implement rename section functionality
    message.info(`Renaming section "${section}"`);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // TODO: Implement save functionality based on modalType
      console.log('Form values:', values);
      message.success('Menu item saved successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Drag and drop handlers
  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // TODO: Implement drag and drop reordering
    console.log('Drag and drop:', { dragKey, dropKey, dropPosition });
    message.info('Drag and drop functionality will be implemented');
  };

  return (
    <div style={styles.editorContainer}>
      {/* Header */}
      <div style={styles.editorHeader}>
        <div style={styles.headerLeft}>
          <Title level={5} style={styles.editorTitle}>
            {selectedMenuId ? `Editing: ${selectedMenuId}` : 'Select a menu to edit'}
          </Title>
          {selectedMenuId && (
            <Text type="secondary" style={styles.editorSubtitle}>
              Drag items to reorder, right-click for options
            </Text>
          )}
        </div>
        <div style={styles.headerRight}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            disabled={!selectedMenuId}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Tree Editor */}
      <div style={styles.treeContainer}>
        {selectedMenuId ? (
          <Tree
            draggable
            blockNode
            showLine
            showIcon={false}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            onExpand={setExpandedKeys}
            onSelect={setSelectedKeys}
            onDrop={onDrop}
            treeData={treeData}
            style={styles.treeStyle}
          />
        ) : (
          <div style={styles.emptyState}>
            <Text type="secondary">
              Select a menu from the sidebar to start editing
            </Text>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          modalType === 'add' ? 'Add Menu Item' :
          modalType === 'edit' ? 'Edit Menu Item' :
          modalType === 'add-child' ? 'Add Child Item' :
          'Add Menu Item'
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={styles.modalForm}
        >
          <Form.Item
            name="label"
            label="Label"
            rules={[{ required: true, message: 'Please enter a label' }]}
          >
            <Input placeholder="Menu item label" />
          </Form.Item>

          <Form.Item
            name="key"
            label="Key"
            rules={[{ required: true, message: 'Please enter a unique key' }]}
          >
            <Input placeholder="unique-menu-key" />
          </Form.Item>

          <Form.Item
            name="path"
            label="Path/URL"
          >
            <Input 
              placeholder="/path/to/page or https://external-url.com"
              prefix={<LinkOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
          >
            <Select placeholder="Select an icon" allowClear>
              <Option value="AppstoreOutlined">App Store</Option>
              <Option value="SettingOutlined">Settings</Option>
              <Option value="UserOutlined">User</Option>
              <Option value="FileOutlined">File</Option>
              <Option value="FolderOutlined">Folder</Option>
              <Option value="DashboardOutlined">Dashboard</Option>
            </Select>
          </Form.Item>

          <Space>
            <Form.Item
              name="disabled"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch checkedChildren="Disabled" unCheckedChildren="Enabled" />
            </Form.Item>

            <Form.Item
              name="readonly"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch checkedChildren="Read-only" unCheckedChildren="Editable" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuTreeEditor;