import React from "react";
import { useTheme } from "@zionix/design-system";
import { ResponsiveLayoutProvider } from "./shared/ResponsiveLayoutProvider";
import { MenuDataProvider } from "./shared/MenuDataProvider";
import ResponsiveLayout from "./ResponsiveLayout";

const HostAppLayout = ({ children }) => {
  const themeResult = useTheme();
  const token = themeResult?.token;
  
  // Fallback colors if theme tokens are not available
  const fallbackColors = {
    colorTextSecondary: '#666666'
  };
  
  // Debug logging
  if (!token) {
    console.warn('HostAppLayout: Theme tokens not available, using fallback colors');
  }
  
  return (
    <ResponsiveLayoutProvider>
      <MenuDataProvider>
        <ResponsiveLayout>
          {children || (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: token?.colorTextSecondary || fallbackColors.colorTextSecondary,
              fontSize: '16px'
            }}>
              Main content area - your app content goes here
            </div>
          )}
        </ResponsiveLayout>
      </MenuDataProvider>
    </ResponsiveLayoutProvider>
  );
};

export default HostAppLayout;
