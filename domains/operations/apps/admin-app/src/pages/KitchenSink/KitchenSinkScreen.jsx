import { useState } from 'react';
import {
    BaseButton, BaseInput, BaseForm, BaseSelect, BaseTable, BaseSpace, BaseCard,
    BaseTypography, BaseBadge, BaseTag, BaseModal, baseMessage, BaseCheckbox,
    BaseRow, BaseCol, BaseCarousel, BaseMenu, BaseDropdown, BaseTabs, BaseSwitch,
    BaseRadio, BaseInputNumber, BaseTree, BaseList, BaseAvatar, BaseTooltip,
    BasePopover, BasePopconfirm, BaseDrawer, BaseEmpty, BaseDivider, BaseColorPicker,
    BaseFloatButton, BaseFlex, BaseMasonry, BaseSplitter, BaseAnchor, BaseBreadcrumb,
    BasePagination, BaseSteps, BaseAutoComplete, BaseCascader, BaseDatePicker,
    BaseMentions, BaseRate, BaseSlider, BaseTimePicker, BaseTransfer, BaseTreeSelect,
    BaseUpload, BaseCalendar, BaseCollapse, BaseDescriptions, BaseImage, BaseQRCode,
    BaseSegmented, BaseStatistic, BaseTimeline, BaseTour, BaseAlert, baseNotification,
    BaseProgress, BaseResult, BaseSkeleton, BaseSpin, BaseWatermark, BaseAffix,
    BaseLayout,
    ZionixLogo,
    LoadingSpinner, FullScreenLoader, InlineLoader, PageLoader, ThemeSafePageLoader,
    CardTopLoader, NotFoundPage,
    DesktopLayout, DesktopTopBar, DesktopSidebar,
    MobileLayout, MobileHeader, MobileBottomNavigation, MobileMoreMenu, MobileProfileDropdown,
    ResponsiveLayout, ResponsiveLayoutProvider, useResponsiveLayout, NotificationDropdown,
    useTheme,
} from '@zionix-space/design-system';

const { Title, Text, Paragraph } = BaseTypography;
const { Option } = BaseSelect;
const { TextArea } = BaseInput;
const { Item: FormItem } = BaseForm;
const { TabPane } = BaseTabs;
const { Panel } = BaseCollapse;

