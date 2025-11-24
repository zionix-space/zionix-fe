import {BiDi, loadResource, unloadResource} from '@zionix-formEngine/core'

// Updated resource IDs to reference Ant Design instead of RSuite
const resourceIds: Record<BiDi, string> = {
  [BiDi.LTR]: 'antd-ltr-css',
  [BiDi.RTL]: 'antd-rtl-css'
}

/**
 * Loads the Left-To-Right (LTR) CSS for the "antd" (Ant Design) library.
 * Migrated from RSuite to Ant Design.
 * @returns the Promise that resolves when the LTR CSS has been loaded successfully.
 */
export const ltrCssLoader = async () => {
  // Ant Design CSS is already included via package, but we can load custom overrides
  // For now, we'll use Ant Design's default styles which are imported in the app
  // If custom CSS is needed, update the import path below
  const href = 'antd/dist/reset.css' // Ant Design's reset CSS
  await loadResource(resourceIds[BiDi.LTR], href, 'stylesheet')
  unloadResource(resourceIds[BiDi.RTL])
}

/**
 * Loads the Right-to-Left (RTL) CSS for the "antd" (Ant Design) library.
 * Ant Design has built-in RTL support via ConfigProvider direction prop,
 * but additional RTL-specific styles can be loaded here if needed.
 * Migrated from RSuite to Ant Design.
 * @returns the Promise that resolves when the RTL CSS has been loaded successfully.
 */
export const rtlCssLoader = async () => {
  // Ant Design handles RTL through ConfigProvider's direction prop
  // Additional RTL-specific CSS can be loaded here if needed
  const href = 'antd/dist/reset.css' // Ant Design's reset CSS (same for RTL)
  await loadResource(resourceIds[BiDi.RTL], href, 'stylesheet')
  unloadResource(resourceIds[BiDi.LTR])
}

/**
 * Loads FormEngine specific styles over "antd" (Ant Design) library.
 * Updated to work with Ant Design instead of RSuite.
 * @returns the Promise that resolves when the custom styles have been loaded successfully.
 */
export const formEngineRsuiteCssLoader = async () => {
  // FormEngine custom styles for Ant Design
  // Note: CSS file needs to be created/updated to target Ant Design class names instead of RSuite
  // For now, this is a placeholder that doesn't load any CSS
  // TODO: Create formengine-antd.css with Ant Design-compatible styles
  await Promise.resolve()
}
