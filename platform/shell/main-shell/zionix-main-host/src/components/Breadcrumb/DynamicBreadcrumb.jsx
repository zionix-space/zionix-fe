import { Breadcrumb, theme } from 'antd';
import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStyles } from './DynamicBreadcrumb.style';

const { useToken } = theme;

const DynamicBreadcrumb = () => {
    const { token } = useToken();
    const location = useLocation();
    const navigate = useNavigate();
    const styles = useStyles(token);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Parse the current path into breadcrumb items - skip IDs and dynamic params
    const breadcrumbItems = useMemo(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        // Build breadcrumb items from path segments, filtering out IDs
        const items = pathSegments
            .map((segment, index) => {
                // Check if segment is a UUID or numeric ID (skip these)
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
                const isNumericId = /^\d+$/.test(segment);

                // Skip dynamic params (IDs)
                if (isUUID || isNumericId) {
                    return null;
                }

                const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

                // Format segment name (convert kebab-case to Title Case)
                const label = segment
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                return {
                    title: label,
                    path,
                    onClick: () => navigate(path),
                };
            })
            .filter(item => item !== null); // Remove null items (IDs)

        return items;
    }, [location.pathname, navigate]);

    // Don't render if no breadcrumb items
    if (breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <div style={styles.container}>
            <Breadcrumb
                separator={<i className="ri-arrow-right-s-line" style={styles.separator} />}
                items={breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;
                    const isHovered = hoveredIndex === index;

                    return {
                        title: (
                            <span
                                style={
                                    isLast
                                        ? styles.currentItem
                                        : isHovered
                                            ? styles.itemHovered
                                            : styles.item
                                }
                                onClick={!isLast ? item.onClick : undefined}
                                onMouseEnter={() => !isLast && setHoveredIndex(index)}
                                onMouseLeave={() => !isLast && setHoveredIndex(null)}
                            >
                                {item.title}
                            </span>
                        ),
                    };
                })}
            />
        </div>
    );
};

export default DynamicBreadcrumb;
