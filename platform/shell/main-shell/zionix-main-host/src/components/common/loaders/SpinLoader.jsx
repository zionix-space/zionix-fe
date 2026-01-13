import React from 'react';
import { Spin } from 'antd';

/**
 * Spin Loaders - Responsive component-level loading
 */

export const FullPageSpinner = ({ tip = 'Loading...' }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            padding: '20px',
        }}
    >
        <Spin size="large" tip={tip} />
    </div>
);

export const ContentSpinner = ({ tip = 'Loading...', height = '400px' }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: height,
            width: '100%',
            padding: '20px',
        }}
    >
        <Spin size="large" tip={tip} />
    </div>
);

export const InlineSpinner = ({ size = 'small' }) => (
    <Spin size={size} />
);

export const ButtonSpinner = () => (
    <i className="ri-loader-4-line" style={{ fontSize: 16 }} />
);

export const CardSpinner = ({ loading, children, tip }) => (
    <Spin spinning={loading} tip={tip}>
        {children}
    </Spin>
);

export const CustomIconSpinner = ({ icon, size = 24 }) => (
    <Spin indicator={<i className="ri-loader-4-line" style={{ fontSize: size }} />} />
);

const SpinLoader = ({
    type = 'default',
    loading = true,
    children,
    ...props
}) => {
    switch (type) {
        case 'fullpage':
            return <FullPageSpinner {...props} />;
        case 'content':
            return <ContentSpinner {...props} />;
        case 'inline':
            return <InlineSpinner {...props} />;
        case 'button':
            return <ButtonSpinner {...props} />;
        case 'card':
            return <CardSpinner loading={loading} {...props}>{children}</CardSpinner>;
        default:
            return <Spin spinning={loading} {...props}>{children}</Spin>;
    }
};

export default SpinLoader;
