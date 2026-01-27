import React, { createContext, useContext, useState, useEffect } from 'react';
import { theme } from '@zionix-space/design-system';

const { useToken } = theme;

// Device types - Simplified to mobile and desktop (desktop includes tablet)
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  DESKTOP: 'desktop' // Desktop now includes tablet sizes
};

// Breakpoints - Simplified to mobile vs desktop/tablet
export const BREAKPOINTS = {
  MOBILE_MAX: 767, // Mobile: < 768px
  DESKTOP_MIN: 768  // Desktop/Tablet: >= 768px
};

// Responsive Layout Context
const ResponsiveLayoutContext = createContext();

// Custom hook for device detection
export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES.DESKTOP);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { token } = useToken();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      // Determine device type based on breakpoints
      if (width <= BREAKPOINTS.MOBILE_MAX) {
        setDeviceType(DEVICE_TYPES.MOBILE);
      } else {
        setDeviceType(DEVICE_TYPES.DESKTOP); // Desktop includes tablet sizes
      }
    };

    // Initial detection
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    deviceType,
    screenWidth,
    isMobile: deviceType === DEVICE_TYPES.MOBILE,
    isDesktop: deviceType === DEVICE_TYPES.DESKTOP,
    breakpoints: BREAKPOINTS,
    token
  };
};

/**
 * Responsive Layout Provider Component - Provides responsive layout context and device detection
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export const ResponsiveLayoutProvider = ({ children }) => {
  const deviceInfo = useDeviceDetection();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (deviceInfo.isMobile) {
      setSidebarCollapsed(true);
      setMobileMenuOpen(false);
    }
  }, [deviceInfo.isMobile]);

  // Load collapsed state from localStorage for desktop/tablet
  useEffect(() => {
    if (!deviceInfo.isMobile) {
      const savedCollapsed = localStorage.getItem('zionix-sidebar-collapsed');
      if (savedCollapsed !== null) {
        setSidebarCollapsed(JSON.parse(savedCollapsed));
      }
    }
  }, [deviceInfo.isMobile]);

  // Save collapsed state to localStorage
  useEffect(() => {
    if (!deviceInfo.isMobile) {
      localStorage.setItem('zionix-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed, deviceInfo.isMobile]);

  const contextValue = {
    ...deviceInfo,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleSidebar: () => setSidebarCollapsed(prev => !prev),
    toggleMobileMenu: () => setMobileMenuOpen(prev => !prev)
  };

  return (
    <ResponsiveLayoutContext.Provider value={contextValue}>
      {children}
    </ResponsiveLayoutContext.Provider>
  );
};



// Custom hook to use responsive layout context
export const useResponsiveLayout = () => {
  const context = useContext(ResponsiveLayoutContext);
  if (!context) {
    throw new Error('useResponsiveLayout must be used within a ResponsiveLayoutProvider');
  }
  return context;
};

// Touch gesture hook for mobile interactions
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    return { isLeftSwipe, isRightSwipe, distance };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  };
};

export default ResponsiveLayoutProvider;