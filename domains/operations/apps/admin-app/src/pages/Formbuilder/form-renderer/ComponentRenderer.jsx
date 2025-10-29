import React from "react";
import {
  Input,
  Select,
  Radio,
  Checkbox,
  Form,
  DatePicker,
  InputNumber,
  Switch,
  Rate,
  Slider,
  Upload,
  Button,
  Tabs,
  Card,
  Collapse,
  AutoComplete,
  Cascader,
  ColorPicker,
  Mentions,
  TimePicker,
  Transfer,
  TreeSelect,
  Avatar,
  Badge,
  Calendar,
  Carousel,
  Descriptions,
  Empty,
  Image,
  List,
  Tag,
  Timeline,
  Tree,
  Table,
  Alert,
  Progress,
  Skeleton,
  Spin,
  Breadcrumb,
  Menu,
  Pagination,
  Steps,
  Divider,
  Space,
  Typography,
} from "antd";
import { 
  UploadOutlined, 
  UserOutlined, 
  MailOutlined, 
  MobileOutlined, 
  LinkOutlined,
  DollarOutlined,
  InboxOutlined 
} from "@ant-design/icons";
import { SelectableComponent } from "../components/properties";
import { EmbeddedGalleryView } from "../components/views/GalleryView/EmbeddedGalleryView";
import { EmbeddedListView } from "../components/views/ListView/EmbeddedListView";
import { EmbeddedSheetView } from "../components/views/SheetView/EmbeddedSheetView";
import {
  // Container constants removed
} from "../constants";

const { TextArea } = Input;
const { Option } = Select;

