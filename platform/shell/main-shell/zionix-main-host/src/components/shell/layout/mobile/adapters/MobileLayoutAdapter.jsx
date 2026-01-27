import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { MobileLayout } from '@zionix-space/design-system/layouts';
import { useResponsiveLayout } from '../../shared/ResponsiveLayoutProvider';
import { useMenuData } from '../../../../../data/hooks/menu';
import { QueryErrorFallback } from '../../../../common/QueryErrorBoundary';
import TopLoadingBar from '../../../../common/loaders/TopLoadingBar';
import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
import MobileHeader from './MobileHeaderAdapter';
import MobileBottomNavigation from './MobileBottomNavigationAdapter';

/**
 * MobileLayout Adapter Component
 * Handles business logic and data fetching for MobileLayout
 */
const MobileLayoutAdapter = ({ className = '', style = {} }) => {
    const { token } = useTheme();
    const { deviceType } = useResponsiveLayout();
    const { isError, error } = useMenuData();
    const location = useLocation();

    // Only render on mobile devices
    if (deviceType !== 'mobile') {
        return null;
    }

    // Show error fallback if menu loading failed
    if (isError) {
        return <QueryErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
    }

    return (
        <MobileLayout
            theme={{ token }}
            header={<MobileHeader />}
            bottomNavigation={<MobileBottomNavigation />}
            loadingBar={<TopLoadingBar />}
            currentPath={location.pathname}
            PageTransitionWrapper={PageTransitionWrapper}
            className={className}
            style={style}
        >
            <Outlet />
        </MobileLayout>
    );
};

export default MobileLayoutAdapter;
