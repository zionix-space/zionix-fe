import React from 'react';
import PropTypes from 'prop-types';
import { useResponsiveLayout } from './shared/ResponsiveLayoutProvider';

// Import layout components
import { DesktopLayout } from './desktop';
import { MobileLayout } from './mobile';

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

ResponsiveLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ResponsiveLayout;