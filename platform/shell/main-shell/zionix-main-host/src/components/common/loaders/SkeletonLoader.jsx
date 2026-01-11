import React from 'react';
import { Skeleton, Card, Space } from 'antd';

/**
 * Skeleton Loaders - Fully responsive with theme support
 */

export const TableSkeleton = ({ rows = 5 }) => (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {[...Array(rows)].map((_, index) => (
            <Skeleton.Input
                key={index}
                active
                block
                style={{
                    height: 48,
                    minHeight: '40px',
                    width: '100%',
                }}
            />
        ))}
    </Space>
);

export const CardGridSkeleton = ({ cards = 6, columns = 3 }) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(250px, 100%), 1fr))`,
            gap: '16px',
            width: '100%',
        }}
    >
        {[...Array(cards)].map((_, index) => (
            <Card key={index} style={{ minWidth: 0 }}>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
            </Card>
        ))}
    </div>
);

export const FormSkeleton = ({ fields = 5 }) => (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
        {[...Array(fields)].map((_, index) => (
            <div key={index} style={{ width: '100%' }}>
                <Skeleton.Input
                    active
                    size="small"
                    style={{
                        width: 'min(120px, 100%)',
                        marginBottom: 8,
                        maxWidth: '100%',
                    }}
                />
                <Skeleton.Input
                    active
                    block
                    style={{
                        height: 40,
                        width: '100%',
                    }}
                />
            </div>
        ))}
    </Space>
);

export const DashboardSkeleton = () => (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: '16px',
            width: '100%',
        }}>
            {[...Array(4)].map((_, index) => (
                <Card key={index} style={{ minWidth: 0 }}>
                    <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
            ))}
        </div>

        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '16px',
            width: '100%',
        }}>
            <Card style={{ minWidth: 0 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
            <Card style={{ minWidth: 0 }}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        </div>

        <Card style={{ width: '100%', overflow: 'auto' }}>
            <TableSkeleton rows={5} />
        </Card>
    </Space>
);

export const ListSkeleton = ({ items = 5 }) => (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {[...Array(items)].map((_, index) => (
            <Card key={index} size="small" style={{ width: '100%' }}>
                <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
        ))}
    </Space>
);

export const ProfileSkeleton = () => (
    <Card style={{ width: '100%' }}>
        <div style={{
            display: 'flex',
            gap: '24px',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
        }}>
            <Skeleton.Avatar
                active
                size={120}
                shape="circle"
                style={{
                    minWidth: '80px',
                    width: 'clamp(80px, 30vw, 120px)',
                    height: 'clamp(80px, 30vw, 120px)',
                }}
            />
            <div style={{ flex: 1, minWidth: '200px' }}>
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        </div>
    </Card>
);

const SkeletonLoader = ({ type = 'default', ...props }) => {
    switch (type) {
        case 'table':
            return <TableSkeleton {...props} />;
        case 'cards':
            return <CardGridSkeleton {...props} />;
        case 'form':
            return <FormSkeleton {...props} />;
        case 'dashboard':
            return <DashboardSkeleton {...props} />;
        case 'list':
            return <ListSkeleton {...props} />;
        case 'profile':
            return <ProfileSkeleton {...props} />;
        default:
            return <Skeleton active {...props} />;
    }
};

export default SkeletonLoader;
