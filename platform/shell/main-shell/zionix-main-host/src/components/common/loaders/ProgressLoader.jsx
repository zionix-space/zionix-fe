import { Progress, Space, Typography, theme } from 'antd';

const { Text } = Typography;

/**
 * Progress Loaders - Fully responsive with theme support
 * All colors use token.colorPrimary for consistency
 */

export const LinearProgress = ({
    percent = 0,
    status = 'active',
    showInfo = true,
    label = null
}) => {
    const { token } = theme.useToken();

    return (
        <Space direction="vertical" style={{ width: '100%', maxWidth: '100%' }}>
            {label && <Text type="secondary" style={{ wordBreak: 'break-word' }}>{label}</Text>}
            <Progress
                percent={percent}
                status={status}
                showInfo={showInfo}
                strokeColor={token.colorPrimary}
                style={{ width: '100%' }}
            />
        </Space>
    );
};

export const CircularProgress = ({
    percent = 0,
    size = 120,
    status = 'active'
}) => {
    const responsiveSize = typeof window !== 'undefined'
        ? Math.min(size, window.innerWidth * 0.3)
        : size;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: '20px',
        }}>
            <Progress
                type="circle"
                percent={percent}
                status={status}
                size={responsiveSize}
            />
        </div>
    );
};

export const DashboardProgress = ({
    percent = 0,
    size = 80,
    strokeColor
}) => {
    const { token } = theme.useToken();
    const responsiveSize = typeof window !== 'undefined'
        ? Math.min(size, window.innerWidth * 0.2)
        : size;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Progress
                type="circle"
                percent={percent}
                size={responsiveSize}
                strokeColor={strokeColor || token.colorPrimary}
            />
        </div>
    );
};

export const StepProgress = ({
    steps = [],
    current = 0
}) => (
    <Space direction="vertical" style={{ width: '100%', maxWidth: '100%' }} size="small">
        {steps.map((step, index) => (
            <div key={index} style={{ width: '100%' }}>
                <Text
                    type={index < current ? 'success' : index === current ? 'primary' : 'secondary'}
                    style={{
                        wordBreak: 'break-word',
                        display: 'block',
                        marginBottom: '4px',
                    }}
                >
                    {step}
                </Text>
                <Progress
                    percent={index < current ? 100 : index === current ? 50 : 0}
                    showInfo={false}
                    status={index < current ? 'success' : 'active'}
                    size={[null, 4]}
                    style={{ width: '100%' }}
                />
            </div>
        ))}
    </Space>
);

export const UploadProgress = ({
    fileName = 'File',
    percent = 0,
    status = 'active'
}) => {
    const { token } = theme.useToken();

    return (
        <Space direction="vertical" style={{ width: '100%', maxWidth: '100%' }} size="small">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px',
                flexWrap: 'wrap',
                width: '100%',
            }}>
                <Text ellipsis style={{ flex: 1, minWidth: 0 }}>{fileName}</Text>
                <Text type="secondary" style={{ flexShrink: 0 }}>{percent}%</Text>
            </div>
            <Progress
                percent={percent}
                status={status}
                showInfo={false}
                strokeColor={token.colorPrimary}
                style={{ width: '100%' }}
            />
        </Space>
    );
};

const ProgressLoader = ({
    type = 'linear',
    ...props
}) => {
    switch (type) {
        case 'linear':
            return <LinearProgress {...props} />;
        case 'circular':
            return <CircularProgress {...props} />;
        case 'dashboard':
            return <DashboardProgress {...props} />;
        case 'steps':
            return <StepProgress {...props} />;
        case 'upload':
            return <UploadProgress {...props} />;
        default:
            return <LinearProgress {...props} />;
    }
};

export default ProgressLoader;
