const { composePlugins, withNx, withReact } = require("@nx/rspack");
const { withModuleFederation } = require("@nx/rspack/module-federation");
const commonRulesRsPack = require("../../../../tools/deployment/rspack.common");
const baseConfig = require("./module-federation.config");
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  ...baseConfig,
};

// Nx plugins for rspack to build config object from Nx options and context.
// DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
// The DTS Plugin can be enabled by setting dts: true
// Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html

module.exports = composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config),
  (config) => {
    commonRulesRsPack(config, isDevelopment);

    // Add path aliases from tsconfig.base.json
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@zionix/shared-utilities': require('path').resolve(__dirname, '../../../../platform/core/shared-utilities'),
      '@zionix/apiCore': require('path').resolve(__dirname, '../../../../platform/core/shared-utilities/shared/middleware/axiosCore.js'),
      '@zionix/design-system': require('path').resolve(__dirname, '../../../../platform/core/design-system'),
    };

    // PWA Configuration - Service worker will be copied via project.json assets config
    // No need for CopyRspackPlugin as Nx handles assets automatically

    // Development-specific optimizations
    if (isDevelopment) {
      // Enable faster source maps for development
      config.devtool = 'eval-cheap-module-source-map';

      // Disable optimization in development for faster builds
      config.optimization = {
        ...config.optimization,
        minimize: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };

      // Enable caching for faster rebuilds (Rspack expects boolean)
      config.cache = true;

      // Optimize module resolution for faster lookups (only supported options)
      config.resolve = {
        ...config.resolve,
        symlinks: false,
      };

      // Optimize dev server for faster HMR
      config.devServer = {
        ...config.devServer,
        hot: true,
        liveReload: false,
        compress: false,
      };

      // Reduce bundle analysis overhead
      config.stats = 'errors-warnings';
    }

    return config;
  }
);
