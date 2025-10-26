import React from "react";
import { ResponsiveLayoutProvider } from "./shared/ResponsiveLayoutProvider";
import { MenuDataProvider } from "./shared/MenuDataProvider";
import ResponsiveLayout from "./ResponsiveLayout";

const HostAppLayout = ({ children }) => {
  return (
    <ResponsiveLayoutProvider>
      <MenuDataProvider>
        <ResponsiveLayout>{children}</ResponsiveLayout>
      </MenuDataProvider>
    </ResponsiveLayoutProvider>
  );
};

export default HostAppLayout;
