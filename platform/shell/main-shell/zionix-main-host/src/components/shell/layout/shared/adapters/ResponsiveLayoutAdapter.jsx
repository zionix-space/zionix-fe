import { ResponsiveLayout } from '@zionix-space/design-system/layouts';
import { useResponsiveLayout } from '../ResponsiveLayoutProvider';
import { DesktopLayout } from '../../desktop';
import { MobileLayout } from '../../mobile';

/**
 * ResponsiveLayout Adapter Component
 * Handles device detection and layout switching
 */
const ResponsiveLayoutAdapter = ({ children, className = '', style = {} }) => {
    const { deviceType } = useResponsiveLayout();

    return (
        <ResponsiveLayout
            deviceType={deviceType}
            desktopLayout={<DesktopLayout className={className} style={style}>{children}</DesktopLayout>}
            mobileLayout={<MobileLayout className={className} style={style}>{children}</MobileLayout>}
            className={className}
            style={style}
        >
            {children}
        </ResponsiveLayout>
    );
};

export default ResponsiveLayoutAdapter;
