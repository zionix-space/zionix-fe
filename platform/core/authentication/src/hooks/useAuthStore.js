/**
 * @fileoverview Re-export auth store for Module Federation
 * 
 * This file re-exports the auth store so it can be exposed via Module Federation
 * and used by other microfrontends.
 * 
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

export { useAuthStore, default } from '@zionix/shared-utilities/stores/core/useAuthStore';
