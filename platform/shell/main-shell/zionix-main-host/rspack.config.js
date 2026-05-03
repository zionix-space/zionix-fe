const { composePlugins, withNx, withReact } = require("@nx/rspack");
const { withModuleFederation } = require("@nx/rspack/module-federation");
const commonRulesRsPack = require("../../../../tools/deployment/rspack.common");
const baseConfig = require("./module-federation.config");

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  ...baseConfig,
  // Rspack 1.2+ optimizations
  experiments: {
    // Enable persistent cache for 250% faster hot starts
    cache: isDevelopment ? {
      type: 'persistent',
    } : undefined,
    // Enable parallel code splitting for faster builds
    parallelCodeSplitting: true,
  },
  // Production optimizations
  ...(isDevelopment ? {} : {
    optimization: {
      minimize: true,
      usedExports: true,
      sideEffects: true,
      concatenateModules: true,
      providedExports: true,
      innerGraph: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          // React core - separate chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            priority: 40,
            reuseExistingChunk: true,
          },
          // Router - separate chunk
          router: {
            test: /[\\/]node_modules[\\/]react-router-dom[\\/]/,
            name: 'router',
            priority: 35,
            reuseExistingChunk: true,
          },
          // Design system - separate chunk
          designSystem: {
            test: /[\\/]node_modules[\\/]@zionix-space[\\/]design-system[\\/]/,
            name: 'design-system',
            priority: 30,
            reuseExistingChunk: true,
          },
          // Other vendors
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
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
    };

    // Development-specific optimizations
    if (isDevelopment) {
      // Enable faster source maps for development
      config.devtool = 'eval-cheap-module-source-map';

      // Optimize for faster builds with basic chunk splitting
      config.optimization = {
        ...config.optimization,
        minimize: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        // Enable basic chunk splitting for better caching
        splitChunks: {
          chunks: 'async',
          minSize: 20000,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Enable caching for faster rebuilds
      config.cache = true;

      // Optimize module resolution for faster lookups
      config.resolve = {
        ...config.resolve,
        symlinks: false,
        // Reduce resolve attempts
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      };

      // Optimize dev server for faster HMR
      config.devServer = {
        ...config.devServer,
        hot: true,
        liveReload: false,
        compress: false,
        // Reduce file watching overhead
        watchFiles: {
          options: {
            ignored: /node_modules/,
          },
        },
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

      // Enable performance hints in production with strict budgets
      config.performance = {
        hints: 'error',
        maxEntrypointSize: 400000,  // 400KB max for entry
        maxAssetSize: 300000,       // 300KB max per asset
      };
    }

    return config;
  }
);
