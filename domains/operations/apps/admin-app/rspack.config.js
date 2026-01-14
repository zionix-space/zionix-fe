const { composePlugins, withNx, withReact } = require('@nx/rspack');
const { withModuleFederation } = require('@nx/rspack/module-federation');

const baseConfig = require('./module-federation.config');
const commonRulesRsPack = require('../../../../tools/deployment/rspack.common');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  ...baseConfig,
};

// Nx plugins for rspack to build config object from Nx options and context.
/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
module.exports = composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config),
  (config) => {
    commonRulesRsPack(config);

    // Performance optimizations for adminApp
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate antd chunk for better caching
          antd: {
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            name: 'antd',
            chunks: 'all',
            priority: 20,
          },
          // Separate react chunk for better caching
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
          },
          // Form builder specific chunk
          formBuilder: {
            test: /[\\/]src[\\/]pages[\\/]FormSetup[\\/]/,
            name: 'form-builder',
            chunks: 'all',
            priority: 5,
          },
        },
      },
      // Enable module concatenation for better tree shaking
      concatenateModules: true,
      // Enable side effects optimization
      sideEffects: false,
    };

    // Add performance hints - suppress in development
    config.performance = {
      hints: isDevelopment ? false : 'warning',
      maxEntrypointSize: 500000, // 500KB
      maxAssetSize: 300000, // 300KB
    };

    // Optimize resolve for faster builds
    config.resolve = {
      ...config.resolve,
      // Reduce resolve attempts
      symlinks: false,
      // Add path aliases
      alias: {
        ...config.resolve?.alias,
        '@zionix/shared-utilities': require('path').resolve(__dirname, '../../../../platform/core/shared-utilities'),
        '@zionix/apiCore': require('path').resolve(__dirname, '../../../../platform/core/shared-utilities/shared/middleware/axiosCore.js'),
        '@zionix/design-system': require('path').resolve(__dirname, '../../../../platform/core/design-system'),
        '@zionix-formEngine/core': require('path').resolve(__dirname, 'src/pages/FormEngine/core'),
      },
    };

    // Ignore source map warnings for node_modules in development
    if (isDevelopment) {
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /source-map-loader/,
      ];
    }

    return config;
  }
);
