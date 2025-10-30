import React, { useState, useEffect, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  Switch,
  InputNumber,
  Radio,
  Checkbox,
  Button,
  Divider,
  Space,
  Tabs,
  ColorPicker,
  Tooltip,
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Alert
} from 'antd';

import { useFormBuilder } from '../../contexts/FormBuilderContext';
import * as S from '../../styles/components/Properties.styles';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const PropertiesPanel = ({
  onComponentUpdate,
  onSectionUpdate,
  components,
  sections
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('basic');
  
  // Get selection from context
  const { selectedComponent, selectedSection, selectionType } = useFormBuilder();

  // Determine what to show based on selection
  const selectedItem = selectedComponent || selectedSection;
  const isComponent = selectionType === 'component';
  const isSection = selectionType === 'section';

  // Update form when selection changes
  useEffect(() => {
    if (selectedItem) {
      form.setFieldsValue(selectedItem);
    } else {
      form.resetFields();
    }
  }, [selectedItem, form]);

  // Handle form value changes
  const handleFormChange = (changedValues, allValues) => {
    if (!selectedItem) return;

    if (isComponent && onComponentUpdate) {
      onComponentUpdate(selectedComponent.id, allValues);
    } else if (isSection && onSectionUpdate) {
      onSectionUpdate(selectedSection.id, allValues);
    }
  };

  // Add new option for select/radio/checkbox components
  const addOption = () => {
    const currentOptions = form.getFieldValue('options') || [];
    const newOption = {
      value: `option_${Date.now()}`,
      label: `Option ${currentOptions.length + 1}`
    };
    form.setFieldsValue({
      options: [...currentOptions, newOption]
    });
  };

  // Remove option
  const removeOption = (index) => {
    const currentOptions = form.getFieldValue('options') || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    form.setFieldsValue({ options: newOptions });
  };

  // Render empty state
  if (!selectedItem) {
    return (
      <S.PropertiesPanelContainer>
        <S.PropertiesHeader>
          <S.HeaderTitle>
            <i className="ri-settings-line" /> Properties
          </S.HeaderTitle>
        </S.PropertiesHeader>
        <S.EmptyState>
          <S.EmptyIcon>
            <i className="ri-settings-line" />
          </S.EmptyIcon>
          <S.EmptyTitle>No Selection</S.EmptyTitle>
          <S.EmptyDescription>
            Select a component or section to view and edit its properties
          </S.EmptyDescription>
        </S.EmptyState>
      </S.PropertiesPanelContainer>
    );
  }

  // Render component properties
  const renderComponentProperties = () => {
    const componentType = selectedComponent.type;
    const hasOptions = ['select', 'radio', 'checkbox'].includes(componentType);

    const tabItems = [
      {
        key: 'basic',
        label: (
          <span>
            <i className="ri-file-text-line" />
            Basic
          </span>
        ),
        children: (
          <div>
            <Form.Item label="Field Name" name="name">
              <Input placeholder="Enter field name" />
            </Form.Item>
            
            <Form.Item label="Label" name="label">
              <Input placeholder="Enter field label" />
            </Form.Item>
            
            <Form.Item label="Placeholder" name="placeholder">
              <Input placeholder="Enter placeholder text" />
            </Form.Item>
            
            <Form.Item label="Help Text" name="extra">
              <Input placeholder="Enter help text" />
            </Form.Item>
            
            <Form.Item label="Tooltip" name="tooltip">
              <Input placeholder="Enter tooltip text" />
            </Form.Item>
            
            <Form.Item label="Default Value" name="defaultValue">
              <Input placeholder="Enter default value" />
            </Form.Item>
          </div>
        ),
      },
      {
        key: 'validation',
        label: (
          <span>
            <i className="ri-shield-check-line" />
            Validation
          </span>
        ),
        children: (
          <div>
            <Form.Item name={['validation', 'required']} valuePropName="checked">
              <Checkbox>Required Field</Checkbox>
            </Form.Item>
            
            <Form.Item label="Error Message" name={['validation', 'message']}>
              <Input placeholder="Custom error message" />
            </Form.Item>
            
            {componentType === 'input' && (
              <>
                <Form.Item label="Min Length" name={['validation', 'minLength']}>
                  <InputNumber min={0} placeholder="Minimum length" style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.Item label="Max Length" name={['validation', 'maxLength']}>
                  <InputNumber min={0} placeholder="Maximum length" style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.Item label="Pattern (Regex)" name={['validation', 'pattern']}>
                  <Input placeholder="Enter regex pattern" />
                </Form.Item>
              </>
            )}
            
            {componentType === 'number' && (
              <>
                <Form.Item label="Minimum Value" name={['validation', 'min']}>
                  <InputNumber placeholder="Minimum value" style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.Item label="Maximum Value" name={['validation', 'max']}>
                  <InputNumber placeholder="Maximum value" style={{ width: '100%' }} />
                </Form.Item>
              </>
            )}
          </div>
        ),
      },
      {
        key: 'styling',
        label: (
          <span>
            <i className="ri-palette-line" />
            Styling
          </span>
        ),
        children: (
          <div>
            <Form.Item label="Size" name={['styling', 'size']}>
              <Select placeholder="Select size">
                <Option value="small">Small</Option>
                <Option value="middle">Medium</Option>
                <Option value="large">Large</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name={['styling', 'allowClear']} valuePropName="checked">
              <Checkbox>Allow Clear</Checkbox>
            </Form.Item>
            
            <Form.Item name={['styling', 'disabled']} valuePropName="checked">
              <Checkbox>Disabled</Checkbox>
            </Form.Item>
            
            {componentType === 'textarea' && (
              <Form.Item label="Rows" name={['styling', 'rows']}>
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>
            )}
            
            {componentType === 'select' && (
              <>
                <Form.Item name={['styling', 'showSearch']} valuePropName="checked">
                  <Checkbox>Show Search</Checkbox>
                </Form.Item>
                
                <Form.Item name={['styling', 'multiple']} valuePropName="checked">
                  <Checkbox>Multiple Selection</Checkbox>
                </Form.Item>
              </>
            )}
          </div>
        ),
      },
      {
        key: 'advanced',
        label: (
          <span>
            <i className="ri-tools-line" />
            Advanced
          </span>
        ),
        children: (
          <div>
            <Form.Item label="CSS Class" name={['styling', 'className']}>
              <Input placeholder="Enter CSS class names" />
            </Form.Item>
            
            <Form.Item label="Custom Styles" name={['styling', 'style']}>
              <TextArea
                rows={3}
                placeholder="Enter custom CSS styles (JSON format)"
              />
            </Form.Item>
            
            <Form.Item name={['styling', 'hidden']} valuePropName="checked">
              <Checkbox>Hidden</Checkbox>
            </Form.Item>
            
            <Form.Item name={['styling', 'readOnly']} valuePropName="checked">
              <Checkbox>Read Only</Checkbox>
            </Form.Item>
          </div>
        ),
      },
    ];

    // Add options tab for components that support it
    if (hasOptions) {
      tabItems.splice(2, 0, {
        key: 'options',
        label: (
          <span>
            <i className="ri-code-line" />
            Options
          </span>
        ),
        children: (
          <div>
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'label']}
                        style={{ margin: 0, flex: 1 }}
                      >
                        <Input placeholder="Option label" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        style={{ margin: 0, flex: 1 }}
                      >
                        <Input placeholder="Option value" />
                      </Form.Item>
                      <Button
                        type="text"
                        icon={<i className="ri-delete-bin-line" />}
                        onClick={() => remove(name)}
                        size="small"
                      />
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ label: '', value: '' })}
                    block
                    icon={<i className="ri-add-line" />}
                    size="small"
                  >
                    Add Option
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        ),
      });
    }

    return (
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        size="small"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          items={tabItems}
        />
      </Form>
    );
  };

  // Render section properties
  const renderSectionProperties = () => {
    const tabItems = [
      {
        key: 'basic',
        label: (
          <span>
            <i className="ri-file-text-line" />
            Properties
          </span>
        ),
        children: (
          <div>
            <Form.Item label="Section Title" name="title">
              <Input placeholder="Enter section title" />
            </Form.Item>
            
            <Form.Item label="Description" name="description">
              <TextArea
                rows={2}
                placeholder="Enter section description"
              />
            </Form.Item>
            
            <Form.Item name="collapsible" valuePropName="checked">
              <Checkbox>Collapsible Section</Checkbox>
            </Form.Item>
            
            <Form.Item name="collapsed" valuePropName="checked">
              <Checkbox>Initially Collapsed</Checkbox>
            </Form.Item>
          </div>
        ),
      },
      {
        key: 'styling',
        label: (
          <span>
            <i className="ri-palette-line" />
            Styling
          </span>
        ),
        children: (
          <div>
            <Form.Item name={['styling', 'bordered']} valuePropName="checked">
              <Checkbox>Show Border</Checkbox>
            </Form.Item>
            
            <Form.Item name={['styling', 'shadow']} valuePropName="checked">
              <Checkbox>Drop Shadow</Checkbox>
            </Form.Item>
            
            <Form.Item label="Background Color" name={['styling', 'backgroundColor']}>
              <ColorPicker showText />
            </Form.Item>
            
            <Form.Item label="CSS Class" name={['styling', 'className']}>
              <Input placeholder="Enter CSS class names" />
            </Form.Item>
          </div>
        ),
      },
    ];

    return (
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        size="small"
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          items={tabItems}
        />
      </Form>
    );
  };

  return (
    <S.PropertiesPanelContainer>
      <S.PropertiesHeader>
        <S.HeaderTitle>
          <i className="ri-settings-line" /> Properties
        </S.HeaderTitle>
        <S.HeaderSubtitle>
          {isComponent && `${selectedComponent.type} Field`}
          {isSection && 'Form Section'}
        </S.HeaderSubtitle>
      </S.PropertiesHeader>
      
      <S.PropertiesContent>
        {isComponent && renderComponentProperties()}
        {isSection && renderSectionProperties()}
      </S.PropertiesContent>
    </S.PropertiesPanelContainer>
  );
};

export default PropertiesPanel;