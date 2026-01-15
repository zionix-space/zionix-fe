const { composePlugins, withNx, withReact } = require("@nx/rspack");
const { withModuleFederation } = require("@nx/rspack/module-federation");
const commonRulesRsPack = require("../../../../tools/deployment/rspack.common");
const baseConfig = require("./module-federation.config");

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  ...baseConfig,
  // Production optimizations
  ...(isDevelopment ? {} : {
    optimization: {
      minimize: true,
      usedExports: true,
      sideEffects: true,
      concatenateModules: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  }),
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

      // Reduce bundle analysis overhead and suppress warnings
      config.stats = 'errors-warnings';

      // Suppress performance warnings in development
      config.performance = {
        hints: false,
      };

      // Ignore source map warnings for node_modules
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /source-map-loader/,
      ];
    } else {
      // Production optimizations
      config.devtool = 'source-map';

      // Enable performance hints in production
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }

    return config;
  }
);
