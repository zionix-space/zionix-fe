import React from "react";
import { useTheme } from "@zionix/design-system";
import { ResponsiveLayoutProvider } from "./shared/ResponsiveLayoutProvider";
import { MenuDataProvider } from "./shared/MenuDataProvider";
import ResponsiveLayout from "./ResponsiveLayout";

const HostAppLayout = ({ children }) => {
  const { token } = useTheme();
  
  return (
    <ResponsiveLayoutProvider>
      <MenuDataProvider>
        <ResponsiveLayout>
          {children || (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: token?.colorTextSecondary,
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
