import React, { useState } from 'react';
import {
    BaseRow as Row,
    BaseCol as Col,
    BaseCard as Card,
    BaseAvatar as Avatar,
    BaseProgress as Progress,
    BaseMenu as Menu,
    BaseInput as Input,
    BaseSelect as Select,
    BaseDatePicker as DatePicker,
    BaseButton as Button,
    BaseForm as Form,
    baseMessage as message,
    BaseSwitch as Switch,
    BaseColorPicker as ColorPicker,
    BaseDivider as Divider,
    useTheme,
} from '@zionix-space/design-system';
import { useStyles } from './ProfilePage.style';
import dayjs from 'dayjs';

const ProfilePage = () => {
    const { token, isDarkMode, isRTL, toggleRTL, primaryColor, setPrimaryColor } = useTheme();
    const styles = useStyles(token, isDarkMode);
    const [form] = Form.useForm();

    // Active menu state
    const [activeMenu, setActiveMenu] = useState('personal-info');

    // Mock user data - replace with actual data from your auth store
    const [userData, setUserData] = useState({
        firstName: 'Chris',
        lastName: 'Johnson',
        nickname: '@john1989',
        sex: 'male',
        birthday: dayjs('2022-01-26'),
        language: 'english',
        phone: '+1 814 351 9459',
        email: 'chrisjohnson@afterbe.com',
        emailVerified: true,
        country: 'United Kingdom of Great Britain and Northern Ireland',
        city: 'London',
        address1: '14 London Road',
        address2: '',
        avatar: 'https://i.pravatar.cc/150?img=12',
        profileCompletion: 90,
    });

    // Handle menu click
    const handleMenuClick = (e) => {
        setActiveMenu(e.key);
    };

    // Handle form submission
    const handleSave = async (values) => {
        try {
            // Here you would typically make an API call to save the data
            console.log('Saving profile data:', values);
            setUserData({ ...userData, ...values });
            message.success('Profile updated successfully!');
        } catch (error) {
            message.error('Failed to update profile');
        }
    };

    // Menu items for profile sections
    const menuItems = [
        {
            key: 'personal-info',
            icon: <i className="ri-user-line" />,
            label: 'Personal Info',
        },
        {
            key: 'security',
            icon: <i className="ri-shield-keyhole-line" />,
            label: 'Security Settings',
        },
        {
            key: 'notifications',
            icon: <i className="ri-notification-3-line" />,
            label: 'Notifications',
        },
        {
            key: 'settings',
            icon: <i className="ri-settings-3-line" />,
            label: 'Settings',
        },
    ];

    return (
        <div style={styles.container}>
            <Row gutter={[24, 24]}>
                {/* Left Sidebar - Profile Card */}
                <Col xs={24} sm={24} md={8} lg={6}>
                    <Card variant="borderless">
                        {/* Avatar with gradient border */}
                        <div style={styles.avatarContainer}>
                            <div style={styles.avatarGradientBorder}>
                                <Avatar src={userData.avatar} size={120} style={styles.avatar} />
                            </div>
                        </div>

                        {/* User Info */}
                        <div style={styles.userInfo}>
                            <h2 style={styles.userName}>
                                {userData.firstName} {userData.lastName}
                            </h2>
                            <p style={styles.userNickname}>{userData.nickname}</p>
                        </div>

                        {/* Profile Completion */}
                        <div style={styles.progressContainer}>
                            <Progress
                                percent={userData.profileCompletion}
                                strokeColor={{
                                    '0%': '#FF6B6B',
                                    '50%': '#FFA500',
                                    '100%': '#4CAF50',
                                }}
                                trailColor={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}
                                size={[null, 6]}
                                showInfo={false}
                            />
                            <p style={styles.progressLabel}>Fullness of your profile</p>
                        </div>

                        {/* Navigation Menu */}
                        <Menu
                            mode="vertical"
                            selectedKeys={[activeMenu]}
                            onClick={handleMenuClick}
                            items={menuItems}
                            style={styles.menu}
                        />
                    </Card>
                </Col>

                {/* Right Content - Form */}
                <Col xs={24} sm={24} md={16} lg={18}>
                    <Card variant="borderless">
                        {activeMenu === 'personal-info' && (
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={userData}
                                onFinish={handleSave}
                                requiredMark={false}
                            >
                                <h2 style={styles.sectionTitle}>Personal Info</h2>

                                {/* Personal Info Section */}
                                <Row gutter={[24, 8]}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>* First Name</span>}
                                            name="firstName"
                                            rules={[{ required: true, message: 'Please enter your first name' }]}
                                        >
                                            <Input placeholder="Chris" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>* Last Name</span>}
                                            name="lastName"
                                            rules={[{ required: true, message: 'Please enter your last name' }]}
                                        >
                                            <Input placeholder="Johnson" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 8]}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Nickname</span>} name="nickname">
                                            <Input placeholder="@john1989" prefix={<i className="ri-at-line" />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Sex</span>} name="sex">
                                            <Select
                                                placeholder="Select"
                                                suffixIcon={<i className="ri-arrow-down-s-line" />}

                                            >
                                                <Select.Option value="male">
                                                    <i className="ri-men-line" style={{ marginRight: 8 }} />
                                                    Male
                                                </Select.Option>
                                                <Select.Option value="female">
                                                    <i className="ri-women-line" style={{ marginRight: 8 }} />
                                                    Female
                                                </Select.Option>
                                                <Select.Option value="other">Other</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 8]}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Birthday</span>} name="birthday">
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                format="MM/DD/YYYY"
                                                placeholder="01/26/2022"
                                                suffixIcon={<i className="ri-calendar-line" />}

                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Language</span>} name="language">
                                            <Select
                                                placeholder="Select"
                                                suffixIcon={<i className="ri-arrow-down-s-line" />}

                                            >
                                                <Select.Option value="english">
                                                    <span style={{ marginRight: 8 }}>🇬🇧</span>
                                                    English
                                                </Select.Option>
                                                <Select.Option value="spanish">
                                                    <span style={{ marginRight: 8 }}>🇪🇸</span>
                                                    Spanish
                                                </Select.Option>
                                                <Select.Option value="french">
                                                    <span style={{ marginRight: 8 }}>🇫🇷</span>
                                                    French
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Contact Info Section */}
                                <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Contact Info</h2>

                                <Row gutter={[24, 8]}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Phone</span>} name="phone">
                                            <Input placeholder="+1 814 351 9459" prefix={<i className="ri-phone-line" />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Email</span>} name="email">
                                            <Input
                                                placeholder="chrisjohnson@afterbe.com"
                                                prefix={<i className="ri-mail-line" />}

                                                suffix={
                                                    userData.emailVerified && (
                                                        <span style={styles.verifiedBadge}>
                                                            <i className="ri-checkbox-circle-fill" />
                                                            Verified
                                                        </span>
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Address Section */}
                                <h2 style={{ ...styles.sectionTitle, marginTop: '32px' }}>Address</h2>

                                <Row gutter={[24, 8]}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Country</span>} name="country">
                                            <Select
                                                placeholder="Select"
                                                showSearch
                                                suffixIcon={<i className="ri-arrow-down-s-line" />}

                                            >
                                                <Select.Option value="United Kingdom of Great Britain and Northern Ireland">
                                                    <span style={{ marginRight: 8 }}>🇬🇧</span>
                                                    United Kingdom of Great Britain and Northern...
                                                </Select.Option>
                                                <Select.Option value="United States">
                                                    <span style={{ marginRight: 8 }}>🇺🇸</span>
                                                    United States
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>City</span>} name="city">
                                            <Input placeholder="London" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[24, 8]}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Address 1</span>} name="address1">
                                            <Input placeholder="14 London Road" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label={<span style={{ fontSize: '12px', color: token.colorTextSecondary }}>Address 2</span>} name="address2">
                                            <Input placeholder="Optional" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* Action Buttons */}
                                <div style={styles.actionButtons}>
                                    <Button
                                        type="default"

                                        onClick={() => form.resetFields()}
                                        style={styles.cancelButton}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"

                                        htmlType="submit"
                                        style={styles.saveButton}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </Form>
                        )}

                        {activeMenu === 'security' && (
                            <div>
                                <h2 style={styles.sectionTitle}>Security Settings</h2>
                                <p style={styles.placeholderText}>Security settings content goes here...</p>
                            </div>
                        )}

                        {activeMenu === 'notifications' && (
                            <div>
                                <h2 style={styles.sectionTitle}>Notifications</h2>
                                <p style={styles.placeholderText}>Notification settings content goes here...</p>
                            </div>
                        )}

                        {activeMenu === 'settings' && (
                            <div>
                                <h2 style={styles.sectionTitle}>Settings</h2>

                                {/* Theme Customization Section */}
                                <div style={{ marginTop: '24px' }}>
                                    <h3 style={{
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: token.colorText,
                                        marginBottom: '16px'
                                    }}>
                                        Theme Customization
                                    </h3>

                                    {/* RTL Mode Toggle */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        background: token.colorBgContainer,
                                        borderRadius: token.borderRadius,
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                marginBottom: '4px'
                                            }}>
                                                <i className="ri-text-direction-r" style={{
                                                    fontSize: '20px',
                                                    color: token.colorPrimary
                                                }} />
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: token.colorText
                                                }}>
                                                    RTL Mode
                                                </span>
                                            </div>
                                            <p style={{
                                                fontSize: '13px',
                                                color: token.colorTextSecondary,
                                                margin: 0,
                                                paddingLeft: '32px'
                                            }}>
                                                Enable right-to-left text direction for languages like Arabic and Hebrew
                                            </p>
                                        </div>
                                        <Switch
                                            checked={isRTL}
                                            onChange={toggleRTL}
                                            style={{ marginLeft: '16px' }}
                                        />
                                    </div>

                                    {/* Primary Color Picker */}
                                    <div style={{
                                        padding: '16px',
                                        background: token.colorBgContainer,
                                        borderRadius: token.borderRadius,
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '4px'
                                        }}>
                                            <i className="ri-palette-line" style={{
                                                fontSize: '20px',
                                                color: token.colorPrimary
                                            }} />
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: token.colorText
                                            }}>
                                                Primary Color
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '13px',
                                            color: token.colorTextSecondary,
                                            margin: '0 0 16px 0',
                                            paddingLeft: '32px'
                                        }}>
                                            Customize the primary color theme for your interface
                                        </p>
                                        <div style={{ paddingLeft: '32px' }}>
                                            <ColorPicker
                                                value={primaryColor}
                                                onChange={(color) => setPrimaryColor(color.toHexString())}
                                                showText
                                                disabledAlpha
                                                presets={[
                                                    {
                                                        label: 'Recommended Colors',
                                                        colors: [
                                                            '#0050d8',
                                                            '#52c41a',
                                                            '#fa8c16',
                                                            '#ff4d4f',
                                                            '#722ed1',
                                                            '#13c2c2',
                                                            '#eb2f96',
                                                            '#001968',
                                                        ],
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;

