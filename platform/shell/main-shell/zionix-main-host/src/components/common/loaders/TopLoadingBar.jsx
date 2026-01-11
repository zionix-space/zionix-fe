import { Progress, theme } from 'antd';
import { useEffect } from 'react';
import { useTopLoadingBar } from '../../../data/hooks/loaders/useTopLoadingBar';
import { useMenuQuery } from '../../../data/hooks/menu/useMenuQuery';
import { useStyles } from './TopLoadingBar.style';

/**
 * Top Loading Bar - Always at the very top of viewport
 * Theme-aware with dark mode support using CSS-in-JS
 * Automatically hides when there's a menu query error
 */
const TopLoadingBar = () => {
    const { progress, isLoading } = useTopLoadingBar();
    const { isError: isMenuError } = useMenuQuery();
    const { token } = theme.useToken();
    const styles = useStyles(token);

    // Inject global CSS to ensure no margins on Progress component
    useEffect(() => {
        const styleId = 'top-loading-bar-override';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .top-loading-bar-progress,
                .top-loading-bar-progress .ant-progress,
                .top-loading-bar-progress .ant-progress-outer,
                .top-loading-bar-progress .ant-progress-inner,
                .top-loading-bar-progress .ant-progress-bg {
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: 0 !important;
                    display: block !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Don't show loader if there's a menu error
    if (!isLoading || isMenuError) return null;

    return (
        <div style={styles.container}>
            <Progress
                percent={progress}
                showInfo={false}
                strokeColor={token.colorPrimary}
                trailColor="transparent"
                size={[null, 3]}
                status="active"
                style={{
                    margin: 0,
                    padding: 0,
                    lineHeight: 0,
                    height: '3px',
                }}
                className="top-loading-bar-progress"
            />
        </div>
    );
};

export default TopLoadingBar;
