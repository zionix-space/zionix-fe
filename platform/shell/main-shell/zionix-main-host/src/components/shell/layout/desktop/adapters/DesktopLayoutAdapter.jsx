import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { DesktopLayout } from '@zionix-space/design-system/layouts';
import { useResponsiveLayout } from '@zionix-space/design-system/layouts';
import { useMenuData } from '../../../../../data/hooks/menu';
import { QueryErrorFallback } from '../../../../common/QueryErrorBoundary';
import TopLoadingBar from '../../../../common/loaders/TopLoadingBar';
import { DynamicBreadcrumb } from '../../../../Breadcrumb';
import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
import DesktopTopBar from './DesktopTopBarAdapter';
import DesktopSidebar from './DesktopSidebarAdapter';

/**
 * DesktopLayout Adapter Component
 * Handles business logic and data fetching for DesktopLayout
 */
const DesktopLayoutAdapter = ({ className = '', style = {} }) => {
    const { token, isDarkMode } = useTheme();
    const { isError, error } = useMenuData();
    const location = useLocation();
    const { sidebarCollapsed, setSidebarCollapsed, screenWidth } = useResponsiveLayout();

    // Show error fallback if menu loading failed
    if (isError) {
        return <QueryErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
    }

    return (
        <DesktopLayout
            theme={{ token, isDarkMode }}
            layout={{
                sidebarCollapsed,
                setSidebarCollapsed,
                screenWidth,
            }}
            topBar={<DesktopTopBar />}
            sidebar={
                <DesktopSidebar
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                />
            }
            breadcrumb={<DynamicBreadcrumb />}
            loadingBar={<TopLoadingBar />}
            currentPath={location.pathname}
            PageTransitionWrapper={PageTransitionWrapper}
            className={className}
            style={style}
        >
            <Outlet />
        </DesktopLayout>
    );
};

export default DesktopLayoutAdapter;