const ComponentRenderer = ({ component, value, onChange, formInstance }) => {
  if (!component) {
    return <div style={{ color: "red" }}>Component not found</div>;
  }

  // Extract validation rules from component
  const getValidationRules = () => {
    const rules = [];

    if (component.validation?.required) {
      rules.push({
        required: true,
        message:
          component.validation.message ||
          `${component.label || "Field"} is required`,
      });
    }

    if (component.validation?.pattern) {
      rules.push({
        pattern: new RegExp(component.validation.pattern),
        message: component.validation.patternMessage || "Invalid format",
      });
    }

    if (component.validation?.min !== undefined) {
      rules.push({
        min: component.validation.min,
        message: `Minimum length is ${component.validation.min}`,
      });
    }

    if (component.validation?.max !== undefined) {
      rules.push({
        max: component.validation.max,
        message: `Maximum length is ${component.validation.max}`,
      });
    }

    return rules;
  };

  // Get form item props
  const getFormItemProps = () => {
    return {
      label: component.label,
      name: component.name || component.id,
      rules: getValidationRules(),
      tooltip: component.tooltip,
      extra: component.extra,
      hasFeedback: component.styling?.hasFeedback,
      validateStatus: component.styling?.validateStatus,
      help: component.styling?.help,
      ...component.formItemProps,
    };
  };

  // Get common component props
  const getCommonProps = () => {
    return {
      placeholder: component.placeholder,
      disabled: component.styling?.disabled || false,
      size: component.styling?.size || "middle",
      style: {
        width: "100%",
        ...component.styling?.style,
      },
      ...component.componentProps,
    };
  };

  // Render different component types
  const renderComponent = () => {
    switch (component.type) {
      case "input":
        return (
          <Input
            {...getCommonProps()}
            allowClear={component.styling?.allowClear}
            prefix={component.styling?.prefix}
            suffix={component.styling?.suffix}
            addonBefore={component.styling?.addonBefore}
            addonAfter={component.styling?.addonAfter}
            maxLength={component.validation?.max}
            showCount={component.styling?.showCount}
          />
        );

      case "textarea":
        return (
          <TextArea
            {...getCommonProps()}
            rows={component.styling?.rows || 4}
            autoSize={component.styling?.autoSize}
            allowClear={component.styling?.allowClear}
            maxLength={component.validation?.max}
            showCount={component.styling?.showCount}
          />
        );

      case "select":
        return (
          <Select
            {...getCommonProps()}
            mode={component.styling?.mode}
            allowClear={component.styling?.allowClear}
            showSearch={component.styling?.showSearch}
            filterOption={component.styling?.filterOption}
            loading={component.styling?.loading}
            maxTagCount={component.styling?.maxTagCount}
          >
            {(component.options || []).map((option) => (
              <Option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "radio":
        return (
          <Radio.Group
            {...getCommonProps()}
            buttonStyle={component.styling?.buttonStyle}
            optionType={component.styling?.optionType}
          >
            {(component.options || []).map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                style={{
                  display:
                    component.styling?.direction === "horizontal"
                      ? "inline-block"
                      : "block",
                  marginBottom:
                    component.styling?.direction === "horizontal" ? 0 : "8px",
                }}
              >
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case "checkbox":
        if (component.options && component.options.length > 0) {
          // Checkbox group
          return (
            <Checkbox.Group {...getCommonProps()} options={component.options} />
          );
        } else {
          // Single checkbox
          return (
            <Checkbox
              {...getCommonProps()}
              checked={value}
              onChange={(e) => onChange && onChange(e.target.checked)}
            >
              {component.text || component.label}
            </Checkbox>
          );
        }

      case "number":
        return (
          <InputNumber
            {...getCommonProps()}
            min={component.validation?.min}
            max={component.validation?.max}
            step={component.styling?.step}
            precision={component.styling?.precision}
            formatter={component.styling?.formatter}
            parser={component.styling?.parser}
            controls={component.styling?.controls}
            keyboard={component.styling?.keyboard}
          />
        );

      case "date":
        return (
          <DatePicker
            {...getCommonProps()}
            format={component.styling?.format}
            picker={component.styling?.picker}
            showTime={component.styling?.showTime}
            allowClear={component.styling?.allowClear}
            disabledDate={component.styling?.disabledDate}
          />
        );

      case "switch":
        return (
          <Switch
            {...getCommonProps()}
            checkedChildren={component.styling?.checkedChildren}
            unCheckedChildren={component.styling?.unCheckedChildren}
            loading={component.styling?.loading}
          />
        );

      case "rate":
        return (
          <Rate
            {...getCommonProps()}
            count={component.styling?.count || 5}
            allowHalf={component.styling?.allowHalf}
            allowClear={component.styling?.allowClear}
            character={component.styling?.character}
            tooltips={component.styling?.tooltips}
          />
        );

      case "slider":
        return (
          <Slider
            {...getCommonProps()}
            min={component.validation?.min || 0}
            max={component.validation?.max || 100}
            step={component.styling?.step}
            range={component.styling?.range}
            marks={component.styling?.marks}
            dots={component.styling?.dots}
            included={component.styling?.included}
            reverse={component.styling?.reverse}
            vertical={component.styling?.vertical}
            tooltipVisible={component.styling?.tooltipVisible}
            tooltipPlacement={component.styling?.tooltipPlacement}
          />
        );

      case "upload":
        return (
          <Upload
            {...getCommonProps()}
            action={component.styling?.action}
            listType={component.styling?.listType}
            multiple={component.styling?.multiple}
            accept={component.styling?.accept}
            beforeUpload={component.styling?.beforeUpload}
            customRequest={component.styling?.customRequest}
            showUploadList={component.styling?.showUploadList}
            maxCount={component.styling?.maxCount}
          >
            <Button icon={<UploadOutlined />}>
              {component.styling?.uploadText || "Click to Upload"}
            </Button>
          </Upload>
        );

      // Additional Data Entry Components
      case "autocomplete":
        return (
          <AutoComplete
            {...getCommonProps()}
            options={component.options || []}
            allowClear={component.styling?.allowClear}
            backfill={component.styling?.backfill}
            filterOption={component.styling?.filterOption}
          />
        );

      case "cascader":
        return (
          <Cascader
            {...getCommonProps()}
            options={component.options || []}
            allowClear={component.styling?.allowClear}
            showSearch={component.styling?.showSearch}
            multiple={component.styling?.multiple}
            changeOnSelect={component.styling?.changeOnSelect}
            expandTrigger={component.styling?.expandTrigger}
          />
        );

      case "colorpicker":
        return (
          <ColorPicker
            {...getCommonProps()}
            format={component.styling?.format}
            showText={component.styling?.showText}
            allowClear={component.styling?.allowClear}
            defaultValue={component.defaultValue}
          />
        );

      case "mentions":
        return (
          <Mentions
            {...getCommonProps()}
            rows={component.styling?.rows}
            allowClear={component.styling?.allowClear}
            autoSize={component.styling?.autoSize}
            options={component.options || []}
          />
        );

      case "timepicker":
        return (
          <TimePicker
            {...getCommonProps()}
            format={component.styling?.format}
            use12Hours={component.styling?.use12Hours}
            allowClear={component.styling?.allowClear}
            hourStep={component.styling?.hourStep}
            minuteStep={component.styling?.minuteStep}
            secondStep={component.styling?.secondStep}
          />
        );

      case "transfer":
        return (
          <Transfer
            {...getCommonProps()}
            dataSource={component.dataSource || []}
            targetKeys={component.targetKeys || []}
            showSearch={component.styling?.showSearch}
            showSelectAll={component.styling?.showSelectAll}
            oneWay={component.styling?.oneWay}
            titles={component.styling?.titles}
            operations={component.styling?.operations}
            render={(item) => item.title}
          />
        );

      case "treeselect":
        return (
          <TreeSelect
            {...getCommonProps()}
            treeData={component.treeData || []}
            allowClear={component.styling?.allowClear}
            showSearch={component.styling?.showSearch}
            multiple={component.styling?.multiple}
            treeCheckable={component.styling?.treeCheckable}
            treeDefaultExpandAll={component.styling?.treeDefaultExpandAll}
          />
        );

      // Container components removed

      // Data Display Components
      case "avatar":
        return (
          <Avatar
            size={component.styling?.size}
            shape={component.styling?.shape}
            src={component.src || undefined}
            alt={component.alt}
            icon={component.styling?.icon ? <UserOutlined /> : undefined}
          />
        );

      case "badge":
        return (
          <Badge
            count={component.styling?.count}
            showZero={component.styling?.showZero}
            overflowCount={component.styling?.overflowCount}
            dot={component.styling?.dot}
            status={component.styling?.status}
          >
            <div style={{ padding: "8px 16px", background: "#f0f0f0" }}>
              {component.text || "Badge Content"}
            </div>
          </Badge>
        );

      case "calendar":
        return (
          <Calendar
            fullscreen={component.styling?.fullscreen}
            mode={component.styling?.mode}
            style={{ border: "1px solid #d9d9d9", borderRadius: "6px" }}
          />
        );

      case "carousel":
        return (
          <Carousel
            autoplay={component.styling?.autoplay}
            dots={component.styling?.dots}
            infinite={component.styling?.infinite}
            speed={component.styling?.speed}
          >
            {(component.items || []).map((item, index) => (
              <div key={item.id || index}>
                <div
                  style={{
                    height: "160px",
                    color: "#fff",
                    lineHeight: "160px",
                    textAlign: "center",
                    background: item.background || "#364d79",
                  }}
                >
                  {item.content}
                </div>
              </div>
            ))}
          </Carousel>
        );

      case "descriptions":
        return (
          <Descriptions
            title={component.title}
            bordered={component.styling?.bordered}
            column={component.styling?.column}
            size={component.styling?.size}
            layout={component.styling?.layout}
          >
            {(component.items || []).map((item) => (
              <Descriptions.Item key={item.key} label={item.label}>
                {item.children}
              </Descriptions.Item>
            ))}
          </Descriptions>
        );

      case "empty":
        return (
          <Empty
            image={component.styling?.image}
            imageStyle={component.styling?.imageStyle}
            description={component.description}
          />
        );

      case "image":
        return (
          <Image
            width={component.styling?.width}
            height={component.styling?.height}
            src={component.src || undefined}
            alt={component.alt}
            preview={component.styling?.preview}
            fallback={component.styling?.fallback}
          />
        );

      case "list":
        return (
          <List
            header={component.header}
            footer={component.footer}
            bordered={component.styling?.bordered}
            split={component.styling?.split}
            size={component.styling?.size}
            itemLayout={component.styling?.itemLayout}
            dataSource={component.dataSource || []}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        );

      case "tag":
        return (
          <Tag
            color={component.styling?.color}
            closable={component.styling?.closable}
            bordered={component.styling?.bordered}
          >
            {component.text}
          </Tag>
        );

      case "timeline":
        return (
          <Timeline
            mode={component.styling?.mode}
            pending={component.styling?.pending}
            reverse={component.styling?.reverse}
            items={component.items || []}
          />
        );

      case "tree":
        return (
          <Tree
            treeData={component.treeData || []}
            showLine={component.styling?.showLine}
            showIcon={component.styling?.showIcon}
            checkable={component.styling?.checkable}
            selectable={component.styling?.selectable}
            multiple={component.styling?.multiple}
          />
        );

      case "table":
        return (
          <Table
            columns={component.columns || []}
            dataSource={component.dataSource || []}
            bordered={component.styling?.bordered}
            size={component.styling?.size}
            pagination={component.styling?.pagination}
            scroll={component.styling?.scroll}
          />
        );

      // Feedback Components
      case "alert":
        return (
          <Alert
            message={component.message}
            description={component.description}
            type={component.styling?.type}
            showIcon={component.styling?.showIcon}
            closable={component.styling?.closable}
            banner={component.styling?.banner}
          />
        );

      case "progress":
        return (
          <Progress
            percent={component.percent}
            type={component.styling?.type}
            status={component.styling?.status}
            showInfo={component.styling?.showInfo}
            strokeColor={component.styling?.strokeColor}
            strokeWidth={component.styling?.strokeWidth}
          />
        );

      case "skeleton":
        return (
          <Skeleton
            active={component.styling?.active}
            avatar={component.styling?.avatar}
            paragraph={component.styling?.paragraph}
            title={component.styling?.title}
            loading={component.loading}
          />
        );

      case "spin":
        return (
          <Spin
            size={component.styling?.size}
            spinning={component.styling?.spinning}
            tip={component.tip}
          >
            <div style={{ padding: "20px", background: "#f0f0f0" }}>
              Content being loaded...
            </div>
          </Spin>
        );

      // Navigation Components
      case "breadcrumb":
        return (
          <Breadcrumb
            separator={component.styling?.separator}
            items={component.items || []}
          />
        );

      case "menu":
        const menuProps = {
          mode: component.styling?.mode,
          theme: component.styling?.theme,
          items: component.items || [],
        };

        // Only add inlineCollapsed if mode is inline
        if (
          component.styling?.mode === "inline" &&
          component.styling?.inlineCollapsed !== undefined
        ) {
          menuProps.inlineCollapsed = component.styling.inlineCollapsed;
        }

        return <Menu {...menuProps} />;

      case "pagination":
        return (
          <Pagination
            current={component.current}
            total={component.total}
            pageSize={component.pageSize}
            size={component.styling?.size}
            showSizeChanger={component.styling?.showSizeChanger}
            showQuickJumper={component.styling?.showQuickJumper}
            showTotal={
              component.styling?.showTotal
                ? (total, range) => `${range[0]}-${range[1]} of ${total} items`
                : undefined
            }
          />
        );

      case "steps":
        return (
          <Steps
            current={component.current}
            type={component.styling?.type}
            size={component.styling?.size}
            direction={component.styling?.direction}
            labelPlacement={component.styling?.labelPlacement}
            items={component.items || []}
          />
        );

      // Layout Components
      case "divider":
        return (
          <Divider
            type={component.styling?.type}
            orientation={component.styling?.orientation}
            orientationMargin={component.styling?.orientationMargin}
            dashed={component.styling?.dashed}
            plain={component.styling?.plain}
          >
            {component.children}
          </Divider>
        );

      case "space":
        return (
          <Space
            direction={component.styling?.direction}
            size={component.styling?.size}
            align={component.styling?.align}
            wrap={component.styling?.wrap}
          >
            {(component.children || []).map((child, index) => (
              <Button key={index}>{child.content}</Button>
            ))}
          </Space>
        );

      // General Components
      case "button":
        return (
          <Button
            type={component.styling?.type}
            size={component.styling?.size}
            shape={component.styling?.shape}
            block={component.styling?.block}
            danger={component.styling?.danger}
            ghost={component.styling?.ghost}
            loading={component.styling?.loading}
            htmlType={component.htmlType}
            icon={component.styling?.icon}
          >
            {component.text}
          </Button>
        );

      case "typography":
        const { Title, Text, Paragraph } = Typography;
        const TypographyComponent =
          component.component === "title"
            ? Title
            : component.component === "paragraph"
            ? Paragraph
            : Text;

        return (
          <TypographyComponent
            level={component.styling?.level}
            type={component.styling?.type}
            disabled={component.styling?.disabled}
            mark={component.styling?.mark}
            code={component.styling?.code}
            keyboard={component.styling?.keyboard}
            underline={component.styling?.underline}
            delete={component.styling?.delete}
            strong={component.styling?.strong}
            italic={component.styling?.italic}
          >
            {component.text}
          </TypographyComponent>
        );

      // Advanced Field Types
      case "email":
        return (
          <Input
            {...getCommonProps()}
            type="email"
            prefix={component.styling?.prefix === "MailOutlined" ? <MailOutlined /> : component.styling?.prefix}
            allowClear={component.styling?.allowClear}
          />
        );

      case "phone":
        return (
          <Input
            {...getCommonProps()}
            prefix={component.styling?.prefix === "PhoneOutlined" ? <MobileOutlined /> : component.styling?.prefix}
            allowClear={component.styling?.allowClear}
          />
        );

      case "url":
        return (
          <Input
            {...getCommonProps()}
            type="url"
            prefix={component.styling?.prefix === "LinkOutlined" ? <LinkOutlined /> : component.styling?.prefix}
            allowClear={component.styling?.allowClear}
          />
        );

      case "password":
        return (
          <Input.Password
            {...getCommonProps()}
            visibilityToggle={component.styling?.visibilityToggle}
          />
        );

      case "currency":
        return (
          <InputNumber
            {...getCommonProps()}
            prefix={component.styling?.prefix || "$"}
            precision={component.styling?.precision || 2}
            formatter={value => component.styling?.formatter === 'currency' ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            min={component.validation?.min}
            max={component.validation?.max}
          />
        );

      case "daterange":
        return (
          <DatePicker.RangePicker
            {...getCommonProps()}
            format={component.styling?.format}
            allowClear={component.styling?.allowClear}
          />
        );

      case "datetime":
        return (
          <DatePicker
            {...getCommonProps()}
            showTime={component.styling?.showTime}
            format={component.styling?.format}
            allowClear={component.styling?.allowClear}
          />
        );

      case "multiselect":
        return (
          <Select
            {...getCommonProps()}
            mode="multiple"
            allowClear={component.styling?.allowClear}
            showSearch={component.styling?.showSearch}
            maxTagCount={component.styling?.maxTagCount}
          >
            {(component.options || []).map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "checkboxgroup":
        return (
          <Checkbox.Group
            {...getCommonProps()}
          >
            {(component.options || []).map((option) => (
              <Checkbox
                key={option.value}
                value={option.value}
                style={{
                  display: component.styling?.direction === "horizontal" ? "inline-block" : "block",
                  marginBottom: component.styling?.direction === "horizontal" ? 0 : "8px",
                }}
              >
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      // File & Media Components
      case "imageupload":
        return (
          <Upload
            {...getCommonProps()}
            listType="picture-card"
            action={component.action}
            accept={component.styling?.accept}
            multiple={component.styling?.multiple}
            maxCount={component.styling?.maxCount}
            showUploadList={component.styling?.showUploadList}
          >
            {component.text || "+ Upload Image"}
          </Upload>
        );

      case "dragger":
        const { Dragger } = Upload;
        return (
          <Dragger
            {...getCommonProps()}
            action={component.action}
            accept={component.styling?.accept}
            multiple={component.styling?.multiple}
            showUploadList={component.styling?.showUploadList}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{component.text}</p>
            <p className="ant-upload-hint">{component.hint}</p>
          </Dragger>
        );

      // Data Lookup Components
      case "lookup":
        return (
          <Select
            {...getCommonProps()}
            showSearch={component.styling?.showSearch}
            allowClear={component.styling?.allowClear}
            filterOption={component.styling?.filterOption}
            loading={component.loading}
          >
            {/* Dynamic options would be loaded from API */}
            <Option value="sample1">Sample Item 1</Option>
            <Option value="sample2">Sample Item 2</Option>
          </Select>
        );

      case "reference":
        return (
          <Select
            {...getCommonProps()}
            showSearch={component.styling?.showSearch}
            allowClear={component.styling?.allowClear}
          >
            {/* Dynamic options would be loaded from reference table */}
            <Option value="ref1">Reference 1</Option>
            <Option value="ref2">Reference 2</Option>
          </Select>
        );

      // Widget Components (simplified for form rendering)
      case "qrcode":
        return (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ 
              border: "1px solid #d9d9d9", 
              padding: "16px", 
              borderRadius: "4px",
              background: "#fafafa"
            }}>
              QR Code: {component.value || "No value"}
            </div>
          </div>
        );

      case "barcode":
        return (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <div style={{ 
              border: "1px solid #d9d9d9", 
              padding: "16px", 
              borderRadius: "4px",
              background: "#fafafa",
              fontFamily: "monospace"
            }}>
              Barcode: {component.value || "123456789"}
            </div>
          </div>
        );

      case "signature":
        return (
          <div style={{ 
            border: "1px dashed #d9d9d9",
            borderRadius: "4px",
            padding: "32px",
            textAlign: "center",
            background: "#fafafa",
            minHeight: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ color: "#999" }}>✍️ Digital Signature Area</span>
          </div>
        );

      case "location":
        return (
          <div style={{ 
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            padding: "32px",
            textAlign: "center",
            background: "#f0f2f5",
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span>📍 Location: {component.defaultLocation ? `${component.defaultLocation.lat}, ${component.defaultLocation.lng}` : "Click to select"}</span>
          </div>
        );

      // ACCORDION_CONTAINER case removed

      // All container cases removed

      // View Components
      case "gallery_view":
        return (
          <EmbeddedGalleryView
            config={component.config}
            isPreview={true}
            {...component.styling}
          />
        );

      case "list_view":
        return (
          <EmbeddedListView
            config={component.config}
            isPreview={true}
            {...component.styling}
          />
        );

      case "sheet_view":
        return (
          <EmbeddedSheetView
            config={component.config}
            isPreview={true}
            {...component.styling}
          />
        );

      case "view":
      case "embedded_view":
        // Render the actual view based on viewConfig.type
        if (component.viewConfig && component.viewConfig.type) {
          switch (component.viewConfig.type) {
            case "gallery":
              return (
                <EmbeddedGalleryView
                  config={component.viewConfig.config}
                  isPreview={true}
                  {...component.styling}
                />
              );
            case "list":
              return (
                <EmbeddedListView
                  config={component.viewConfig.config}
                  isPreview={true}
                  {...component.styling}
                />
              );
            case "sheet":
              return (
                <EmbeddedSheetView
                  config={component.viewConfig.config}
                  isPreview={true}
                  {...component.styling}
                />
              );
            default:
              // Fallback for unknown view types
              return (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#666",
                    background: "#fafafa",
                    border: "2px dashed #d9d9d9",
                    borderRadius: "4px",
                    minHeight: "120px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    ...component.styling
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "8px", color: "#722ed1" }}>📊</div>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    {component.label || component.name || "Embedded View"}
                  </div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>
                    Unsupported view type: {component.viewConfig.type}
                  </div>
                </div>
              );
          }
        }
        
        // Fallback for views without proper viewConfig
        return (
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              color: "#666",
              background: "#fafafa",
              border: "2px dashed #d9d9d9",
              borderRadius: "4px",
              minHeight: "120px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              ...component.styling
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px", color: "#722ed1" }}>📊</div>
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {component.label || component.name || "Embedded View"}
            </div>
            <div style={{ fontSize: "12px", marginTop: "4px" }}>
              {component.viewConfig?.type ? `Type: ${component.viewConfig.type}` : "Custom View Component"}
            </div>
          </div>
        );

      default:
        return (
          <div
            style={{
              padding: "8px",
              color: "#666",
              border: "1px dashed #d9d9d9",
              borderRadius: "4px",
            }}
          >
            Unknown component type: {component.type}
          </div>
        );
    }
  };

  return (
    <SelectableComponent component={component}>
      <Form.Item {...getFormItemProps()}>{renderComponent()}</Form.Item>
    </SelectableComponent>
  );
};

export default ComponentRenderer;
