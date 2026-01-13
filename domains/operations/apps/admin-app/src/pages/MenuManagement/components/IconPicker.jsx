import { useState } from 'react';
import { Input, Popover, Button, Space } from 'antd';
import { useStyles } from './IconPicker.style';
import { theme } from 'antd';

const { useToken } = theme;

// Common RemixIcon classes used in the application
const COMMON_ICONS = [
    'ri-admin-line',
    'ri-apps-line',
    'ri-global-line',
    'ri-kanban-view-2',
    'ri-id-card-line',
    'ri-shield-check-line',
    'ri-user-line',
    'ri-home-5-line',
    'ri-dashboard-line',
    'ri-settings-3-line',
    'ri-file-list-line',
    'ri-folder-line',
    'ri-database-line',
    'ri-server-line',
    'ri-cloud-line',
    'ri-mail-line',
    'ri-phone-line',
    'ri-calendar-line',
    'ri-notification-3-line',
    'ri-message-3-line',
    'ri-search-line',
    'ri-add-line',
    'ri-delete-bin-line',
    'ri-edit-line',
    'ri-save-line',
    'ri-close-line',
    'ri-check-line',
    'ri-arrow-right-line',
    'ri-arrow-left-line',
    'ri-arrow-up-line',
    'ri-arrow-down-line',
    'ri-more-line',
    'ri-menu-line',
    'ri-star-line',
    'ri-heart-line',
    'ri-bookmark-line',
    'ri-share-line',
    'ri-download-line',
    'ri-upload-line',
    'ri-lock-line',
    'ri-unlock-line',
    'ri-eye-line',
    'ri-eye-off-line',
];

const IconPicker = ({ value, onChange }) => {
    const { token } = useToken();
    const [searchValue, setSearchValue] = useState('');
    const [open, setOpen] = useState(false);

    const isDarkMode =
        token.colorBgBase === '#000000' ||
        token.colorBgContainer === '#141414' ||
        token.colorBgElevated === '#1f1f1f' ||
        (token.colorBgContainer &&
            token.colorBgContainer.startsWith('#') &&
            parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

    const styles = useStyles(token, isDarkMode);

    const filteredIcons = COMMON_ICONS.filter((icon) =>
        icon.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleIconSelect = (icon) => {
        onChange?.(icon);
        setOpen(false);
    };

    const handleClear = () => {
        onChange?.('');
        setOpen(false);
    };

    const content = (
        <div style={styles.popoverContent}>
            <Input
                placeholder="Search icons..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                prefix={<i className="ri-search-line" />}
                style={styles.searchInput}
                allowClear
            />
            <div style={styles.iconGrid}>
                {filteredIcons.map((icon) => (
                    <div
                        key={icon}
                        style={{
                            ...styles.iconItem,
                            ...(value === icon ? styles.iconItemSelected : {}),
                        }}
                        onClick={() => handleIconSelect(icon)}
                        title={icon}
                    >
                        <i className={icon} style={styles.iconPreview} />
                    </div>
                ))}
            </div>
            {filteredIcons.length === 0 && (
                <div style={styles.noResults}>No icons found</div>
            )}
            <div style={styles.actions}>
                <Button size="small" onClick={handleClear}>
                    Clear
                </Button>
            </div>
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            placement="bottomLeft"
            overlayStyle={{ width: 320 }}
        >
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder="Enter RemixIcon class or select"
                    prefix={value ? <i className={value} /> : <i className="ri-palette-line" />}
                    style={{ borderRadius: '20px 0 0 20px' }}
                />
                <Button onClick={() => setOpen(true)} style={{ borderRadius: '0 20px 20px 0' }}>
                    <i className="ri-arrow-down-s-line" />
                </Button>
            </Space.Compact>
        </Popover>
    );
};

export default IconPicker;
