import React from 'react';
import { useResponsiveLayout } from './shared/ResponsiveLayoutProvider';

// Import layout components
import { DesktopLayout } from './desktop';
import { MobileLayout } from './mobile';

/**
 * Responsive Layout Component - Automatically switches between mobile and desktop layouts
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {Object} [props.style={}] - Additional inline styles
 */
const ResponsiveLayout = ({ children, className = '', style = {} }) => {
  const { deviceType } = useResponsiveLayout();

  // Mobile Layout (< 768px)
  if (deviceType === 'mobile') {
    return (
      <MobileLayout className={className} style={style}>
        {children}
      </MobileLayout>
    );
  }

  // Desktop Layout (>= 768px) - Used for both desktop and tablet
  return (
    <DesktopLayout className={className} style={style}>
      {children}
    </DesktopLayout>
  );
};

export default ResponsiveLayout;