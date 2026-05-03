const { composePlugins, withNx, withReact } = require('@nx/rspack');
const { withModuleFederation } = require('@nx/rspack/module-federation');

const baseConfig = require('./module-federation.config');
const commonRulesRsPack = require('../../../../tools/deployment/rspack.common');

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
    // Better cleanup handling for Windows
    config.output = config.output || {};
    config.output.clean = {
      keep: /\.gitkeep/,
      dry: false,
    };

    commonRulesRsPack(config);

    // Performance optimizations for adminApp
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      providedExports: true,
      sideEffects: true,
      innerGraph: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          // React vendor chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            priority: 40,
            reuseExistingChunk: true,
          },
          // Ant Design - separate chunk for better caching
          antd: {
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            name: 'antd',
            priority: 30,
            reuseExistingChunk: true,
          },
          // Lowcode - separate chunk
          lowcode: {
            test: /[\\/]node_modules[\\/]@zionix-space[\\/]lowcode[\\/]/,
            name: 'lowcode',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Design system
          designSystem: {
            test: /[\\/]node_modules[\\/]@zionix-space[\\/]design-system[\\/]/,
            name: 'design-system',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Other vendors
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Form builder specific chunk
          formBuilder: {
            test: /[\\/]src[\\/]pages[\\/]FormSetup[\\/]/,
            name: 'form-builder',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      // Enable module concatenation for better tree shaking
      concatenateModules: true,
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
