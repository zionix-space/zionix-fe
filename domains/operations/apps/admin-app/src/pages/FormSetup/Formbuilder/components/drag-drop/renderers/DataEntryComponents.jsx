import React from "react";
import {
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  InputNumber,
  Switch,
  Rate,
  Slider,
  Upload,
  Button,
  AutoComplete,
  Cascader,
  ColorPicker,
  Mentions,
  TimePicker,
  Transfer,
  TreeSelect,
} from "antd";


const { TextArea } = Input;

/**
 * Renders data entry components for the form builder drag preview
 * @param {Object} component - Component configuration object
 * @param {Object} commonProps - Common props applied to all components
 * @returns {JSX.Element|null} Rendered component or null
 */
const DataEntryComponents = ({ component, commonProps }) => {
  switch (component.type) {
    // Basic Data Entry Components
    case "input":
      return <Input {...commonProps} />;
    
    case "textarea":
      return <TextArea {...commonProps} rows={2} />;
    
    case "select":
      return (
        <Select {...commonProps}>
          {component.options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    
    case "radio":
      return (
        <Radio.Group {...commonProps}>
          {component.options?.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      );
    
    case "checkbox":
      return <Checkbox {...commonProps}>{component.label}</Checkbox>;
    
    case "number":
      return <InputNumber {...commonProps} />;
    
    case "date":
      return <DatePicker {...commonProps} />;
    
    case "switch":
      return <Switch {...commonProps} size="small" />;
    
    case "rate":
      return <Rate {...commonProps} count={5} allowHalf disabled />;
    
    case "slider":
      return <Slider {...commonProps} defaultValue={30} />;
    
    case "upload":
      return (
        <Upload {...commonProps} disabled>
          <Button size="small" icon={<i className="ri-upload-line" />}>
            Upload
          </Button>
        </Upload>
      );

    // Additional Data Entry Components
    case "autocomplete":
      return (
        <AutoComplete {...commonProps} options={component.options || []} />
      );
    
    case "cascader":
      return (
        <Cascader {...commonProps} options={component.options || []} />
      );
    
    case "colorpicker":
      return <ColorPicker {...commonProps} size="small" />;
    
    case "mentions":
      return <Mentions {...commonProps} rows={2} />;
    
    case "timepicker":
      return <TimePicker {...commonProps} />;
    
    case "transfer":
      return (
        <div
          style={{
            ...commonProps.style,
            height: "100px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          Transfer Component
        </div>
      );
    
    case "treeselect":
      return (
        <TreeSelect {...commonProps} treeData={component.treeData || []} />
      );

    // Advanced Field Types
    case "email":
      return (
        <Input 
          {...commonProps} 
          prefix={<i className="ri-mail-line" />}
          placeholder="email@example.com"
        />
      );
    
    case "phone":
      return (
        <Input 
          {...commonProps} 
          prefix={<i className="ri-phone-line" />}
          placeholder="+1 (555) 123-4567"
        />
      );
    
    case "url":
      return (
        <Input 
          {...commonProps} 
          prefix={<i className="ri-link" />}
          placeholder="https://example.com"
        />
      );
    
    case "password":
      return <Input.Password {...commonProps} placeholder="••••••••" />;
    
    case "currency":
      return (
        <InputNumber 
          {...commonProps} 
          prefix={<i className="ri-money-dollar-circle-line" />}
          precision={2}
          placeholder="0.00"
        />
      );
    
    case "daterange":
      return <DatePicker.RangePicker {...commonProps} />;
    
    case "datetime":
      return <DatePicker {...commonProps} showTime />;
    
    case "multiselect":
      return (
        <Select {...commonProps} mode="multiple" maxTagCount="responsive">
          {component.options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    
    case "checkboxgroup":
      return (
        <Checkbox.Group {...commonProps}>
          {component.options?.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      );

    // File & Media Components
    case "imageupload":
      return (
        <Upload {...commonProps} listType="picture-card" disabled>
          <div style={{ fontSize: "12px", textAlign: "center" }}>
            + Upload
          </div>
        </Upload>
      );
    
    case "dragger":
      const { Dragger } = Upload;
      return (
        <Dragger {...commonProps} disabled style={{ padding: "8px" }}>
          <p className="ant-upload-drag-icon">
            <i className="ri-inbox-line" style={{ fontSize: "24px" }} />
          </p>
          <p style={{ fontSize: "12px", margin: 0 }}>Drag & Drop</p>
        </Dragger>
      );

    default:
      return null;
  }
};

export default DataEntryComponents;