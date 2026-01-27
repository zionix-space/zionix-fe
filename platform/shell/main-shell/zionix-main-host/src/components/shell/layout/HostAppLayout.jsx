import React from "react";
import { ResponsiveLayoutProvider } from "@zionix-space/design-system/layouts";
import ResponsiveLayout from "./shared/adapters/ResponsiveLayoutAdapter";

const HostAppLayout = ({ children }) => {
  return (
    <ResponsiveLayoutProvider>
      <ResponsiveLayout>{children}</ResponsiveLayout>
    </ResponsiveLayoutProvider>
  );
};

export default HostAppLayout;
