import React from 'react';
import { theme } from 'antd';
import { useResponsiveLayout } from '../shared/ResponsiveLayoutProvider';
import MobileHeader from './MobileHeader';
import MobileBottomNavigation from './MobileBottomNavigation';
import { useStyles } from './MobileLayout.style';

const { useToken } = theme;

/**
 * Mobile Layout Component - Clean and simple mobile layout
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} [props.className=''] - Additional CSS class
 * @param {Object} [props.style={}] - Additional inline styles
 */
const MobileLayout = ({ children, className = '', style = {} }) => {
  const { token } = useToken();
  const styles = useStyles(token);
  
  const { deviceType } = useResponsiveLayout();

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  return (
    <div 
      className={`mobile-layout ${className}`}
      style={{
        ...styles.layoutContainerStyle,
        ...style
      }}
    >
      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content Area */}
      <main
        className="mobile-content"
        style={styles.mainContentStyle}
      >
        <div style={styles.contentWrapperStyle}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation />
    </div>
  );
};

export default MobileLayout;