const KitchenSink = () => {
    const [form] = BaseForm.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [switchChecked, setSwitchChecked] = useState(false);
    const [radioValue, setRadioValue] = useState(1);
    const [sliderValue, setSliderValue] = useState(30);
    const [rateValue, setRateValue] = useState(3);
    const [currentStep, setCurrentStep] = useState(0);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
    const [showCardTopLoader, setShowCardTopLoader] = useState(false);
    const theme = useTheme();

    const tableData = [
        { key: '1', name: 'John Doe', age: 32, address: 'New York' },
        { key: '2', name: 'Jane Smith', age: 28, address: 'London' },
        { key: '3', name: 'Bob Johnson', age: 45, address: 'Sydney' },
    ];

    const tableColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
    ];

    const treeData = [
        {
            title: 'Parent 1',
            key: '0-0',
            children: [
                { title: 'Child 1-1', key: '0-0-0' },
                { title: 'Child 1-2', key: '0-0-1' },
            ],
        },
        { title: 'Parent 2', key: '0-1' },
    ];

    const timelineItems = [
        { children: 'Create a services site 2015-09-01' },
        { children: 'Solve initial network problems 2015-09-01' },
        { children: 'Technical testing 2015-09-01' },
    ];

    const menuItems = [
        { key: '1', label: 'Menu Item 1', icon: <i className="ri-home-line" /> },
        { key: '2', label: 'Menu Item 2', icon: <i className="ri-settings-line" /> },
        { key: '3', label: 'Menu Item 3', icon: <i className="ri-user-line" /> },
    ];

    const dropdownItems = [
        { key: '1', label: 'Action 1', icon: <i className="ri-edit-line" /> },
        { key: '2', label: 'Action 2', icon: <i className="ri-delete-bin-line" /> },
        { key: '3', label: 'Action 3', icon: <i className="ri-download-line" /> },
    ];

    return (
        <div style={{ minHeight: '100vh' }}>
            <BaseSpace orientation="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <BaseCard>
                    <BaseFlex justify="space-between" align="center">
                        <div>
                            <Title level={1}>Zionix Design System - Kitchen Sink</Title>
                            <Text type="secondary">
                                Comprehensive showcase of all components and their functionalities
                            </Text>
                        </div>
                        <ZionixLogo size="large" />
                    </BaseFlex>
                </BaseCard>

                {/* Brand Components */}
                <BaseCard title="Brand Components">
                    <BaseSpace size="large">
                        <div>
                            <Text strong>Logo Sizes:</Text>
                            <BaseSpace>
                                <ZionixLogo size="small" />
                                <ZionixLogo size="medium" />
                                <ZionixLogo size="large" />
                            </BaseSpace>
                        </div>
                    </BaseSpace>
                </BaseCard>

                {/* Buttons */}
                <BaseCard title="Buttons">
                    <BaseSpace wrap>
                        <BaseButton type="primary">Primary</BaseButton>
                        <BaseButton>Default</BaseButton>
                        <BaseButton type="dashed">Dashed</BaseButton>
                        <BaseButton type="text">Text</BaseButton>
                        <BaseButton type="link">Link</BaseButton>
                        <BaseButton danger>Danger</BaseButton>
                        <BaseButton type="primary" loading>Loading</BaseButton>
                        <BaseButton type="primary" disabled>Disabled</BaseButton>
                        <BaseButton type="primary" icon={<i className="ri-add-line" />}>With Icon</BaseButton>
                        <BaseButton type="primary" shape="circle" icon={<i className="ri-search-line" />} />
                        <BaseButton type="primary" shape="round">Round</BaseButton>
                        <BaseButton size="large">Large</BaseButton>
                        <BaseButton size="small">Small</BaseButton>
                    </BaseSpace>
                </BaseCard>

                {/* Typography */}
                <BaseCard title="Typography">
                    <BaseSpace orientation="vertical">
                        <Title level={1}>h1. Heading</Title>
                        <Title level={2}>h2. Heading</Title>
                        <Title level={3}>h3. Heading</Title>
                        <Title level={4}>h4. Heading</Title>
                        <Title level={5}>h5. Heading</Title>
                        <Text>Default Text</Text>
                        <Text type="secondary">Secondary Text</Text>
                        <Text type="success">Success Text</Text>
                        <Text type="warning">Warning Text</Text>
                        <Text type="danger">Danger Text</Text>
                        <Text strong>Strong Text</Text>
                        <Text italic>Italic Text</Text>
                        <Text underline>Underline Text</Text>
                        <Text delete>Delete Text</Text>
                        <Text code>Code Text</Text>
                        <Paragraph>
                            This is a paragraph with multiple lines of text to demonstrate the paragraph component.
                            It can contain longer content and will wrap appropriately.
                        </Paragraph>
                    </BaseSpace>
                </BaseCard>

                {/* Form Components */}
                <BaseCard title="Form Components">
                    <BaseForm form={form} layout="vertical">
                        <BaseRow gutter={16}>
                            <BaseCol span={12}>
                                <FormItem label="Input" name="input">
                                    <BaseInput placeholder="Enter text" />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Input with Icon" name="inputIcon">
                                    <BaseInput prefix={<i className="ri-user-line" />} placeholder="Username" />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Password" name="password">
                                    <BaseInput.Password placeholder="Enter password" />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="TextArea" name="textarea">
                                    <TextArea rows={4} placeholder="Enter description" />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Select" name="select">
                                    <BaseSelect placeholder="Select option">
                                        <Option value="1">Option 1</Option>
                                        <Option value="2">Option 2</Option>
                                        <Option value="3">Option 3</Option>
                                    </BaseSelect>
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Input Number" name="number">
                                    <BaseInputNumber style={{ width: '100%' }} min={0} max={100} />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Date Picker" name="date">
                                    <BaseDatePicker style={{ width: '100%' }} />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Time Picker" name="time">
                                    <BaseTimePicker style={{ width: '100%' }} />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={24}>
                                <FormItem label="Checkbox" name="checkbox" valuePropName="checked">
                                    <BaseCheckbox>I agree to terms and conditions</BaseCheckbox>
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={24}>
                                <FormItem label="Radio Group" name="radio">
                                    <BaseRadio.Group onChange={(e) => setRadioValue(e.target.value)} value={radioValue}>
                                        <BaseRadio value={1}>Option A</BaseRadio>
                                        <BaseRadio value={2}>Option B</BaseRadio>
                                        <BaseRadio value={3}>Option C</BaseRadio>
                                    </BaseRadio.Group>
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Switch">
                                    <BaseSwitch checked={switchChecked} onChange={setSwitchChecked} />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Slider">
                                    <BaseSlider value={sliderValue} onChange={setSliderValue} />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Rate">
                                    <BaseRate value={rateValue} onChange={setRateValue} />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={12}>
                                <FormItem label="Color Picker" name="color">
                                    <BaseColorPicker />
                                </FormItem>
                            </BaseCol>
                            <BaseCol span={24}>
                                <FormItem label="Upload">
                                    <BaseUpload>
                                        <BaseButton icon={<i className="ri-upload-line" />}>Click to Upload</BaseButton>
                                    </BaseUpload>
                                </FormItem>
                            </BaseCol>
                        </BaseRow>
                    </BaseForm>
                </BaseCard>

                {/* Data Display - Table */}
                <BaseCard title="Table">
                    <BaseTable dataSource={tableData} columns={tableColumns} pagination={{ pageSize: 5 }} />
                </BaseCard>

                {/* Tags and Badges */}
                <BaseCard title="Tags & Badges">
                    <BaseSpace wrap>
                        <BaseTag>Default</BaseTag>
                        <BaseTag color="success">Success</BaseTag>
                        <BaseTag color="processing">Processing</BaseTag>
                        <BaseTag color="error">Error</BaseTag>
                        <BaseTag color="warning">Warning</BaseTag>
                        <BaseTag closable>Closable</BaseTag>
                        <BaseTag icon={<i className="ri-check-line" />}>With Icon</BaseTag>
                        <BaseBadge count={5}>
                            <BaseButton>Notifications</BaseButton>
                        </BaseBadge>
                        <BaseBadge dot>
                            <BaseButton>Messages</BaseButton>
                        </BaseBadge>
                        <BaseBadge status="success" text="Success" />
                        <BaseBadge status="error" text="Error" />
                        <BaseBadge status="processing" text="Processing" />
                    </BaseSpace>
                </BaseCard>

                {/* Alerts */}
                <BaseCard title="Alerts">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <BaseAlert message="Success Alert" type="success" showIcon />
                        <BaseAlert message="Info Alert" type="info" showIcon />
                        <BaseAlert message="Warning Alert" type="warning" showIcon closable />
                        <BaseAlert message="Error Alert" type="error" showIcon closable />
                        <BaseAlert
                            message="Alert with Description"
                            description="This is a detailed description of the alert message."
                            type="info"
                            showIcon
                        />
                    </BaseSpace>
                </BaseCard>

                {/* Progress */}
                <BaseCard title="Progress">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <BaseProgress percent={30} />
                        <BaseProgress percent={50} status="active" />
                        <BaseProgress percent={70} status="exception" />
                        <BaseProgress percent={100} />
                        <BaseProgress type="circle" percent={75} />
                        <BaseProgress type="dashboard" percent={75} />
                    </BaseSpace>
                </BaseCard>

                {/* Statistic */}
                <BaseCard title="Statistics">
                    <BaseRow gutter={16}>
                        <BaseCol span={8}>
                            <BaseStatistic title="Active Users" value={112893} prefix={<i className="ri-user-line" />} />
                        </BaseCol>
                        <BaseCol span={8}>
                            <BaseStatistic title="Account Balance" value={112893} precision={2} prefix="$" />
                        </BaseCol>
                        <BaseCol span={8}>
                            <BaseStatistic title="Active" value={93} suffix="/ 100" />
                        </BaseCol>
                    </BaseRow>
                </BaseCard>

                {/* Tabs */}
                <BaseCard title="Tabs">
                    <BaseTabs defaultActiveKey="1">
                        <TabPane tab={<span><i className="ri-home-line" /> Tab 1</span>} key="1">
                            Content of Tab Pane 1
                        </TabPane>
                        <TabPane tab={<span><i className="ri-settings-line" /> Tab 2</span>} key="2">
                            Content of Tab Pane 2
                        </TabPane>
                        <TabPane tab={<span><i className="ri-user-line" /> Tab 3</span>} key="3">
                            Content of Tab Pane 3
                        </TabPane>
                    </BaseTabs>
                </BaseCard>

                {/* Collapse */}
                <BaseCard title="Collapse">
                    <BaseCollapse defaultActiveKey={['1']}>
                        <Panel header="Panel 1" key="1">
                            <p>Content of panel 1</p>
                        </Panel>
                        <Panel header="Panel 2" key="2">
                            <p>Content of panel 2</p>
                        </Panel>
                        <Panel header="Panel 3" key="3">
                            <p>Content of panel 3</p>
                        </Panel>
                    </BaseCollapse>
                </BaseCard>

                {/* Steps */}
                <BaseCard title="Steps (Progress Indicator)">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">Current Step: {currentStep + 1} of 3</Text>
                        <BaseSteps
                            current={currentStep}
                            items={[
                                { title: 'Finished', description: 'This is a description.' },
                                { title: 'In Progress', description: 'This is a description.' },
                                { title: 'Waiting', description: 'This is a description.' },
                            ]}
                        />
                        <div style={{ marginTop: 24 }}>
                            <BaseSpace>
                                <BaseButton
                                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                >
                                    <i className="ri-arrow-left-line" /> Previous
                                </BaseButton>
                                <BaseButton
                                    type="primary"
                                    onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
                                    disabled={currentStep === 2}
                                >
                                    Next <i className="ri-arrow-right-line" />
                                </BaseButton>
                                <BaseButton onClick={() => setCurrentStep(0)}>
                                    Reset
                                </BaseButton>
                            </BaseSpace>
                        </div>
                        <BaseDivider />
                        <div>
                            <Text strong>Vertical Steps:</Text>
                            <BaseSteps
                                current={1}
                                direction="vertical"
                                style={{ marginTop: 16 }}
                                items={[
                                    { title: 'Step 1', description: 'Completed step' },
                                    { title: 'Step 2', description: 'Current step' },
                                    { title: 'Step 3', description: 'Waiting step' },
                                ]}
                            />
                        </div>
                        <BaseDivider />
                        <div>
                            <Text strong>Small Steps:</Text>
                            <BaseSteps
                                current={1}
                                size="small"
                                style={{ marginTop: 16 }}
                                items={[
                                    { title: 'Login' },
                                    { title: 'Verification' },
                                    { title: 'Pay' },
                                    { title: 'Done' },
                                ]}
                            />
                        </div>
                    </BaseSpace>
                </BaseCard>

                {/* Timeline */}
                <BaseCard title="Timeline">
                    <BaseTimeline items={timelineItems} />
                </BaseCard>

                {/* Tree */}
                <BaseCard title="Tree">
                    <BaseTree treeData={treeData} defaultExpandAll />
                </BaseCard>

                {/* List */}
                <BaseCard title="List">
                    <BaseList
                        dataSource={['Item 1', 'Item 2', 'Item 3', 'Item 4']}
                        renderItem={(item) => (
                            <BaseList.Item
                                actions={[
                                    <a key="edit"><i className="ri-edit-line" /> Edit</a>,
                                    <a key="delete"><i className="ri-delete-bin-line" /> Delete</a>
                                ]}
                            >
                                {item}
                            </BaseList.Item>
                        )}
                    />
                </BaseCard>

                {/* Avatar */}
                <BaseCard title="Avatar">
                    <BaseSpace>
                        <BaseAvatar icon={<i className="ri-user-line" />} />
                        <BaseAvatar>U</BaseAvatar>
                        <BaseAvatar size="large" icon={<i className="ri-user-line" />} />
                        <BaseAvatar size={64} icon={<i className="ri-user-line" />} />
                        <BaseAvatar shape="square" icon={<i className="ri-user-line" />} />
                    </BaseSpace>
                </BaseCard>

                {/* Breadcrumb */}
                <BaseCard title="Breadcrumb">
                    <BaseBreadcrumb>
                        <BaseBreadcrumb.Item><i className="ri-home-line" /> Home</BaseBreadcrumb.Item>
                        <BaseBreadcrumb.Item>Application</BaseBreadcrumb.Item>
                        <BaseBreadcrumb.Item>Kitchen Sink</BaseBreadcrumb.Item>
                    </BaseBreadcrumb>
                </BaseCard>

                {/* Pagination */}
                <BaseCard title="Pagination">
                    <BasePagination defaultCurrent={1} total={50} />
                </BaseCard>

                {/* Menu */}
                <BaseCard title="Menu">
                    <BaseMenu mode="horizontal" items={menuItems} />
                </BaseCard>

                {/* Dropdown */}
                <BaseCard title="Dropdown">
                    <BaseSpace>
                        <BaseDropdown menu={{ items: dropdownItems }}>
                            <BaseButton>
                                Hover me <i className="ri-arrow-down-s-line" />
                            </BaseButton>
                        </BaseDropdown>
                        <BaseDropdown menu={{ items: dropdownItems }} trigger={['click']}>
                            <BaseButton>
                                Click me <i className="ri-arrow-down-s-line" />
                            </BaseButton>
                        </BaseDropdown>
                    </BaseSpace>
                </BaseCard>

                {/* Tooltip & Popover */}
                <BaseCard title="Tooltip, Popover & Popconfirm" style={{ overflow: 'visible' }}>
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <div>
                            <Text strong>Tooltip:</Text>
                            <BaseSpace wrap style={{ marginTop: 8 }}>
                                <BaseTooltip title="Tooltip text">
                                    <BaseButton>Hover for Tooltip</BaseButton>
                                </BaseTooltip>
                                <BaseTooltip title="Top tooltip" placement="top">
                                    <BaseButton>Top</BaseButton>
                                </BaseTooltip>
                                <BaseTooltip title="Right tooltip" placement="right">
                                    <BaseButton>Right</BaseButton>
                                </BaseTooltip>
                                <BaseTooltip title="Bottom tooltip" placement="bottom">
                                    <BaseButton>Bottom</BaseButton>
                                </BaseTooltip>
                                <BaseTooltip title="Left tooltip" placement="left">
                                    <BaseButton>Left</BaseButton>
                                </BaseTooltip>
                            </BaseSpace>
                        </div>
                        <BaseDivider />
                        <div>
                            <Text strong>Popover:</Text>
                            <BaseSpace wrap style={{ marginTop: 8 }}>
                                <BasePopover
                                    content={<div style={{ padding: 8 }}>Popover content with more details</div>}
                                    title="Popover Title"
                                    trigger="click"
                                    open={popoverVisible}
                                    onOpenChange={setPopoverVisible}
                                >
                                    <BaseButton>Click for Popover</BaseButton>
                                </BasePopover>
                                <BasePopover
                                    content={<div style={{ padding: 8 }}>Hover to see this popover</div>}
                                    title="Hover Popover"
                                    trigger="hover"
                                >
                                    <BaseButton>Hover for Popover</BaseButton>
                                </BasePopover>
                            </BaseSpace>
                        </div>
                        <BaseDivider />
                        <div style={{ paddingBottom: 100 }}>
                            <Text strong>Popconfirm (Confirmation Dialog):</Text>
                            <div style={{ marginTop: 8 }}>
                                <BaseSpace wrap>
                                    <BasePopconfirm
                                        title="Are you sure you want to delete this?"
                                        description="This action cannot be undone."
                                        onConfirm={() => baseMessage.success('Confirmed! Item deleted.')}
                                        onCancel={() => baseMessage.info('Cancelled')}
                                        okText="Yes, Delete"
                                        cancelText="No, Cancel"
                                        placement="bottom"
                                    >
                                        <BaseButton danger>Delete with Confirm</BaseButton>
                                    </BasePopconfirm>
                                    <BasePopconfirm
                                        title="Save changes?"
                                        onConfirm={() => baseMessage.success('Changes saved!')}
                                        onCancel={() => baseMessage.info('Not saved')}
                                        okText="Save"
                                        cancelText="Cancel"
                                        placement="bottom"
                                    >
                                        <BaseButton type="primary">Save with Confirm</BaseButton>
                                    </BasePopconfirm>
                                    <BasePopconfirm
                                        title="Are you sure?"
                                        onConfirm={() => baseMessage.success('Action confirmed')}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="bottom"
                                    >
                                        <BaseButton>Simple Confirm</BaseButton>
                                    </BasePopconfirm>
                                </BaseSpace>
                            </div>
                            <BaseAlert
                                style={{ marginTop: 16 }}
                                message="Note"
                                description="Click the buttons above to see confirmation dialogs appear below them."
                                type="info"
                                showIcon
                            />
                        </div>
                    </BaseSpace>
                </BaseCard>

                {/* Modal & Drawer */}
                <BaseCard title="Modal & Drawer">
                    <BaseSpace>
                        <BaseButton type="primary" onClick={() => setModalVisible(true)}>
                            Open Modal
                        </BaseButton>
                        <BaseButton onClick={() => setDrawerVisible(true)}>
                            Open Drawer
                        </BaseButton>
                    </BaseSpace>
                    <BaseModal
                        title="Modal Title"
                        open={modalVisible}
                        onOk={() => setModalVisible(false)}
                        onCancel={() => setModalVisible(false)}
                    >
                        <p>Modal content goes here</p>
                    </BaseModal>
                    <BaseDrawer
                        title="Drawer Title"
                        placement="right"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                    >
                        <p>Drawer content goes here</p>
                    </BaseDrawer>
                </BaseCard>

                {/* Divider */}
                <BaseCard title="Divider">
                    <div>
                        <Text>Text above divider</Text>
                        <BaseDivider />
                        <Text>Text below divider</Text>
                        <BaseDivider orientation="left">Left Text</BaseDivider>
                        <Text>Content</Text>
                        <BaseDivider orientation="right">Right Text</BaseDivider>
                        <Text>Content</Text>
                    </div>
                </BaseCard>

                {/* Empty */}
                <BaseCard title="Empty State">
                    <BaseEmpty description="No data available" />
                </BaseCard>

                {/* Result */}
                <BaseCard title="Result">
                    <BaseResult
                        status="success"
                        title="Successfully Completed!"
                        subTitle="Order number: 2017182818828182881"
                        extra={[
                            <BaseButton type="primary" key="console">
                                Go Console
                            </BaseButton>,
                            <BaseButton key="buy">Buy Again</BaseButton>,
                        ]}
                    />
                </BaseCard>

                {/* Skeleton */}
                <BaseCard title="Skeleton">
                    <BaseSkeleton active />
                </BaseCard>

                {/* Spin */}
                <BaseCard title="Spin (Loading)">
                    <BaseSpace>
                        <BaseSpin />
                        <BaseSpin size="small" />
                        <BaseSpin size="large" />
                    </BaseSpace>
                </BaseCard>

                {/* Loading Spinner */}
                <BaseCard title="Custom Loading Spinner">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <div>
                            <Text strong>LoadingSpinner:</Text>
                            <LoadingSpinner />
                        </div>
                        <div>
                            <Text strong>InlineLoader:</Text>
                            <InlineLoader />
                        </div>
                        <div>
                            <Text strong>PageLoader:</Text>
                            <div style={{ height: 100, position: 'relative' }}>
                                <PageLoader />
                            </div>
                        </div>
                        <div>
                            <Text strong>ThemeSafePageLoader:</Text>
                            <div style={{ height: 100, position: 'relative' }}>
                                <ThemeSafePageLoader />
                            </div>
                        </div>
                    </BaseSpace>
                </BaseCard>

                {/* Global Top Loader */}
                <BaseCard title="Global Top Loader">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <Text>GlobalTopLoader and MicrofrontendLoader components (used for page transitions)</Text>
                        <Text type="secondary">These loaders are typically controlled by routing/navigation events</Text>
                    </BaseSpace>
                </BaseCard>

                {/* Card Top Loader */}
                <BaseCard title="Card Top Loader">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <Text>CardTopLoader component (used for loading states at the top of cards)</Text>
                        <BaseButton
                            type="primary"
                            onClick={() => {
                                setShowCardTopLoader(true);
                                setTimeout(() => setShowCardTopLoader(false), 3000);
                            }}
                        >
                            Show Card Top Loader (3s)
                        </BaseButton>
                        {showCardTopLoader && (
                            <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                                <CardTopLoader />
                                <div style={{ padding: '20px' }}>
                                    <Text>Card content with top loader</Text>
                                </div>
                            </div>
                        )}
                    </BaseSpace>
                </BaseCard>

                {/* Image */}
                <BaseCard title="Image">
                    <BaseImage
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                        placeholder={<BaseSkeleton.Image />}
                    />
                </BaseCard>

                {/* QR Code */}
                <BaseCard title="QR Code">
                    <BaseQRCode value="https://zionix.space" />
                </BaseCard>

                {/* Segmented */}
                <BaseCard title="Segmented">
                    <BaseSegmented options={['Daily', 'Weekly', 'Monthly', 'Yearly']} />
                </BaseCard>

                {/* Descriptions */}
                <BaseCard title="Descriptions">
                    <BaseDescriptions title="User Info" bordered>
                        <BaseDescriptions.Item label="Name">John Doe</BaseDescriptions.Item>
                        <BaseDescriptions.Item label="Phone">1234567890</BaseDescriptions.Item>
                        <BaseDescriptions.Item label="Address">New York, USA</BaseDescriptions.Item>
                    </BaseDescriptions>
                </BaseCard>

                {/* Watermark */}
                <BaseCard title="Watermark">
                    <BaseWatermark content="Zionix">
                        <div style={{ height: 200, background: '#f0f0f0', padding: 20 }}>
                            <Text>Content with watermark</Text>
                        </div>
                    </BaseWatermark>
                </BaseCard>

                {/* Carousel */}
                <BaseCard title="Carousel">
                    <BaseCarousel autoplay>
                        <div style={{ height: 160, background: '#364d79', color: 'white', lineHeight: '160px', textAlign: 'center' }}>
                            <h3>Slide 1</h3>
                        </div>
                        <div style={{ height: 160, background: '#7f4d79', color: 'white', lineHeight: '160px', textAlign: 'center' }}>
                            <h3>Slide 2</h3>
                        </div>
                        <div style={{ height: 160, background: '#4d7979', color: 'white', lineHeight: '160px', textAlign: 'center' }}>
                            <h3>Slide 3</h3>
                        </div>
                    </BaseCarousel>
                </BaseCard>

                {/* Calendar */}
                <BaseCard title="Calendar">
                    <BaseCalendar fullscreen={false} />
                </BaseCard>

                {/* Affix */}
                <BaseCard title="Affix">
                    <BaseAffix offsetTop={120}>
                        <BaseButton type="primary">Affixed Button</BaseButton>
                    </BaseAffix>
                </BaseCard>

                {/* Float Button */}
                <BaseCard title="Float Button">
                    <div style={{ position: 'relative', height: 200 }}>
                        <Text>Scroll to see float button (bottom right)</Text>
                        <BaseFloatButton
                            icon={<i className="ri-arrow-up-line" />}
                            type="primary"
                            style={{ right: 24, bottom: 24 }}
                        />
                    </div>
                </BaseCard>

                {/* Splitter */}
                <BaseCard title="Splitter">
                    <BaseSplitter style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                        <BaseSplitter.Panel defaultSize="40%" min="20%" max="70%">
                            <div style={{ padding: 16 }}>Left Panel</div>
                        </BaseSplitter.Panel>
                        <BaseSplitter.Panel>
                            <div style={{ padding: 16 }}>Right Panel</div>
                        </BaseSplitter.Panel>
                    </BaseSplitter>
                </BaseCard>

                {/* Anchor */}
                <BaseCard title="Anchor">
                    <BaseAnchor
                        items={[
                            { key: 'buttons', href: '#buttons', title: 'Buttons' },
                            { key: 'typography', href: '#typography', title: 'Typography' },
                            { key: 'forms', href: '#forms', title: 'Forms' },
                        ]}
                    />
                </BaseCard>

                {/* AutoComplete */}
                <BaseCard title="AutoComplete">
                    <BaseAutoComplete
                        style={{ width: 200 }}
                        options={[
                            { value: 'Option 1' },
                            { value: 'Option 2' },
                            { value: 'Option 3' },
                        ]}
                        placeholder="Type to search"
                    />
                </BaseCard>

                {/* Cascader */}
                <BaseCard title="Cascader">
                    <BaseCascader
                        options={[
                            {
                                value: 'zhejiang',
                                label: 'Zhejiang',
                                children: [
                                    { value: 'hangzhou', label: 'Hangzhou' },
                                    { value: 'ningbo', label: 'Ningbo' },
                                ],
                            },
                        ]}
                        placeholder="Please select"
                    />
                </BaseCard>

                {/* Mentions */}
                <BaseCard title="Mentions">
                    <BaseMentions
                        style={{ width: '100%' }}
                        placeholder="Use @ to mention people"
                        options={[
                            { value: 'John', label: 'John' },
                            { value: 'Jane', label: 'Jane' },
                            { value: 'Bob', label: 'Bob' },
                        ]}
                    />
                </BaseCard>

                {/* Transfer */}
                <BaseCard title="Transfer">
                    <BaseTransfer
                        dataSource={[
                            { key: '1', title: 'Item 1' },
                            { key: '2', title: 'Item 2' },
                            { key: '3', title: 'Item 3' },
                        ]}
                        targetKeys={[]}
                        render={(item) => item.title}
                    />
                </BaseCard>

                {/* TreeSelect */}
                <BaseCard title="TreeSelect">
                    <BaseTreeSelect
                        style={{ width: '100%' }}
                        treeData={treeData}
                        placeholder="Please select"
                    />
                </BaseCard>

                {/* Masonry */}
                <BaseCard title="Masonry Layout">
                    <BaseMasonry columns={3} gap={16}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <BaseCard key={item} size="small">
                                <Text>Card {item}</Text>
                            </BaseCard>
                        ))}
                    </BaseMasonry>
                </BaseCard>

                {/* Notification & Message Demo */}
                <BaseCard title="Notification & Message">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }}>
                        <div>
                            <Text strong>Messages (Top center toast):</Text>
                            <BaseSpace wrap style={{ marginTop: 8 }}>
                                <BaseButton onClick={() => baseMessage.success('Success message!')}>
                                    Success Message
                                </BaseButton>
                                <BaseButton onClick={() => baseMessage.error('Error message!')}>
                                    Error Message
                                </BaseButton>
                                <BaseButton onClick={() => baseMessage.warning('Warning message!')}>
                                    Warning Message
                                </BaseButton>
                                <BaseButton onClick={() => baseMessage.info('Info message!')}>
                                    Info Message
                                </BaseButton>
                                <BaseButton onClick={() => baseMessage.loading('Loading...', 2)}>
                                    Loading Message
                                </BaseButton>
                            </BaseSpace>
                        </div>
                        <BaseDivider />
                        <div>
                            <Text strong>Notifications (Corner notifications):</Text>
                            <BaseSpace wrap style={{ marginTop: 8 }}>
                                <BaseButton onClick={() => baseNotification.success({
                                    message: 'Success Notification',
                                    description: 'This is a success notification with description.'
                                })}>
                                    Success Notification
                                </BaseButton>
                                <BaseButton onClick={() => baseNotification.error({
                                    message: 'Error Notification',
                                    description: 'This is an error notification with description.'
                                })}>
                                    Error Notification
                                </BaseButton>
                                <BaseButton onClick={() => baseNotification.warning({
                                    message: 'Warning Notification',
                                    description: 'This is a warning notification with description.'
                                })}>
                                    Warning Notification
                                </BaseButton>
                                <BaseButton onClick={() => baseNotification.info({
                                    message: 'Info Notification',
                                    description: 'This is an info notification with description.'
                                })}>
                                    Info Notification
                                </BaseButton>
                            </BaseSpace>
                        </div>
                    </BaseSpace>
                </BaseCard>

                {/* Tour */}
                <BaseCard title="Tour (Guided Tour)">
                    <BaseTour
                        open={false}
                        steps={[
                            { title: 'Step 1', description: 'This is step 1' },
                            { title: 'Step 2', description: 'This is step 2' },
                        ]}
                    />
                    <Text>Tour component is available for guided walkthroughs</Text>
                </BaseCard>

                {/* Layout Components */}
                <BaseCard title="Layout Components">
                    <Text strong>BaseLayout with Header, Content, Footer, Sider:</Text>
                    <BaseLayout style={{ minHeight: 200, marginTop: 16 }}>
                        <BaseLayout.Header style={{ background: '#7dbcea', color: 'white', padding: '0 16px' }}>
                            Header
                        </BaseLayout.Header>
                        <BaseLayout>
                            <BaseLayout.Sider style={{ background: '#3ba0e9', color: 'white' }} width={100}>
                                Sider
                            </BaseLayout.Sider>
                            <BaseLayout.Content style={{ background: '#108ee9', color: 'white', padding: 16 }}>
                                Content
                            </BaseLayout.Content>
                        </BaseLayout>
                        <BaseLayout.Footer style={{ background: '#7dbcea', color: 'white', padding: '0 16px' }}>
                            Footer
                        </BaseLayout.Footer>
                    </BaseLayout>
                </BaseCard>

                {/* Advanced Layout Components */}
                <BaseCard title="Advanced Layout Components">
                    <BaseSpace orientation="vertical" style={{ width: '100%' }} size="large">
                        <div>
                            <Title level={4}>Desktop Layout</Title>
                            <Text type="secondary">
                                Full-featured desktop layout with sidebar, top bar, and content area.
                                Used for desktop and tablet screens (≥768px).
                            </Text>
                            <div style={{
                                marginTop: 16,
                                border: '1px solid #d9d9d9',
                                borderRadius: 8,
                                overflow: 'hidden',
                                height: 400
                            }}>
                                <DesktopLayout
                                    theme={theme}
                                    layout={{ sidebarCollapsed: false, screenWidth: 1200 }}
                                    topBar={
                                        <div style={{
                                            height: 52,
                                            background: theme.token.colorPrimaryBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 16px',
                                            borderBottom: `1px solid ${theme.token.colorBorder}`
                                        }}>
                                            <Text strong>Desktop Top Bar</Text>
                                        </div>
                                    }
                                    sidebar={
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 260,
                                            background: theme.token.colorBgContainer,
                                            borderRight: `1px solid ${theme.token.colorBorder}`,
                                            padding: 16
                                        }}>
                                            <Text strong>Sidebar</Text>
                                            <div style={{ marginTop: 16 }}>
                                                <div style={{ padding: '8px 0' }}>Menu Item 1</div>
                                                <div style={{ padding: '8px 0' }}>Menu Item 2</div>
                                                <div style={{ padding: '8px 0' }}>Menu Item 3</div>
                                            </div>
                                        </div>
                                    }
                                    breadcrumb={
                                        <div style={{ padding: '12px 0' }}>
                                            <BaseBreadcrumb>
                                                <BaseBreadcrumb.Item>Home</BaseBreadcrumb.Item>
                                                <BaseBreadcrumb.Item>Kitchen Sink</BaseBreadcrumb.Item>
                                            </BaseBreadcrumb>
                                        </div>
                                    }
                                    currentPath="/kitchen-sink"
                                >
                                    <BaseCard>
                                        <Text>Main content area with automatic spacing and theming</Text>
                                    </BaseCard>
                                </DesktopLayout>
                            </div>
                        </div>

                        <BaseDivider />

                        <div>
                            <Title level={4}>Mobile Layout</Title>
                            <Text type="secondary">
                                Optimized mobile layout with header and bottom navigation.
                                Used for mobile screens (&lt;768px).
                            </Text>
                            <div style={{
                                marginTop: 16,
                                border: '1px solid #d9d9d9',
                                borderRadius: 8,
                                overflow: 'hidden',
                                height: 500,
                                maxWidth: 375,
                                margin: '16px auto'
                            }}>
                                <MobileLayout
                                    theme={theme}
                                    header={
                                        <div style={{
                                            height: 56,
                                            background: theme.token.colorPrimary,
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0 16px'
                                        }}>
                                            <i className="ri-menu-line" style={{ fontSize: 24 }} />
                                            <Text strong style={{ color: 'white' }}>Mobile Header</Text>
                                            <i className="ri-more-line" style={{ fontSize: 24 }} />
                                        </div>
                                    }
                                    bottomNavigation={
                                        <div style={{
                                            height: 56,
                                            background: theme.token.colorBgContainer,
                                            borderTop: `1px solid ${theme.token.colorBorder}`,
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <i className="ri-home-line" style={{ fontSize: 24 }} />
                                                <div style={{ fontSize: 12 }}>Home</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <i className="ri-search-line" style={{ fontSize: 24 }} />
                                                <div style={{ fontSize: 12 }}>Search</div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <i className="ri-user-line" style={{ fontSize: 24 }} />
                                                <div style={{ fontSize: 12 }}>Profile</div>
                                            </div>
                                        </div>
                                    }
                                    currentPath="/kitchen-sink"
                                >
                                    <BaseCard>
                                        <Text>Mobile content area with touch-optimized spacing</Text>
                                    </BaseCard>
                                </MobileLayout>
                            </div>
                        </div>

                        <BaseDivider />

                        <div>
                            <Title level={4}>Responsive Layout</Title>
                            <Text type="secondary">
                                Automatically switches between desktop and mobile layouts based on screen size.
                                Provides a unified API for responsive applications.
                            </Text>
                            <div style={{ marginTop: 16 }}>
                                <BaseAlert
                                    message="Responsive Layout Info"
                                    description="The ResponsiveLayout component automatically detects screen size and renders the appropriate layout. It uses DesktopLayout for screens ≥768px and MobileLayout for smaller screens."
                                    type="info"
                                    showIcon
                                />
                            </div>
                        </div>

                        <BaseDivider />

                        <div>
                            <Title level={4}>Layout Sub-Components</Title>
                            <Text type="secondary">Additional layout components available:</Text>
                            <BaseList
                                style={{ marginTop: 16 }}
                                dataSource={[
                                    { name: 'DesktopTopBar', desc: 'Top navigation bar for desktop layout' },
                                    { name: 'DesktopSidebar', desc: 'Collapsible sidebar for desktop layout' },
                                    { name: 'MobileHeader', desc: 'Header component for mobile layout' },
                                    { name: 'MobileBottomNavigation', desc: 'Bottom navigation for mobile layout' },
                                    { name: 'MobileMoreMenu', desc: 'More menu drawer for mobile' },
                                    { name: 'MobileProfileDropdown', desc: 'Profile dropdown for mobile' },
                                    { name: 'NotificationDropdown', desc: 'Shared notification dropdown' },
                                    { name: 'ResponsiveLayoutProvider', desc: 'Context provider for responsive layouts' },
                                ]}
                                renderItem={(item) => (
                                    <BaseList.Item>
                                        <BaseList.Item.Meta
                                            title={<Text strong>{item.name}</Text>}
                                            description={item.desc}
                                        />
                                    </BaseList.Item>
                                )}
                            />
                        </div>
                    </BaseSpace>
                </BaseCard>

                {/* Not Found Page */}
                <BaseCard title="Not Found Page Component">
                    <div style={{ height: 300, border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
                        <NotFoundPage />
                    </div>
                </BaseCard>

                {/* Full Screen Loader */}
                <BaseCard title="Full Screen Loader">
                    <BaseSpace orientation="vertical">
                        <Text>FullScreenLoader component (used for full-page loading states)</Text>
                        <BaseButton
                            type="primary"
                            onClick={() => {
                                setShowFullScreenLoader(true);
                                setTimeout(() => setShowFullScreenLoader(false), 3000);
                            }}
                        >
                            Show Full Screen Loader (3s)
                        </BaseButton>
                    </BaseSpace>
                    {showFullScreenLoader && (
                        <div style={{ height: 200, position: 'relative', border: '1px solid #d9d9d9', marginTop: 16 }}>
                            <FullScreenLoader />
                        </div>
                    )}
                </BaseCard>

            </BaseSpace>
        </div>
    );
};

export default KitchenSink;
