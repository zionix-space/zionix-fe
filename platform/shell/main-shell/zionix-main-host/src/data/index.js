/**
 * @fileoverview Data Layer Main Index
 * 
 * Central export point for all data layer modules.
 * Provides clean imports for API services, hooks, stores, and configurations.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

// === API SERVICES ===
export * from './api';

// === HOOKS ===
export * from './hooks';

// === STORES ===
export * from './stores';

// === CONFIGURATIONS ===
export * from './config';

/**
 * @example
 * ```js
 * // Clean imports from data layer
 * import { 
 *   menuService,
 *   useMenuPageData,
 *   useMenuStore,
 *   queryKeys 
 * } from '@/data';
 * ```
 */