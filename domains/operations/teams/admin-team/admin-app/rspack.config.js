const { composePlugins, withNx, withReact } = require('@nx/rspack');
const { withModuleFederation } = require('@nx/rspack/module-federation');

const baseConfig = require('./module-federation.config');
const commonRulesRsPack = require('../../../../../tools/deployment/rspack.common');

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
  (config, { context }) => {
    commonRulesRsPack(config);
    return config;
  }
);
